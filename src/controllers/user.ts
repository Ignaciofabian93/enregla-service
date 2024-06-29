import { Request, Response } from "express";
import { compare, hash, genSalt } from "bcrypt";
import { sign } from "jsonwebtoken";
import prisma from "../client/prismaclient";

export const Auth = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Credenciales incompletas" });
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    console.log("query: ", req.query);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
