/*
  Warnings:

  - You are about to alter the column `name` on the `Agency` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to drop the column `name` on the `Branch` table. All the data in the column will be lost.
  - You are about to alter the column `location` on the `Branch` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `vehicle_plate` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `vin` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `coordinates` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `purchase_number` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `category` on the `Supplies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `name` on the `Supplies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - Added the required column `address` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agency" ALTER COLUMN "name" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "name",
ADD COLUMN     "address" VARCHAR(250) NOT NULL,
ADD COLUMN     "municipality" VARCHAR(100) NOT NULL,
ALTER COLUMN "location" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "Label" ADD COLUMN     "logo" VARCHAR(100),
ALTER COLUMN "vehicle_plate" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "vin" DROP NOT NULL,
ALTER COLUMN "vin" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "coordinates" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "purchase_number" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "Supplies" ALTER COLUMN "category" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(250);
