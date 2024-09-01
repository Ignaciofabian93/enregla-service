import { Request, Response } from "express";
import { Branch } from "./branch.type";
import { CustomRequest } from "../../constants/request";
import prisma from "../../client/prismaclient";
import { User } from "../users/user.types";

export const GetAllBranches = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    const whereClause =
      (user as User).role_id === 2 || (user as User).role_id === 3
        ? { id: (user as User).branch_id }
        : { id: { not: (user as User).branch_id } };

    const branches: Branch[] = await prisma.branch.findMany({
      where: whereClause,
    });

    if (!branches) return res.status(404).json({ error: "No hay sucursales guardadas" });

    res.status(200).json({ branches });
  } catch (error) {
    console.error("Error while trying to get branches: ", error);
    res.status(500).json({ error });
  }
};

// Web-Admin
export const GetBranches = async (req: CustomRequest, res: Response) => {
  try {
    const { page, rows } = req.query;

    const count: number = await prisma.branch.count({
      where: { id: { not: 1 } },
    });
    const branches = await prisma.branch.findMany({
      where: { id: { not: 1 } },
      include: { agency: true, labels: true, users: { select: { id: true, email: true } } },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!branches) return res.status(404).json({ error: "No hay sucursales guardadas" });

    const formattedBranches = branches.map((branch) => ({
      ...branch,
      agency_id: branch.agency.id,
      agency: branch.agency.name,
    }));

    res.status(200).json({ branches: formattedBranches, count });
  } catch (error) {
    console.error("Error while trying to get branches: ", error);
    res.status(500).json({ error });
  }
};

export const CreateBranch = async (req: Request, res: Response) => {
  try {
    const { agency_id, address, location, telephone } = req.body;

    if (!agency_id || !address || !location) return res.status(400).json({ error: "Faltan datos" });

    const new_branch: Branch = await prisma.branch.create({
      data: {
        agency_id,
        address,
        location,
        telephone,
      },
    });

    if (!new_branch) return res.status(400).json({ error: "No se pudo guardar la sucursal" });

    res.status(200).json({ new_branch, message: "Sucursal guardada correctamente" });
  } catch (error) {
    console.error("Error while trying to create branch: ", error);
    res.status(500).json({ error });
  }
};

export const UpdateBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { agency_id, address, location, telephone } = req.body;

    if (!agency_id || !address || !location) return res.status(400).json({ error: "Faltan datos" });

    const updated_branch: Branch | null = await prisma.branch.update({
      where: { id: Number(id) },
      data: {
        agency_id,
        address,
        location,
        telephone,
      },
    });

    if (!updated_branch) return res.status(404).json({ error: "Sucursal no encontrada" });

    res.status(200).json({ branch: updated_branch, message: "Sucursal actualizada correctamente" });
  } catch (error) {
    console.error("Error while trying to update branch: ", error);
    res.status(500).json({ error });
  }
};

export const DeleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted_branch = await prisma.branch.delete({ where: { id: Number(id) } });

    if (!deleted_branch) return res.status(404).json({ error: "Sucursal no encontrada" });

    res.status(200).json({ branch: deleted_branch, message: "Sucursal eliminada correctamente" });
  } catch (error) {
    console.error("Error while trying to delete branch: ", error);
    res.status(500).json({ error });
  }
};
