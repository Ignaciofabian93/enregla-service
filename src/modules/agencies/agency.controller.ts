import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetAllAgencies = async (req: Request, res: Response) => {
  try {
    const agencies = await prisma.agency.findMany({
      where: { name: { not: "Matriz" } },
    });

    if (!agencies) return res.status(404).json({ error: "No hay automotoras guardadas" });

    res.status(200).json({ agencies });
  } catch (error) {
    res.status(500).json({ error });
  }
};