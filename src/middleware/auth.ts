import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const ensureAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token =
    //   req.cookies?.token ||
    //   (req.headers.authorization?.startsWith('Bearer ')
    //     ? req.headers.authorization.split(' ')[1]
    //     : null);

    const token = req.cookies['token'];

    if (!token) throw new createHttpError.Unauthorized('Unauthorized');

    const secret = process.env.JWT_SECRET!;

    const payload = jwt.verify(token, secret) as any;
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    throw new createHttpError.Unauthorized('Unauthorized');
  }
};
