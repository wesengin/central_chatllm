-- CreateEnum
CREATE TYPE "AlarmType" AS ENUM ('VITAL_SIGN', 'EWS_HIGH', 'SEPSIS_RISK', 'SUDDEN_DEATH_RISK', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "AlarmSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "monitors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "patientName" TEXT,
    "patientAge" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vital_signs" (
    "id" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "heartRate" DOUBLE PRECISION NOT NULL,
    "bloodPressureSys" DOUBLE PRECISION NOT NULL,
    "bloodPressureDia" DOUBLE PRECISION NOT NULL,
    "respiratoryRate" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "oxygenSaturation" DOUBLE PRECISION NOT NULL,
    "ewsScore" INTEGER NOT NULL,
    "mewsScore" INTEGER NOT NULL,
    "sepsisRisk" DOUBLE PRECISION NOT NULL,
    "suddenDeathRisk" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alarms" (
    "id" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "type" "AlarmType" NOT NULL,
    "severity" "AlarmSeverity" NOT NULL,
    "message" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "alarms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "monitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alarms" ADD CONSTRAINT "alarms_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "monitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

