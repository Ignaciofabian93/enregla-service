import { Request, Response } from "express";
import prisma from "../client/prismaclient";

export const GetSupplies = async (req: Request, res: Response) => {
  try {
    const supplies = await prisma.supplies.findMany();
    if (!supplies) return res.status(404).json({ error: "No se encontraron insumos" });

    return res.status(200).json({ supplies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supply = await prisma.supplies.findUnique({ where: { id: Number(id) } });
    if (!supply) return res.status(404).json({ error: "Insumo no encontrado" });

    return res.status(200).json({ supply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const SaveSupply = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;
    const supply = await prisma.supplies.create({ data: { name, quantity, price, category } });

    return res.status(201).json({ supply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const EditSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;
    const supply = await prisma.supplies.update({
      where: { id: Number(id) },
      data: { name, quantity, price, category },
    });

    return res.status(200).json({ supply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeleteSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supply = await prisma.supplies.delete({ where: { id: Number(id) } });

    return res.status(200).json({ supply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
