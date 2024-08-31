import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { User } from "../modules/users/user.types";
import { allowed_user_roles } from "../constants/roles";
import prisma from "../client/prismaclient";

type CustomRequest = Request & {
  user?: User;
};

export const IsAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);

    const { id } = decoded as JwtPayload;

    const findUser = await prisma.user.findFirst({
      where: { id },
    });

    req.user = findUser as User;
    next();
  } catch (error) {
    return res.status(401).json({ error: "No autorizado" });
  }
};

export const IsAuthorized = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: "No autorizado" });

  if (!allowed_user_roles.includes(req.user?.role_id))
    return res.status(403).json({ error: "No autorizado" });

  next();
};
