/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Device` table. All the data in the column will be lost.
  - Added the required column `sharedSecret` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Device_deviceId_key";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "deviceId",
ADD COLUMN     "sharedSecret" TEXT NOT NULL;
