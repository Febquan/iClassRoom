import api from "@/axios/axios";
import { DoTest, ExtraTable, userToClass } from "./appType";
import { ColumnDef, Row } from "@tanstack/react-table";

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

  return timeB.getTime() - timeA.getTime();
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
