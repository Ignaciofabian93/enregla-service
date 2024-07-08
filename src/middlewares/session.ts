import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { UserProps } from "../types/user";

type CustomRequest = Request & {
  user?: string;
};

export const IsAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);
    // req.user = decoded
    next();
  } catch (error) {
    return res.status(401).json({ error: "No autorizado" });
  }
};
