/*
  Warnings:

  - You are about to drop the column `user_id` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the `VehicleModels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_vehicle_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_vehicle_model_id_fkey";

-- DropForeignKey
ALTER TABLE "VehicleModels" DROP CONSTRAINT "VehicleModels_brand_id_fkey";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "user_id",
ADD COLUMN     "operator_id" INTEGER,
ADD COLUMN     "work_order" TEXT,
ALTER COLUMN "vehicle_plate" DROP NOT NULL,
ALTER COLUMN "vehicle_vin" DROP NOT NULL,
ALTER COLUMN "vehicle_year" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "print_type" DROP NOT NULL,
ALTER COLUMN "vehicle_brand_id" DROP NOT NULL,
ALTER COLUMN "vehicle_model_id" DROP NOT NULL;

-- DropTable
DROP TABLE "VehicleModels";

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_vehicle_brand_id_fkey" FOREIGN KEY ("vehicle_brand_id") REFERENCES "VehicleBrands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
