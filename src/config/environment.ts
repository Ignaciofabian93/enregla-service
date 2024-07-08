type Environment = "development" | "test" | "production";

export const environment: Environment = (process.env.ENVIRONMENT as Environment) || "development";
export const protocol = environment === "development" ? "http" : "https";
export const port = process.env.PORT || 4000;
