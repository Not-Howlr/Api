export class Config {

	public static readonly Options = {
		HOST: process.env.HOST ?? "127.0.0.1",
		PORT: parseInt(process.env.PORT as string) || 3000,
		NODE_ENV: process.env.NODE_ENV ?? "development",
		APP_VERSION: process.env.APP_VERSION || "v1",
		IS_PROD: process.env.NODE_ENV == "production" ? true : false,
		APPCODE: process.env.APPCODE,
		DEV_SUBSCRIPTION: process.env.DEV_SUBSCRIPTION,
		CLIENT_SUBSCRIPTION: process.env.CLIENT_SUBSCRIPTION,
	}

	public static readonly Db = {
		DB_TYPE: process.env.DB_TYPE,
		DB_HOST: process.env.DB_HOST,
		DB_PORT: parseInt(process.env.DB_PORT as string),
		DB_USERNAME: process.env.DB_USERNAME,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_NAME: process.env.DB_NAME
	}

}