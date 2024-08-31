/*
  Warnings:

  - You are about to drop the column `municipality` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_number` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_brand` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_logo` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_model` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `rut` on the `User` table. All the data in the column will be lost.
  - Added the required column `coordinates` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `print_type` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_brand_id` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_model_id` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrong_labels` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Supplies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `VehicleBrands` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_rut_key";

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "municipality";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "location",
DROP COLUMN "price",
DROP COLUMN "purchase_number",
DROP COLUMN "vehicle_brand",
DROP COLUMN "vehicle_logo",
DROP COLUMN "vehicle_model",
ADD COLUMN     "coordinates" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "print_type" TEXT NOT NULL,
ADD COLUMN     "vehicle_brand_id" INTEGER NOT NULL,
ADD COLUMN     "vehicle_model_id" INTEGER NOT NULL,
ADD COLUMN     "wrong_labels" INTEGER NOT NULL,
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Supplies" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rut";

-- AlterTable
ALTER TABLE "VehicleBrands" ADD COLUMN     "logo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BranchSupply" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "supply_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "BranchSupply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BranchSupply" ADD CONSTRAINT "BranchSupply_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSupply" ADD CONSTRAINT "BranchSupply_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "Supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_vehicle_brand_id_fkey" FOREIGN KEY ("vehicle_brand_id") REFERENCES "VehicleBrands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_vehicle_model_id_fkey" FOREIGN KEY ("vehicle_model_id") REFERENCES "VehicleModels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
