/*
  Warnings:

  - You are about to drop the `Weatherquery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Weatherquery";

-- CreateTable
CREATE TABLE "weather_queries" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "conditions" TEXT NOT NULL,
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_queries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weather_queries_userId_idx" ON "weather_queries"("userId");

-- CreateIndex
CREATE INDEX "weather_queries_location_idx" ON "weather_queries"("location");
