import Spinner from "@/components/ui/spinner";
import {
  useAdminGetAllUser,
  useDeleteUser,
  useLockUser,
} from "../customhook/cusHook";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { UserInfo } from "@/ultis/appType";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  DeleteIcon,
  LockIcon,
  MoreHorizontal,
  Unlock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dayjs from "@/ultis/myDayjs";
import { sortByTime } from "@/ultis/classFunctions";

export default function Account() {
  const { users, isSuccess } = useAdminGetAllUser();
  const sortedUsers = users?.sort(sortByTime);
  const columns: ColumnDef<UserInfo>[] = [
    {
      accessorKey: "email",
      header: "Name",
      cell: ({ row }) => {
        return <span>{row.getValue("userName")}</span>;
      },
    },
    {
      accessorKey: "userName",
      header: "Email",
      cell: ({ row }) => {
        return <span>{row.getValue("email")}</span>;
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
      accessorKey: "isOauth",
      header: "Oauth",
      cell: ({ row }) => {
        return <span>{row.getValue("isOauth") ? "true" : "false"}</span>;
      },
    },
    {
      accessorKey: "isVerify",
      header: "Verified",
      cell: ({ row }) => {
        return <span>{row.getValue("isVerify") ? "true" : "false"}</span>;
      },
    },
    {
      accessorKey: "isLock",
      header: "Status",
      cell: ({ row }) => {
        return (
          <span>
            {!row.getValue("isLock") ? (
              <Badge>ACTIVE</Badge>
            ) : (
              <Badge variant="destructive">INACTIVE</Badge>
            )}
          </span>
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
                {!row.original.isLock ? (
                  <div
                    className="flex gap-2 justify-center items-center"
                    onClick={() => {
                      return mutateLockUser({
                        id: row.original.id as string,
                        isLock: row.original.isLock as boolean,
                      });
                    }}
                  >
                    <LockIcon /> Lock user
                  </div>
                ) : (
                  <div
                    className="flex gap-2 justify-center items-center"
                    onClick={() => {
                      return mutateLockUser({
                        id: row.original.id as string,
                        isLock: row.original.isLock as boolean,
                      });
                    }}
                  >
                    <Unlock className="text-primary" /> UnLock user
                  </div>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div
                  onClick={() => mutateDeleteUser({ id: row.original.id })}
                  className=" flex gap-2 justify-center items-center"
                >
                  <DeleteIcon className="text-destructive" /> Delete user
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const mutateLockUser = useLockUser();
  const mutateDeleteUser = useDeleteUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: sortedUsers ? sortedUsers : [],
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

  if (!isSuccess || !users) {
    return <Spinner></Spinner>;
  }
  return (
    <div className="p-[5rem] flex justify-center items-center">
      <div className=" flex flex-col gap-4 min-w-[60rem]">
        <div className=" flex justify-between">
          <Input
            placeholder="Search for name, email..."
            onChange={(event) => {
              const inputValue = event.target.value;
              table.setGlobalFilter(inputValue);
            }}
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
        {sortedUsers && <DataTable table={table}></DataTable>}
      </div>
    </div>
  );
}
