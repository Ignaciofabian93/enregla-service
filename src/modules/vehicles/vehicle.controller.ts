import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetVehicles = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;
    const count = await prisma.vehicleModels.count({
      select: { _all: true },
    });
    const vehicles = await prisma.vehicleModels.findMany({
      include: { brand: { select: { brand: true } } },
    });

    if (!vehicles) return res.status(404).json({ error: "No se encontraron vehículos" });

    res.status(200).json({ vehicles, count });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const SaveVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle } = req.body;

    res.status(201).json({ message: "Vehículo guardado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const UpdateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle } = req.body;

    res.status(201).json({ message: "Vehículo guardado correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const DeleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    res.status(200).json({ message: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
