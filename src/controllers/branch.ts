import { Request, Response } from "express";
import prisma from "../client/prismaclient";

export const GetBranches = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany();
    if (!branches) res.status(400).json({ error: "No hay sucursales" });

    return res.status(200).json({ branches });
  } catch (error) {
    console.log("Error while trying to get branches: ", error);
    res.status(500).json({ error });
  }
};

export const GetBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch = await prisma.branch.findUnique({
      where: { id: Number(id) },
    });

    if (!branch) res.status(404).json({ error: "Sucursal no encontrada" });

    return res.status(200).json({ branch });
  } catch (error) {
    console.log("Error while trying to get a branch: ", error);
    res.status(500).json({ error });
  }
};

export const CreateBranch = async (req: Request, res: Response) => {
  try {
    const { address, agency_id, location, municipality, telephone } = req.body;
    const branch = await prisma.branch.create({
      data: {
        address,
        agency_id,
        location,
        municipality,
        telephone,
      },
    });

    return res.status(201).json({ branch, message: "Sucursal creada" });
  } catch (error) {
    console.log("Error while trying to create a branch: ", error);
    res.status(500).json({ error });
  }
};

export const EditBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { address, agency_id, location, municipality, telephone } = req.body;
    const branch = await prisma.branch.update({
      where: { id: Number(id) },
      data: {
        address,
        agency_id,
        location,
        municipality,
        telephone,
      },
    });

    return res.status(201).json({ branch, message: "Sucursal actualizada" });
  } catch (error) {
    console.log("Error while trying to edit a branch: ", error);
    res.status(500).json({ error });
  }
};

export const DeleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch = await prisma.branch.delete({
      where: { id: Number(id) },
    });

    if (!branch) res.status(404).json({ error: "Sucursal no encontrada" });

    return res.status(201).json({ message: "Sucursal eliminada" });
  } catch (error) {
    console.log("Error while trying to delete branch: ", error);
    res.status(500).json({ error });
  }
};
