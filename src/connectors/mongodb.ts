import mongoose from 'mongoose';
import config from 'config';

export const connect = async () => {
  const host = config.get('mongodb.host');
  const serviceName = config.get<string>('serviceName');
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (!username || !password) {
    throw new Error('Username and password not provided');
  }

  const mongoUrl = `mongodb+srv://${username}:${password}@${host}/core`;

  console.log(`Connecting to MongoDB: ${host}`);

  await mongoose.connect(mongoUrl, {
    readPreference: 'primary',
    connectTimeoutMS: 30000,
    socketTimeoutMS: 20000,
    appName: serviceName
  });

  console.log(`Connected to MongoDB: ${host}`);
};
