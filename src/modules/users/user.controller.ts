import { Request, Response } from "express";
import { compare, hash, genSalt } from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "./user.types";
import { CustomRequest } from "../../constants/request";
import prisma from "../../client/prismaclient";

// Auth
export const Auth = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Credenciales incompletas" });

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        branch_id: true,
        role_id: true,
      },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string);

    const session = await prisma.session.findUnique({ where: { user_id: user.id } });
    if (session) {
      const saveToken = await prisma.session.update({
        where: { user_id: user.id },
        data: { token },
      });
      if (!saveToken) return res.status(400).json({ error: "Error al intentar iniciar la sesion" });
    } else {
      const saveToken = await prisma.session.create({ data: { user_id: user.id, token } });
      if (!saveToken) return res.status(400).json({ error: "Error al intentar iniciar la sesion" });
    }

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error while trying to authenticate user: ", error);
    res.status(500).json({ error: error });
  }
};

// Get session data
export const GetMe = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error while getting user: ", error);
    res.status(500).json({ error: error });
  }
};

// All users data for mobile
export const GetAllUsers = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        branch: {
          select: {
            id: true,
            address: true,
          },
        },
        role: { select: { id: true, name: true } },
      },
      where: { branch_id: (user as User).branch_id },
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      branch_id: user.branch.id,
      branch: user.branch.address,
      role_id: user.role.id,
      role: user.role.name,
    }));

    return res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Error while getting users: ", error);
    res.status(500).json({ error: error });
  }
};

// Web-Admin
// Filtering depending on role
export const GetUsers = async (req: CustomRequest, res: Response) => {
  try {
    const { page, rows } = req.query;
    const { user } = req;

    const whereClause =
      (user as User).role_id === 2
        ? { id: { not: (user as User).id }, branch_id: (user as User).branch_id }
        : { id: { not: (user as User).id } };

    const count = await prisma.user.count({
      where: whereClause,
    });
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
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
    console.error("Error while getting users: ", error);
    res.status(500).json({ error: error });
  }
};

// Admin & Supervisor
export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, branch_id, role_id, password } = req.body;

    if (!name || !email || !branch_id || !role_id)
      return res.status(400).json({ error: "Faltan datos" });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        branch_id: Number(branch_id),
        role_id: Number(role_id),
      },
    });
    if (!user) return res.status(400).json({ error: "Error al crear usuario" });

    return res.status(201).json({ message: "Usuario creado", user });
  } catch (error) {
    console.error("Error while creating user ", error);
    res.status(500).json({ error: error });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, branch_id, role_id } = req.body;

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
    console.error("Error while trying to update user: ", error);
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
    console.error("Error while trying to delete user: ", error);
    res.status(500).json({ error: error });
  }
};
