/*
  Warnings:

  - Added the required column `duration` to the `Openweatherquery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Openweatherquery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Openweatherquery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Openweatherquery" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;
