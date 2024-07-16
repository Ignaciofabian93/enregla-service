import { Request, Response } from "express";
import { compare, hash, genSalt } from "bcrypt";
import { sign } from "jsonwebtoken";
import prisma from "../client/prismaclient";

export const Auth = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) return res.status(400).json({ error: "Credenciales incompletas" });
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        rut: true,
        email: true,
        password: true,
        branch: {
          select: {
            id: true,
            location: true,
            municipality: true,
            address: true,
            telephone: true,
            agency: { select: { id: true, name: true } },
          },
        },
        role: { select: { id: true, name: true } },
      },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    console.log(user);

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

export const GetUsers = async (req: Request, res: Response) => {
  try {
    const { page, rows } = req.query;
    console.log("Query: ", page, rows);
    const count = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        rut: true,
        email: true,
        branch: {
          select: { id: true, location: true, municipality: true, address: true, telephone: true, agency: true },
        },
        role: { select: { id: true, name: true } },
      },
      skip: (Number(page) - 1) * Number(rows),
      take: Number(rows),
    });

    return res.status(200).json({ users, count });
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
          select: { id: true, location: true, municipality: true, address: true, telephone: true },
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
    const { name, rut, email, password, branch_id, role_id } = req.body;

    if (!name || !rut || !email || !password || !branch_id || !role_id)
      return res.status(400).json({ error: "Faltan datos" });

    console.log(name, rut, email, password, branch_id, role_id);

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
    const { email, password, branch_id, role_id } = req.body;

    if (!email || !password || !branch_id || role_id) return res.status(400).json({ error: "Faltan datos" });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        password: hashedPassword,
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
