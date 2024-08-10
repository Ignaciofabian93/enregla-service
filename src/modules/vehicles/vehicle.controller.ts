import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetVehicles = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;
    const vehicles = await prisma.vehicleBrands.findMany({
      include: { model: true },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
      orderBy: {
        brand: "asc",
      },
    });

    if (!vehicles) return res.status(404).json({ error: "No se encontraron vehículos" });

    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const SaveVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle } = req.body;
    console.log(vehicle);

    const brand = await prisma.vehicleBrands.findFirst({
      where: {
        brand: vehicle.brand,
      },
    });
    if (!brand) {
      await prisma.vehicleBrands.create({
        data: {
          brand: vehicle.brand,
          logo: vehicle.logo,
          model: { create: { model: vehicle.model } },
        },
      });
    }
    // const model = await prisma.vehicleModels.findFirst({
    //   where: {
    //     model: vehicle.model,
    //   },
    // });
    // if (!model) {
    //   await prisma.vehicleModels.create({
    //     data: {
    //       model: vehicle.model,
    //       brand_id: brand?.id as number,
    //     },
    //   });
    // }
    console.log("jsahajashjsa");

    res.status(201).json({ message: "Vehículo guardado correctamente" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
};

export const UpdateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle } = req.body;
    const brand = await prisma.vehicleBrands.update({
      where: {
        brand: vehicle.brand,
      },
      data: {
        brand: vehicle.brand,
        logo: vehicle.logo,
      },
    });

    const model = await prisma.vehicleModels.findFirst({
      where: {
        model: vehicle.model,
      },
    });

    if (!model) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }

    await prisma.vehicleModels.update({
      where: {
        id: model.id as number,
      },
      data: {
        model: vehicle.model,
        brand_id: brand.id,
      },
    });
    res.status(201).json({ message: "Vehículo guardado correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.vehicleBrands.findMany({
      orderBy: {
        brand: "asc",
      },
    });

    if (!brands) return res.status(404).json({ error: "No se encontraron marcas" });

    res.status(200).json({ brands });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetModels = async (req: Request, res: Response) => {
  try {
    const { brand_id } = req.query;
    const models = await prisma.vehicleModels.findMany({
      where: {
        brand_id: Number(brand_id),
      },
      orderBy: {
        model: "asc",
      },
    });

    if (!models) return res.status(404).json({ error: "No se encontraron modelos" });

    res.status(200).json({ models });
  } catch (error) {
    res.status(500).json({ error });
  }
};
