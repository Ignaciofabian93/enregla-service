import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetVehicles = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;
    const count = await prisma.vehicleModels.count();
    const vehicles = await prisma.vehicleModels.findMany({
      include: { brand: { select: { brand: true, logo: true } } },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!vehicles) return res.status(404).json({ error: "No se encontraron vehículos" });

    const formattedVehicles = vehicles.map((vehicle) => ({
      ...vehicle,
      brand: vehicle.brand.brand,
      logo: vehicle.brand.logo,
    }));

    res.status(200).json({ vehicles: formattedVehicles, count });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetVehicleBrands = async (req: Request, res: Response) => {
  try {
    const vehicleBrands = await prisma.vehicleBrands.findMany();

    if (!vehicleBrands) return res.status(404).json({ error: "No se encontraron vehículos" });

    res.status(200).json({ brands: vehicleBrands });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetVehicleModels = async (req: Request, res: Response) => {
  try {
    const vehicleModels = await prisma.vehicleModels.findMany({
      include: { brand: { select: { id: true } } },
    });

    if (!vehicleModels)
      return res.status(404).json({ error: "No se encontraron modelos de vehículos" });

    const formattedModels = vehicleModels.map((model) => ({
      ...model,
      brand_id: model.brand.id,
    }));

    res.status(200).json({ models: formattedModels });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const SaveVehicle = async (req: Request, res: Response) => {
  try {
    const { model, brand_id, brand, logo } = req.body;

    let new_brand = await prisma.vehicleBrands.findUnique({ where: { id: brand_id } });

    if (!new_brand) {
      new_brand = await prisma.vehicleBrands.create({ data: { brand, logo } });
    }

    if (new_brand) {
      const vehicle = await prisma.vehicleModels.create({
        data: {
          model,
          brand: { connect: { id: new_brand.id } },
        },
      });
      if (!vehicle) return res.status(404).json({ error: "No se pudo crear el vehículo" });
      return res.status(201).json({ vehicle, message: "Vehículo registrado correctamente" });
    } else {
      return res.status(404).json({ error: "No se pudo crear el vehículo" });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error });
  }
};

export const UpdateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { model, brand_id, logo, brand } = req.body;

    let updatedBrand;
    if (brand_id && (brand || logo)) {
      updatedBrand = await prisma.vehicleBrands.update({
        where: { id: brand_id },
        data: { brand, logo },
      });
    }

    const vehicle = await prisma.vehicleModels.update({
      where: { id: Number(id) },
      data: {
        model,
        brand: { connect: { id: brand_id } },
      },
    });

    if (!vehicle) return res.status(404).json({ error: "No se pudo actualizar el vehículo" });

    res.status(200).json({ vehicle, message: "Vehículo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const DeleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicleModels.delete({
      where: { id: Number(id) },
    });

    if (!vehicle) return res.status(404).json({ error: "No se pudo eliminar el vehículo" });

    res.status(200).json({ vehicle });
  } catch (error) {
    res.status(500).json({ error });
  }
};
