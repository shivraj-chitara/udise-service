import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  static async getUser(req: Request, res: Response) {
    const userId = req.user?.userId as string;
    const user = await UserService.getUser({ userId });

    res.send(user);
  }
}
