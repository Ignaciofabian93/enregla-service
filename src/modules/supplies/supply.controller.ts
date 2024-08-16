import { Request, Response } from "express";
import prisma from "../../client/prismaclient";

export const GetSupplies = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;

    const count = await prisma.supplies.count();
    const supplies = await prisma.branchSupply.findMany({
      include: {
        branch: {
          select: {
            id: true,
            agency: {
              select: { name: true },
            },
            address: true,
          },
        },
        supply: {
          select: {
            id: true,
            category: true,
            name: true,
            quantity: true,
            price: true,
          },
        },
      },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    if (!supplies) return res.status(404).json({ error: "No hay insumos" });

    const formattedSupplies = supplies.map((supply) => ({
      id: supply.id,
      agency: supply.branch.agency.name,
      branch: supply.branch.address,
      category: supply.supply.category,
      name: supply.supply.name,
      quantity: supply.supply.quantity,
      price: supply.supply.price,
    }));

    res.status(200).json({ supplies: formattedSupplies, count });
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
    const { category, name, quantity, price, branch_id } = req.body;

    const supply = await prisma.supplies.create({
      data: {
        category,
        name,
        quantity,
        price,
        branchSupplies: {
          create: {
            branch: {
              connect: {
                id: branch_id,
              },
            },
            quantity,
          },
        },
      },
    });

    if (!supply) return res.status(400).json({ error: "Error al crear el insumo" });

    res.status(201).json({ supply, message: "Insumo registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const UpdateSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, name, quantity, price, branch_id } = req.body;

    const branchSupply = await prisma.branchSupply.findFirst({
      where: {
        branch_id: branch_id,
        supply_id: Number(id),
      },
    });

    if (branchSupply) {
      await prisma.branchSupply.update({
        where: {
          id: branchSupply.id,
        },
        data: {
          quantity,
        },
      });
    } else {
      await prisma.branchSupply.create({
        data: {
          branch_id,
          supply_id: Number(id),
          quantity,
        },
      });
    }

    const supply = await prisma.supplies.update({
      where: { id: Number(id) },
      data: {
        category,
        name,
        quantity,
        price,
      },
    });

    if (!supply) return res.status(404).json({ error: "Insumo no encontrado" });

    res.status(200).json({ supply, message: "Insumo actualizado correctamente" });
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
