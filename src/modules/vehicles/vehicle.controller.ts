import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetBrands = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;

    const count = await prisma.vehicleBrands.count();
    const brands = await prisma.vehicleBrands.findMany({
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
      orderBy: {
        brand: "asc",
      },
    });

    if (!brands) return res.status(404).json({ error: "No se encontraron marcas" });

    res.status(200).json({ count, brands });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await prisma.vehicleBrands.findUnique({
      where: { id: Number(id) },
    });

    if (!brand) return res.status(404).json({ error: "No se encontró la marca" });

    res.status(200).json({ brand });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const CreateBrand = async (req: Request, res: Response) => {
  try {
    const { name, logo } = req.body;

    const vehicle = await prisma.vehicleBrands.create({
      data: {
        brand: name,
        logo,
      },
    });

    if (!vehicle) return res.status(404).json({ error: "No se pudo crear la marca" });

    res.status(201).json({ vehicle });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const UpdateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo } = req.body;
    const updatedBrand = await prisma.vehicleBrands.update({
      where: { id: Number(id) },
      data: { brand: name, logo },
    });

    if (!updatedBrand) return res.status(404).json({ error: "No se pudo actualizar la marca" });

    res.status(201).json({ updatedBrand, message: "Marca actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const DeleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBrand = await prisma.vehicleBrands.delete({
      where: { id: Number(id) },
    });

    if (!deletedBrand) return res.status(404).json({ error: "No se pudo eliminar la marca" });

    res.status(201).json({ deletedBrand, message: "Marca eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetModels = async (req: Request, res: Response) => {
  try {
    const { brand_id, page, rows } = req.query;
    console.log(req.query);

    const count = await prisma.vehicleModels.count();
    const models = await prisma.vehicleModels.findMany({
      where: {
        brand_id: Number(brand_id),
      },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
      orderBy: {
        model: "asc",
      },
    });

    if (!models) return res.status(404).json({ error: "No se encontraron modelos" });

    res.status(200).json({ count, models });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetModel = async (req: Request, res: Response) => {
  try {
    const { brand_id, id } = req.params;
    const model = await prisma.vehicleModels.findUnique({
      where: { brand_id: Number(brand_id), id: Number(id) },
    });

    if (!model) return res.status(404).json({ error: "No se encontró el modelo" });

    res.status(200).json({ model });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const CreateModel = async (req: Request, res: Response) => {
  try {
    const { brand_id, name } = req.body;

    const model = await prisma.vehicleModels.create({
      data: {
        brand_id: Number(brand_id),
        model: name,
      },
    });

    if (!model) return res.status(404).json({ error: "No se pudo crear el modelo" });

    res.status(201).json({ model });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const UpdateModel = async (req: Request, res: Response) => {
  try {
    const { brand_id, id } = req.params;
    const { name } = req.body;
    const updatedModel = await prisma.vehicleModels.update({
      where: { brand_id: Number(brand_id), id: Number(id) },
      data: { model: name },
    });

    if (!updatedModel) return res.status(404).json({ error: "No se pudo actualizar el modelo" });

    res.status(201).json({ updatedModel, message: "Modelo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const DeleteModel = async (req: Request, res: Response) => {
  try {
    const { brand_id, id } = req.params;
    const deletedModel = await prisma.vehicleModels.delete({
      where: { brand_id: Number(brand_id), id: Number(id) },
    });

    if (!deletedModel) return res.status(404).json({ error: "No se pudo eliminar el modelo" });

    res.status(201).json({ deletedModel, message: "Modelo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
