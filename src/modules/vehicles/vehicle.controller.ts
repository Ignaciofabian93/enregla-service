import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetVehicles = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;

    const count = await prisma.vehicles.count();
    const vehicles = await prisma.vehicles.findMany({
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!vehicles) return res.status(404).json({ error: "No se encontraron vehículos" });

    res.status(200).json({ vehicles, count });
  } catch (error) {
    console.error("Error while trying to get vehicles: ", error);
    res.status(500).json({ error });
  }
};

export const GetVehicleBrands = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicles.findMany();

    if (!vehicles) return res.status(404).json({ error: "No se encontraron vehículos" });

    res.status(200).json({ vehicles });
  } catch (error) {
    console.error("Error while trying to get vehicle brands: ", error);
    res.status(500).json({ error });
  }
};

export const SaveVehicle = async (req: Request, res: Response) => {
  try {
    const { brand, logo } = req.body;

    const newVehicle = await prisma.vehicles.create({
      data: { brand, logo },
    });

    if (!newVehicle)
      return res.status(400).json({ error: "Error al intentar guardar el vehículo" });

    res.status(201).json({ message: "Vehículo registrado correctamente" });
  } catch (error) {
    console.error("Error while trying to save vehicle: ", error);
    res.status(500).json({ error });
  }
};

export const UpdateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { logo, brand } = req.body;
    console.log(id, brand);

    const updatedVehicle = await prisma.vehicles.update({
      where: { id: Number(id) },
      data: { brand, logo },
    });

    if (!updatedVehicle)
      return res.status(400).json({ error: "Error al intentar actualizar el vehículo" });

    res.status(200).json({ message: "Vehículo actualizado correctamente" });
  } catch (error) {
    console.error("Error while trying to update vehicle: ", error);
    res.status(500).json({ error });
  }
};

export const DeleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicles.delete({
      where: { id: Number(id) },
    });

    if (!vehicle) return res.status(404).json({ error: "No se pudo eliminar el vehículo" });

    res.status(200).json({ vehicle });
  } catch (error) {
    console.error("Error while trying to delete vehicle: ", error);
    res.status(500).json({ error });
  }
};
