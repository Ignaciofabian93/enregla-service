import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetLabels = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;
    const labels = await prisma.label.findMany({
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!labels) return res.status(404).json({ error: "No hay etiquetas guardadas" });

    res.status(200).json({ labels });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetAllLabels = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const labels = await prisma.label.findMany({
      where: {
        user_id: user.id,
        branch_id: user.branch_id,
      },
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

    const {
      user_id,
      date,
      branch_id,
      label_quantity,
      wrong_labels,
      purchase_number,
      price,
      coordinates,
      vehicle_brand_id,
      vehicle_model_id,
      vehicle_year,
      show_vin,
      show_plate,
      show_logo,
      vehicle_vin,
      vehicle_plate,
    } = label;
    if (!label) return res.status(400).json({ error: "Faltan datos" });

    const new_label = await prisma.label.create({
      data: {
        user_id,
        date,
        branch_id,
        label_quantity,
        wrong_labels,
        purchase_number,
        price: Number(price),
        coordinates,
        vehicle_brand_id,
        vehicle_model_id,
        vehicle_year,
        show_vin,
        show_plate,
        show_logo,
        vehicle_vin,
        vehicle_plate,
      },
    });

    if (!new_label) return res.status(400).json({ error: "No se pudo guardar la etiqueta" });

    res.status(200).json({ label, message: "Etiqueta guardada correctamente" });
  } catch (error) {
    console.log("LABEL", error);

    res.status(500).json({ error });
  }
};

export const GetLabel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const label = await prisma.label.findUnique({ where: { id: Number(id) } });

    if (!label) return res.status(404).json({ error: "Etiqueta no encontrada" });

    res.status(200).json({ label });
  } catch (error) {
    res.status(500).json({ error });
  }
};
