import { Request, Response } from "express";
import { CustomRequest } from "../../constants/request";
import { User } from "../users/user.types";
import prisma from "../../client/prismaclient";

export const GetSupplies = async (req: CustomRequest, res: Response) => {
  try {
    const { page, rows } = req.query;
    const { user } = req;

    const whereCountClause =
      (user as User).role_id === 2
        ? { branchSupplies: { every: { branch_id: (user as User).branch_id } } }
        : { branchSupplies: { every: { branch_id: { not: (user as User).branch_id } } } };

    const whereClause =
      (user as User).role_id === 2
        ? { branch_id: (user as User).branch_id }
        : { branch_id: { not: (user as User).branch_id } };

    const count = await prisma.supplies.count({
      where: whereCountClause,
    });
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
      where: whereClause,
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
    console.error("Error while trying to get supplies: ", error);
    res.status(500).json({ error });
  }
};

// For mobile app
export const GetSupplyList = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    const supplies = await prisma.branchSupply.findMany({
      where: { branch_id: (user as User).branch_id },
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

    res.status(200).json({ supplies: formattedSupplies });
  } catch (error) {
    console.error("Error while trying to get supplies: ", error);
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
        quantity: Number(quantity),
        price: Number(price),
        branchSupplies: {
          create: {
            branch: {
              connect: {
                id: Number(branch_id),
              },
            },
            quantity: Number(quantity),
          },
        },
      },
    });

    if (!supply) return res.status(400).json({ error: "Error al crear el insumo" });

    res.status(201).json({ supply, message: "Insumo registrado correctamente" });
  } catch (error) {
    console.error("Error while creating supply: ", error);
    res.status(500).json({ error });
  }
};

export const UpdateSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, name, quantity, price, branch_id } = req.body;

    const branchSupply = await prisma.branchSupply.findFirst({
      where: {
        branch_id: Number(branch_id),
        supply_id: Number(id),
      },
    });

    if (branchSupply) {
      const updatedBranchSupply = await prisma.branchSupply.update({
        where: {
          id: Number(branchSupply.id),
        },
        data: {
          quantity: Number(quantity),
        },
      });

      if (updatedBranchSupply) {
        await prisma.supplies.update({
          where: { id: Number(id) },
          data: {
            category,
            name,
            quantity: Number(quantity),
            price: Number(price),
          },
        });
      }
      return res.status(201).json({ message: "Insumo actualizado correctamente" });
    } else {
      return res.status(404).json({ error: "Insumo no encontrado" });
    }
  } catch (error) {
    console.error("Error while updating supply: ", error);
    res.status(500).json({ error });
  }
};

export const DeleteSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "Falta el id del insumo" });

    const checkIfExists = await prisma.branchSupply.findFirst({ where: { supply_id: Number(id) } });

    if (checkIfExists) {
      const supplyFromBranch = await prisma.branchSupply.deleteMany({
        where: { supply_id: Number(id) },
      });

      if (supplyFromBranch.count) {
        const supply = await prisma.supplies.delete({
          where: { id: Number(id) },
        });
        if (!supply.id) return res.status(404).json({ error: "No se pudo eliminar el insumo" });
      }

      return res.status(200).json({ message: "Insumo eliminado correctamente" });
    } else {
      return res.status(404).json({ error: "Insumo no encontrado" });
    }
  } catch (error) {
    console.error("Error while deleting supply: ", error);
    res.status(500).json({ error });
  }
};
