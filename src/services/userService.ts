import { UserModel } from '../models/userModel';
import createHttpError from 'http-errors';

export class UserService {
  static async getUser(payload: { userId: string }) {
    const { userId } = payload;

    const user = await UserModel.findOne({ _id: userId }).select({
      passwordHash: 0
    });

    if (!user) {
      throw new createHttpError.NotFound('User not found');
    }

    return user;
  }
}
