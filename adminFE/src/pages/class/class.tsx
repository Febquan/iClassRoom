import { Class, Student } from "@/ultis/appType";
import {
  useActiveClass,
  useAdminGetAllClass,
  useDeleteClass,
} from "../customhook/cusHook";

import { DataTable } from "@/components/ui/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "@/ultis/myDayjs";

import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  DeleteIcon,
  GanttChartSquareIcon,
  LockIcon,
  MoreHorizontal,
  Unlock,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { sortByTime } from "@/ultis/classFunctions";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";

export default function ClassManagement() {
  const navigate = useNavigate();
  const columns: ColumnDef<Class>[] = [
    {
      header: "#",
      cell: ({ row }) => {
        return <span>{row.index + 1}</span>;
      },
    },

    {
      accessorKey: "className",
      header: "Class Name",
      cell: ({ row }) => {
        return <span>{row.getValue("className")}</span>;
      },
    },
    {
      accessorKey: "creator",
      header: "Class Owner",
      cell: ({ row }) => {
        const creator: Student = row.getValue("creator");

        return (
          <div className="flex gap-2 items-center  justify-center">
            <Avatar className="h-[40px] w-[42px]">
              <AvatarImage src={creator.avatar} alt="@shadcn" />
              <AvatarFallback>{creator.userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[0.8rem] font-medium leading-non">
                {creator.userName}
              </span>
              <span className="text-[0.6rem] text-muted-foreground">
                {creator.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className=" flex gap-2 justify-center items-center">
          <ArrowUpDown
            className=" cursor-pointer"
            size={16}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
          <span>Create at</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span>{dayjs(row.getValue("createdAt")).format("DD/MM/YYYY")}</span>
        );
      },
    },
    {
      id: "classSize",
      accessorFn: ({ haveStudent }) => haveStudent.length,
      header: ({ column }) => (
        <div className=" flex gap-2 justify-center items-center">
          <ArrowUpDown
            className=" cursor-pointer"
            size={16}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
          <span>Class size</span>
        </div>
      ),

      cell: ({ row }) => {
        return <span>{row.original.haveStudent.length}</span>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        return (
          <span>
            {row.getValue("isActive") ? (
              <Badge>ACTIVE</Badge>
            ) : (
              <Badge variant="destructive">INACTIVE</Badge>
            )}
          </span>
        );
      },
    },

    {
      id: "Manage",
      enableHiding: false,
      header: "Manage",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              navigate(`/classAction/${row.original.id}`);
            }}
          >
            <GanttChartSquareIcon className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Action",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem>
                {row.getValue("isActive") ? (
                  <div
                    className="flex gap-2 justify-center items-center"
                    onClick={() =>
                      mutateActiveClass({
                        id: row.original.id as string,
                        isActive: row.original.isActive as boolean,
                      })
                    }
                  >
                    <LockIcon /> Deactivate class
                  </div>
                ) : (
                  <div
                    className="flex gap-2 justify-center items-center"
                    onClick={() =>
                      mutateActiveClass({
                        id: row.original.id as string,
                        isActive: row.original.isActive as boolean,
                      })
                    }
                  >
                    <Unlock className="text-primary" /> Activate class
                  </div>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div
                  onClick={() => mutateDeleteClass({ id: row.original.id })}
                  className=" flex gap-2 justify-center items-center"
                >
                  <DeleteIcon className="text-destructive" /> Delete class
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const { classes, isSuccess } = useAdminGetAllClass();

  const sortedclasses = classes?.sort(sortByTime);
  const mutateActiveClass = useActiveClass();
  const mutateDeleteClass = useDeleteClass();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: sortedclasses!,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
    },

    onPaginationChange: setPagination,
  });
  if (!isSuccess) {
    return <Spinner></Spinner>;
  }
  return (
    <div className="p-[5rem] flex justify-center items-center">
      <div className=" flex flex-col gap-4 min-w-[60rem]">
        <div className=" flex justify-between">
          <Input
            placeholder="Search for class name"
            value={
              (table.getColumn("className")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("className")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className=" flex gap-2 justify-center items-center">
            <span className="font-semibold text-sm">Page size:</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[1, 15, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {classes && <DataTable table={table}></DataTable>}
      </div>
    </div>
  );
}
