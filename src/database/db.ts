import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ["build/models/*.js"],
  migrations: ["build/migrations/*.js"],
<<<<<<< HEAD
  synchronize: false,
=======
  synchronize: true,
>>>>>>> 057e37ffa13eb8cc356c7bc1e77116793d9d542b
  logging: true,
});

export default AppDataSource;