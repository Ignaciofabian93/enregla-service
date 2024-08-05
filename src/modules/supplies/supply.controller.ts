import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetSupplies = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;

    const count = await prisma.supplies.count();
    const supplies = await prisma.supplies.findMany({
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!supplies) return res.status(404).json({ error: "No hay insumos" });

    res.status(200).json({ supplies, count });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supply = await prisma.supplies.findUnique({
      where: { id: Number(id) },
    });

    if (!supply) return res.status(404).json({ error: "Insumo no encontrado" });

    res.status(200).json({ supply });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const CreateSupply = async (req: Request, res: Response) => {
  try {
    const { name, quantity, price } = req.body;

    const supply = await prisma.supplies.create({
      data: { name, quantity, price },
    });

    if (!supply) return res.status(400).json({ error: "Error al crear el insumo" });

    res.status(201).json({ supply });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const UpdateSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, quantity, price } = req.body;

    const supply = await prisma.supplies.update({
      where: { id: Number(id) },
      data: { name, quantity, price },
    });

    if (!supply) return res.status(404).json({ error: "Insumo no encontrado" });

    res.status(200).json({ supply });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const DeleteSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supply = await prisma.supplies.delete({
      where: { id: Number(id) },
    });

    if (!supply) return res.status(404).json({ error: "Insumo no encontrado" });

    res.status(200).json({ supply });
  } catch (error) {
    res.status(500).json({ error });
  }
};
