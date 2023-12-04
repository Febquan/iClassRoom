/*
  Warnings:

  - The values [TEACHER,STUDENT,OWNER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('teacher', 'student');
ALTER TABLE "UserClass" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "UserClass" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "UserClass" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;

-- AlterTable
ALTER TABLE "UserClass" ALTER COLUMN "role" SET DEFAULT 'student';
