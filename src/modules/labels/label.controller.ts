import { Request, Response } from "express";
import { Label } from "./label.types";
import { CustomRequest } from "../../constants/request";
import { User } from "../users/user.types";
import prisma from "../../client/prismaclient";

// For mobile app
export const GetLabels = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    const labels = await prisma.label.findMany({
      include: {
        vehicle: { select: { brand: true, logo: true } },
        user: { select: { name: true, email: true } },
        branch: { select: { address: true, agency: true, location: true, telephone: true } },
      },
      where: { branch_id: (user as User).branch_id },
    });

    if (!labels) return res.status(404).json({ error: "No hay etiquetas guardadas" });

    const formattedLabels = labels.map((label) => ({
      id: label.id,
      work_order: label.work_order,
      operator: label.user?.name,
      operator_id: label.operator_id,
      date: label.date,
      branch_id: label.branch_id,
      branch_address: label.branch.address,
      branch_location: label.branch.location,
      branch_telephone: label.branch.telephone,
      label_quantity: label.label_quantity,
      wrong_labels: label.wrong_labels,
      coordinates: label.coordinates,
      vehicle_id: label.vehicle_id,
      show_vin: label.show_vin,
      vehicle_vin: label.vehicle_vin,
      show_plate: label.show_plate,
      vehicle_plate: label.vehicle_plate,
      show_logo: label.show_logo,
      description: label.description,
    }));

    res.status(200).json({ labels: formattedLabels });
  } catch (error) {
    console.error("Error while trying to get labels: ", error);
    res.status(500).json({ error });
  }
};

// For web-admin statistics
export const GetAllLabels = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    const whereClause =
      (user as User).role_id === 2
        ? { branch_id: (user as User).branch_id }
        : { branch_id: { not: (user as User).branch_id } };

    const labels = await prisma.label.findMany({
      orderBy: { date: "desc" },
      include: {
        branch: { select: { id: true, address: true, location: true } },
        vehicle: { select: { brand: true } },
      },
      where: whereClause,
    });

    if (!labels) return res.status(404).json({ error: "No hay etiquetas guardadas" });

    const formattedLabels = labels.map((label) => ({
      ...label,
      vehicle_brand: label.vehicle?.brand,
    }));

    res.status(200).json({ labels: formattedLabels });
  } catch (error) {
    console.error("Error while trying to get labels: ", error);
    res.status(500).json({ error });
  }
};

export const SaveLabel = async (req: Request, res: Response) => {
  try {
    const { labels } = req.body;

    if (!labels || labels.length === 0) {
      return res.status(400).json({ error: "No hay etiquetas para guardar" });
    }

    const newLabels = labels.map((label: Label) => {
      const newLabel: any = {
        operator_id: label.operator_id ? Number(label.operator_id) : null,
        work_order: label.work_order || "",
        date: label.date,
        branch_id: Number(label.branch_id),
        label_quantity: Number(label.label_quantity),
        wrong_labels: Number(label.wrong_labels),
        coordinates: label.coordinates,
        vehicle_year: label.vehicle_year,
        show_vin: label.show_vin,
        show_plate: label.show_plate,
        show_logo: label.show_logo,
        vehicle_vin: label.vehicle_vin,
        vehicle_plate: label.vehicle_plate,
        print_type: label.print_type,
        description: label.description,
      };

      // Only add `vehicle_brand_id` if they exist
      if (label.vehicle_brand_id) {
        newLabel.vehicle_brand_id = Number(label.vehicle_brand_id);
      }

      return newLabel;
    });

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
    console.error("Error while trying to save labels", error);
    res.status(500).json({ error: "Error al guardar las etiquetas" });
  }
};
