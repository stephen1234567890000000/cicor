/*
  Warnings:

  - You are about to drop the column `userProfileId` on the `requisition_approval` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `requisition_approval` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "requisition_approval" DROP CONSTRAINT "requisition_approval_userProfileId_fkey";

-- DropIndex
DROP INDEX "requisition_approval_userProfileId_idx";

-- AlterTable
ALTER TABLE "requisition_approval" DROP COLUMN "userProfileId",
ADD COLUMN     "roleId" TEXT NOT NULL,
ALTER COLUMN "signature" DROP NOT NULL,
ALTER COLUMN "signAt" DROP NOT NULL,
ALTER COLUMN "signAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "requisition_approval_roleId_idx" ON "requisition_approval"("roleId");

-- AddForeignKey
ALTER TABLE "requisition_approval" ADD CONSTRAINT "requisition_approval_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
