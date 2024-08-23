import { Request, Response } from "express";
import { compare, hash, genSalt } from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "./user.types";
import prisma from "../../client/prismaclient";

type CustomRequest = Request & {
  user?: User;
};

export const Auth = async (req: Request, res: Response) => {
  try {
    const { rut, password } = req.body;

    if (!rut || !password) return res.status(400).json({ error: "Credenciales incompletas" });

    const user = await prisma.user.findUnique({
      where: { rut },
      select: {
        id: true,
        name: true,
        rut: true,
        email: true,
        password: true,
        branch_id: true,
      },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.log("Error while trying to authenticate user: ", error);
    res.status(500).json({ error: error });
  }
};

export const GetMe = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error while getting user: ", error);
    res.status(500).json({ error: error });
  }
};

export const GetUsers = async (req: CustomRequest, res: Response) => {
  try {
    const { page, rows } = req.query;
    const { user } = req;
    const count = await prisma.user.count({
      where: { id: { not: (user as User).id } },
    });
    const users = await prisma.user.findMany({
      where: { id: { not: (user as User).id } },
      select: {
        id: true,
        name: true,
        rut: true,
        email: true,
        branch: {
          select: {
            id: true,
            address: true,
          },
        },
        role: { select: { id: true, name: true } },
      },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      branch_id: user.branch.id,
      branch: user.branch.address,
      role_id: user.role.id,
      role: user.role.name,
    }));

    return res.status(200).json({ users: formattedUsers, count });
  } catch (error) {
    console.log("Error while getting users: ", error);
    res.status(500).json({ error: error });
  }
};

export const GetUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        rut: true,
        email: true,
        branch: {
          select: { id: true, location: true, address: true, telephone: true },
          include: { agency: { select: { id: true, name: true } } },
        },
        role: { select: { id: true, name: true } },
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { name, rut, email, branch_id, role_id } = req.body;

    if (!name || !rut || !email || !branch_id || !role_id)
      return res.status(400).json({ error: "Faltan datos" });

    const password = `${name[0]}${rut.split("-")[0]}`;
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        rut,
        email,
        password: hashedPassword,
        branch_id: Number(branch_id),
        role_id: Number(role_id),
      },
    });
    if (!user) return res.status(400).json({ error: "Error al crear usuario" });
    console.log("User: ", user);

    return res.status(201).json({ message: "Usuario creado", user });
  } catch (error) {
    console.log("Error while creating user ", error);
    res.status(500).json({ error: error });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, branch_id, role_id } = req.body;
    console.log(req.body, req.params);

    if (!email || !branch_id || !role_id) return res.status(400).json({ error: "Faltan datos" });

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        branch_id: Number(branch_id),
        role_id: Number(role_id),
      },
    });

    return res.status(201).json({ message: "Usuario actualizado", user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "Usuario eliminado", user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
