import { Request, Response } from "express";
import { VehicleBrands, VehicleModels } from "./vehicle.types";
import prisma from "../client/prismaclient";

export const GetVehicles = async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const { page, rows } = req.query;
    if (service === "brands") {
      const count = await prisma.vehicleBrands.count();
      const brands: VehicleBrands[] = await prisma.vehicleBrands.findMany({
        skip: (Number(page) - 1) * Number(rows),
        take: Number(rows),
      });
      if (!brands) return res.status(404).json({ message: "No hay marcas de vehículos" });

      return res.status(200).json({ brands, count });
    } else {
      const count = await prisma.vehicleModels.count();
      const models: VehicleModels[] = await prisma.vehicleModels.findMany({
        skip: (Number(page) - 1) * Number(rows),
        take: Number(rows),
      });
      if (!models) return res.status(404).json({ message: "No hay modelos de vehículos" });

      return res.status(200).json({ models, count });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const CreateVehicle = async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const { name, brand_id } = req.body;
    if (service === "brands") {
      const brand = await prisma.vehicleBrands.create({
        data: {
          brand: name,
        },
      });
      if (!brand) return res.status(404).json({ message: "No se pudo crear la marca" });

      return res.status(200).json({ brand });
    } else {
      const model = await prisma.vehicleModels.create({
        data: {
          model: name,
          brand_id: Number(brand_id),
        },
      });
      if (!model) return res.status(404).json({ message: "No se pudo crear el modelo" });

      return res.status(200).json({ model });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const UpdateVehicle = async (req: Request, res: Response) => {
  try {
    const { service, id } = req.params;
    const { name, brand_id } = req.body;
    if (service === "brands") {
      const brand = await prisma.vehicleBrands.update({
        where: {
          id: Number(id),
        },
        data: {
          brand: name,
        },
      });
      if (!brand) return res.status(404).json({ message: "No se pudo actualizar la marca" });

      return res.status(200).json({ brand });
    } else {
      const model = await prisma.vehicleModels.update({
        where: {
          id: Number(id),
        },
        data: {
          model: name,
          brand_id: Number(brand_id),
        },
      });
      if (!model) return res.status(404).json({ message: "No se pudo actualizar el modelo" });

      return res.status(200).json({ model });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const DeleteVehicle = async (req: Request, res: Response) => {
  try {
    const { service, id } = req.params;
    if (service === "brands") {
      const brand = await prisma.vehicleBrands.delete({
        where: {
          id: Number(id),
        },
      });
      if (!brand) return res.status(404).json({ message: "No se pudo eliminar la marca" });

      return res.status(200).json({ brand });
    } else {
      const model = await prisma.vehicleModels.delete({
        where: {
          id: Number(id),
        },
      });
      if (!model) return res.status(404).json({ message: "No se pudo eliminar el modelo" });

      return res.status(200).json({ model });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
