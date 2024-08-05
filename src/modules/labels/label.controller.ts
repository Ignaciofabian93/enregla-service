import { Request, Response } from "express";
import { Label } from "./label.types";
import prisma from "../../client/prismaclient";

export const GetLabels = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;
    const labels: Label[] = await prisma.label.findMany({
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!labels) return res.status(404).json({ error: "No hay etiquetas guardadas" });

    res.status(200).json({ labels });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const SaveLabel = async (req: Request, res: Response) => {
  try {
    const { label } = req.body;
    if (!label) return res.status(400).json({ error: "Faltan datos" });

    const new_label: Label = await prisma.label.create({ data: label });

    if (!new_label) return res.status(400).json({ error: "No se pudo guardar la etiqueta" });

    res.status(200).json({ label, message: "Etiqueta guardada correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetLabel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const label: Label | null = await prisma.label.findUnique({ where: { id: Number(id) } });

    if (!label) return res.status(404).json({ error: "Etiqueta no encontrada" });

    res.status(200).json({ label });
  } catch (error) {
    res.status(500).json({ error });
  }
};
