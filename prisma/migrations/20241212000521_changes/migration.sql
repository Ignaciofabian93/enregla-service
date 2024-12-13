/*
  Warnings:

  - You are about to drop the column `vehicle_model_id` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_year` on the `Label` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Label" DROP COLUMN "vehicle_model_id",
DROP COLUMN "vehicle_year";
