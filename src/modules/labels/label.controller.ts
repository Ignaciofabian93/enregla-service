import { Request, Response } from "express";
import { Label } from "./label.types";
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
    const { branch_id } = req.query;

    const labels = await prisma.label.findMany({
      where: {
        branch_id: Number(branch_id),
      },
      include: {
        VehicleBrand: { select: { brand: true } },
        VehicleModel: { select: { model: true } },
      },
    });

    if (!labels) return res.status(404).json({ error: "No hay etiquetas guardadas" });

    const formattedLabels = labels.map((label) => ({
      ...label,
      vehicle_brand: label.VehicleBrand.brand,
      vehicle_model: label.VehicleModel.model,
    }));

    res.status(200).json({ labels: formattedLabels });
  } catch (error) {
    console.log("Get labels error: ", error);
    res.status(500).json({ error });
  }
};

export const SaveLabel = async (req: Request, res: Response) => {
  try {
    const { labels } = req.body;

    if (!labels || labels.length === 0) {
      return res.status(400).json({ error: "No hay etiquetas para guardar" });
    }

    const newLabels = labels.map((label: Label) => ({
      user_id: Number(label.user_id),
      date: label.date,
      branch_id: Number(label.branch_id),
      label_quantity: Number(label.label_quantity),
      wrong_labels: Number(label.wrong_labels),
      purchase_number: label.purchase_number,
      price: Number(label.price),
      coordinates: label.coordinates,
      vehicle_brand_id: Number(label.vehicle_brand_id),
      vehicle_model_id: Number(label.vehicle_model_id),
      vehicle_year: label.vehicle_year,
      show_vin: label.show_vin,
      show_plate: label.show_plate,
      show_logo: label.show_logo,
      vehicle_vin: label.vehicle_vin,
      vehicle_plate: label.vehicle_plate,
      print_type: label.print_type,
      description: label.description,
    }));

    console.log("NEW LABELS: ", newLabels);

    const createdLabels = await prisma.label.createMany({
      data: newLabels,
    });

    if (!createdLabels.count) {
      return res.status(400).json({ error: "No se pudieron guardar las etiquetas" });
    }

    res
      .status(200)
      .json({ count: createdLabels.count, message: "Etiquetas guardadas correctamente" });
  } catch (error) {
    console.log("LABEL ERROR", error);
    res.status(500).json({ error: "Error al guardar las etiquetas" });
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
