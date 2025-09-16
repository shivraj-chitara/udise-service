import { Request, Response } from 'express';
import { validateJoiSchema } from '../utils/validateJoiSchema';
import Joi from 'joi';
import { AuthService } from '../services/authService';
import { AuthUtils } from '../utils/auth';

export class AuthController {
  static async signup(req: Request, res: Response) {
    const { emailId, password, name } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        name: Joi.string().required(),
        emailId: Joi.string().email().required(),
        password: Joi.string().min(8).required()
      }),
      data: req.body
    });

    const data = await AuthService.signup({
      name,
      emailId,
      password
    });

    const token = await AuthUtils.getToken({
      userId: data.userId,
      emailId: data.emailId,
      name: data.name
    });

    AuthUtils.setTokenCookie(res, token);

    res.send({ user: data });
  }

  static async login(req: Request, res: Response) {
    const { emailId, password } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        emailId: Joi.string().email().required(),
        password: Joi.string().required()
      }),
      data: { emailId, password }
    });

    const data = await AuthService.login({
      emailId,
      password
    });

    const token = await AuthUtils.getToken(data);

    AuthUtils.setTokenCookie(res, token);

    res.send({
      //   loginCompleted: true,
      user: data
    });
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.send({ message: 'Logged out successfully' });
  }
}
