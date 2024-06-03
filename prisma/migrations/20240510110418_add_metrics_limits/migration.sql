/*
  Warnings:

  - Added the required column `gender` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxHeartbeat` to the `AnimalSpecies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxRespirationRate` to the `AnimalSpecies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTemperature` to the `AnimalSpecies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minHeartbeat` to the `AnimalSpecies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minRespirationRate` to the `AnimalSpecies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minTemperature` to the `AnimalSpecies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AnimalSpecies_name_key";

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "weight" INTEGER;

-- AlterTable
ALTER TABLE "AnimalSpecies" ADD COLUMN     "maxHeartbeat" INTEGER NOT NULL,
ADD COLUMN     "maxRespirationRate" INTEGER NOT NULL,
ADD COLUMN     "maxTemperature" INTEGER NOT NULL,
ADD COLUMN     "minHeartbeat" INTEGER NOT NULL,
ADD COLUMN     "minRespirationRate" INTEGER NOT NULL,
ADD COLUMN     "minTemperature" INTEGER NOT NULL;
