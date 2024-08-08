import { Request, Response } from "express";
import { Branch } from "./branch.type";
import prisma from "../../client/prismaclient";

export const GetAllBranches = async (req: Request, res: Response) => {
  try {
    const branches: Branch[] = await prisma.branch.findMany({
      where: { location: { not: "-33.415109, -70.591094" } },
    });

    if (!branches) return res.status(404).json({ error: "No hay sucursales guardadas" });

    res.status(200).json({ branches });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetBranches = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;

    const count: number = await prisma.branch.count();
    const branches: Branch[] = await prisma.branch.findMany({
      where: { location: { not: "-33.415109, -70.591094" } },
      include: { agency: true, labels: true, users: { select: { id: true, rut: true } } },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!branches) return res.status(404).json({ error: "No hay sucursales guardadas" });

    res.status(200).json({ branches, count });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const GetBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch: Branch | null = await prisma.branch.findUnique({ where: { id: Number(id) } });

    if (!branch) return res.status(404).json({ error: "Sucursal no encontrada" });

    res.status(200).json({ branch });
  } catch (error) {
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
    res.status(500).json({ error });
  }
};

export const DeleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted_branch: Branch | null = await prisma.branch.delete({ where: { id: Number(id) } });

    if (!deleted_branch) return res.status(404).json({ error: "Sucursal no encontrada" });

    res.status(200).json({ branch: deleted_branch, message: "Sucursal eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
