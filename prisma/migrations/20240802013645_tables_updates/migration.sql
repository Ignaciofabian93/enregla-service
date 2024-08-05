/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `has_logo` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `has_vehicle_plate` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `has_vin` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `labels_quantity` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_id` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `vin` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the `Vehicles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `label_quantity` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_logo` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_plate` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_vin` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_brand` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_logo` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_model` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_vin` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_year` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Made the column `vehicle_plate` on table `Label` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `price` to the `Supplies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_branch_id_fkey";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "telephone" VARCHAR(250);

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "coordinates",
DROP COLUMN "has_logo",
DROP COLUMN "has_vehicle_plate",
DROP COLUMN "has_vin",
DROP COLUMN "labels_quantity",
DROP COLUMN "logo",
DROP COLUMN "vehicle_id",
DROP COLUMN "vin",
ADD COLUMN     "label_quantity" INTEGER NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "show_logo" BOOLEAN NOT NULL,
ADD COLUMN     "show_plate" BOOLEAN NOT NULL,
ADD COLUMN     "show_vin" BOOLEAN NOT NULL,
ADD COLUMN     "vehicle_brand" TEXT NOT NULL,
ADD COLUMN     "vehicle_logo" TEXT NOT NULL,
ADD COLUMN     "vehicle_model" TEXT NOT NULL,
ADD COLUMN     "vehicle_vin" TEXT NOT NULL,
ADD COLUMN     "vehicle_year" TEXT NOT NULL,
ALTER COLUMN "vehicle_plate" SET NOT NULL,
ALTER COLUMN "vehicle_plate" SET DATA TYPE TEXT,
ALTER COLUMN "purchase_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Supplies" DROP COLUMN "category",
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "rut" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(250);

-- DropTable
DROP TABLE "Vehicles";

-- CreateTable
CREATE TABLE "VehicleBrands" (
    "id" SERIAL NOT NULL,
    "brand" VARCHAR(250) NOT NULL,

    CONSTRAINT "VehicleBrands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModels" (
    "id" SERIAL NOT NULL,
    "model" VARCHAR(250) NOT NULL,
    "brand_id" INTEGER NOT NULL,

    CONSTRAINT "VehicleModels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleBrands_brand_key" ON "VehicleBrands"("brand");

-- AddForeignKey
ALTER TABLE "VehicleModels" ADD CONSTRAINT "VehicleModels_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "VehicleBrands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
