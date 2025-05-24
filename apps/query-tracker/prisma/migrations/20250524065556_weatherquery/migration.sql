/*
  Warnings:

  - The `conditions` column on the `weather_queries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "weather_queries" DROP COLUMN "conditions",
ADD COLUMN     "conditions" TEXT[];
