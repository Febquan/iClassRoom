import api from "@/axios/axios";
import {
  ClassToStudent,
  DoTest,
  ExtraTable,
  GradePart,
  Test,
  userToClass,
} from "./appType";
import { ColumnDef, Row } from "@tanstack/react-table";
import * as XLSX from "xlsx";
export const fetchAllClass = async (userId: string) => {
  const res = await api.get(`user/class/getAllClass/${userId}`);
  const addedIndexClasses = res.data.classes.map((el: userToClass) => {
    return { ...el, id: el.courseId };
  });
  return addedIndexClasses;
};

export const orderDoTest = (
  doTest: DoTest[],
  studentIdOrder: string[] | undefined
) => {
  const ordered = [];
  if (!studentIdOrder) return [];
  for (const studentId of studentIdOrder) {
    const temp = doTest.find((test) => test.studentId == studentId);
    if (temp) ordered.push(temp);
  }
  return ordered;
};

export const sortByTime = (
  a: { createdAt: string },
  b: { createdAt: string }
) => {
  const timeA = new Date(a.createdAt);
  const timeB = new Date(b.createdAt);

  return timeA.getTime() - timeB.getTime();
};

export const UpperFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

export function createColumnOnDynamicFields(
  fields: string[]
): ColumnDef<ExtraTable>[] {
  return fields.map((el) => ({
    accessorKey: el,
    header: el,
    cell: ({ row }: { row: Row<ExtraTable> }) => row.getValue(el),
  }));
}

export function excludeField(
  obj: Record<string, string>,
  fieldToExclude: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [fieldToExclude]: excludedField, ...rest } = obj;
  return rest;
}

export function checkEqual(a: number | undefined, b: number | undefined) {
  if (!a || !b) return false;
  return Math.abs(a - b) < Number.EPSILON;
}

export function getPosition(string: string, subString: string, index: number) {
  return string.split(subString, index).join(subString).length;
}
export const getFileName = (key: string) => {
  const pos = getPosition(key, "-", 2);
  return key.substring(pos + 1);
};

export function getTestIdOfFile(filekeys: string) {
  const start = getPosition(filekeys, "-", 2);
  const end = getPosition(filekeys, "-", 7);
  return filekeys.substring(start + 1, end);
}
export function getFileNameOfTest(filekeys: string) {
  const start = getPosition(filekeys, "-", 7);

  return filekeys.substring(start + 1);
}

export async function downloadFile(fileKey: string) {
  try {
    const response = await api.post("user/class/presignedS3Url", {
      fileKey,
    });
    const dowloadUrl = response.data.S3PresignedUrl;
    const a = document.createElement("a");
    a.href = dowloadUrl;
    a.download = getFileName(fileKey);
    a.click();
  } catch (error) {
    console.error(error);
  }
}

export function isSameContextObject(objectA: unknown, objectB: unknown) {
  return JSON.stringify(objectA) === JSON.stringify(objectB);
}

export function isOverTime(deadLine: Date | undefined) {
  if (!deadLine) return false;
  return new Date(deadLine) < new Date();
}

export const createtempGradePart = (
  ClassId: string,
  studentIds: string[],
  sort: number
): GradePart => {
  const gradePartId = uuidv4();
  return {
    id: gradePartId,
    name: "New grade",
    scale: 0,
    classID: ClassId,
    sort: sort,
    testid: [createtempTest(studentIds, 0, gradePartId, ClassId)],
  };
};

import { v4 as uuidv4 } from "uuid";
export const createtempTest = (
  studentIds: string[],
  sort: number,
  gradePartId: string,
  classId: string
): Test => {
  const testId = uuidv4();
  const contentId = uuidv4();
  return {
    id: testId,
    name: "New test",
    scale: 0,
    gradePartId: gradePartId,
    sort: sort,
    isFinalize: false,
    isOnline: false,
    deadLine: undefined,
    content: {
      id: uuidv4(),
      content: "",
      title: "",
      fileKeys: [],
      classId: classId,
      receiver: [
        ...studentIds.map((studentId) => ({
          id: uuidv4(),
          receiverId: studentId,
          contentId: contentId,
          comments: [],
        })),
      ],
    },
    doTest: [
      ...studentIds.map((studentId) => ({
        testId: testId,
        studentId: studentId,
        point: null,
        fileKeys: [],
        pendingGradeReview: false,
      })),
    ],
  };
};

export function createExcel(
  gradePart: GradePart[],
  students: ClassToStudent[],
  finalPoints: number[]
) {
  const studentIdOrder = students?.map((student) => student.userId);
  const data = gradePart
    .map((gp) =>
      gp.testid.map((test) =>
        orderDoTest(test.doTest, studentIdOrder).map((dt, i) => ({
          Id: students[i].organizeId,
          Student: students[i].student.userName,
          [gp.name + "-" + test.name]: dt.point,
          Overall: finalPoints[i],
        }))
      )
    )
    .flat(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertedData: any = {};
  data.forEach((entry) => {
    entry.forEach((item) => {
      const { Student, Id, Overall, ...grades } = item;
      if (!convertedData[Student]) {
        convertedData[Student] = { Id, Student, ...grades, Overall };
      } else {
        convertedData[Student] = { ...convertedData[Student], ...grades };
      }
    });
  });
  const temp = Object.values(convertedData);
  if (!temp[0]) return;
  const keys = Object.keys(temp[0]).filter(
    (el) => el != "Id" && el != "Student" && el != "Overall"
  );
  console.log(keys, Object.values(convertedData));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(Object.values(convertedData), {
      header: ["Id", "Student", ...keys, "Overall"],
    }),
    "sample"
  );
  XLSX.writeFile(workbook, "result.xlsx");
}

export function createTemplate(header: string[]) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([{}], {
      header: header,
    }),
    "sample"
  );
  XLSX.writeFile(workbook, "Template.xlsx");
}
