import { Request, Response, NextFunction } from "express";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {

  const apiKey = req.headers["x-api-key"];

  console.log("RECEIVED API KEY:", apiKey);
  console.log("EXPECTED API KEY:", process.env.API_AUTH_KEY);


  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key required"
    });
  }

  if (apiKey !== process.env.API_AUTH_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key"
    });
  }

  next();
}