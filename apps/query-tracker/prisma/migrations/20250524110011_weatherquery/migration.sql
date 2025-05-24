-- CreateTable
CREATE TABLE "weatherquery" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "conditions" TEXT[],
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weatherquery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weatherquery_userId_idx" ON "weatherquery"("userId");

-- CreateIndex
CREATE INDEX "weatherquery_location_idx" ON "weatherquery"("location");
