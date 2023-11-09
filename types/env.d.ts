declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_CONNECTION_URL: string | undefined;
      JWT_SECRET: string | undefined;
      BCRYPT_SALT: number | undefined;
      CLOUDINARY_API_SECRET: string | undefined;
      CLOUDNAME: string | undefined;
      CLOUDINARY_API_KEY: string | undefined;
      REDIS_URL: string | undefined;
    }
  }
}

export {};
