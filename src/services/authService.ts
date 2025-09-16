import createHttpError from 'http-errors';
import { UserModel } from '../models/userModel';
import { CommonUtils } from '../utils/common';
import { getPasswordHash, isValidPassword } from '../utils/bcrypt';

export class AuthService {
  static async signup(payload: {
    name: string;
    emailId: string;
    password: string;
  }) {
    const { name, emailId, password } = payload;

    const emailRegexQuery = CommonUtils.getEmailIdRegexQuery(emailId);

    const userExists = await UserModel.findOne({
      emailId: emailRegexQuery
    });

    if (userExists) {
      throw new createHttpError.Conflict('User already exists');
    }

    const passwordHash = await getPasswordHash(password);

    const newUser = await UserModel.create({
      emailId,
      passwordHash,
      name
    });

    return {
      userId: newUser._id,
      emailId: newUser.emailId,
      name: newUser.name
    };
  }

  static async login(payload: { emailId: string; password: string }) {
    const { emailId, password } = payload;

    const emailRegexQuery = CommonUtils.getEmailIdRegexQuery(emailId);

    const userExists = await UserModel.findOne({
      emailId: emailRegexQuery
      //   isVerified: true
    });

    if (!userExists || !userExists?.passwordHash) {
      throw new createHttpError.BadRequest('Invalid credentials');
    }

    const isValid = await isValidPassword(
      password,
      userExists?.passwordHash as string
    );

    if (!isValid) {
      throw new createHttpError.BadRequest('Invalid credentials');
    }

    return {
      userId: userExists._id,
      emailId: userExists.emailId,
      name: userExists.name
    };
  }
}
