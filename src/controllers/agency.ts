import { Request, Response } from "express";
import prisma from "../client/prismaclient";

export const GetAgencies = async (req: Request, res: Response) => {
  try {
    const agencies = await prisma.agency.findMany();
    if (!agencies) return res.status(404).json({ error: "No se encuentran agencias" });
    return res.status(200).json({ agencies });
  } catch (error) {
    console.error("Error while trying to get agencies: ", error);
    res.status(500).json({ error });
  }
};

export const GetAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agency = await prisma.agency.findUnique({ where: { id: Number(id) } });
    if (!agency) return res.status(404).json({ error: "No se encontro la agencia" });

    return res.status(200).json({ agency });
  } catch (error) {
    console.log("Error while trying to get agency: ", error);
    res.status(500).json({ error });
  }
};

export const CreateAgency = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const agency = await prisma.agency.create({
      data: {
        name,
      },
    });

    if (!agency) return res.status(404).json({ error: "No se pudo crear la agencia" });

    return res.status(201).json({ agency });
  } catch (error) {
    console.log("Error while trying to create agency: ", error);
    res.status(500).json({ error });
  }
};

export const UpdateAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const agency = await prisma.agency.update({
      where: { id: Number(id) },
      data: { name },
    });

    if (!agency) return res.status(404).json({ error: "No se pudo actualizar la agencia" });

    return res.status(200).json({ agency });
  } catch (error) {
    console.log("Error while trying to update agency: ", error);
    res.status(500).json({ error });
  }
};

export const DeleteAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agency = await prisma.agency.delete({ where: { id: Number(id) } });

    if (!agency) return res.status(404).json({ error: "No se pudo eliminar la agencia" });

    return res.status(200).json({ agency });
  } catch (error) {
    console.log("Error while trying to delete agency: ", error);
    res.status(500).json({ error });
  }
};
