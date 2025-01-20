import { Request, Response, NextFunction } from "express";

export const confirmPassword = (
  req: Request,
  res: Response,
  next: NextFunction
):void => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({ error: "Password does not match" });
    return;
  }

  next();
};
