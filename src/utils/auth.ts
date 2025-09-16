import jwt from 'jsonwebtoken';
import { Response } from 'express';

export class AuthUtils {
  static setTokenCookie(res: Response, token: string) {
    // set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }

  static async getToken(payload: {
    userId: string;
    emailId: string;
    name: string;
  }): Promise<string> {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '7d'
    });

    return token;
  }
}
