import { User } from "./user";

export type CustomRequest = Request & {
  user?: User;
};
