/*
  Warnings:

  - You are about to alter the column `name` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `rut` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `branch` on the `Vehicles` table. All the data in the column will be lost.
  - You are about to alter the column `model` on the `Vehicles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - A unique constraint covering the columns `[brand]` on the table `Vehicles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `Vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vehicles_branch_key";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role_id" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "rut" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "branch",
ADD COLUMN     "branch_id" INTEGER NOT NULL,
ADD COLUMN     "brand" VARCHAR(250) NOT NULL,
ALTER COLUMN "model" SET DATA TYPE VARCHAR(250);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_brand_key" ON "Vehicles"("brand");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
