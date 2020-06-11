import { createConnection } from "typeorm";
import * as alt from "alt-server";
import { Account, AccountValidation } from "./entity";

async function connectToDatabase() {
  try {
    await createConnection({
      name: "lr",
      type: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "lr",
      synchronize: true,
      logging: false,
      entities: [Account, AccountValidation],
    });
    alt.log("Database connection successfull");
  } catch (err) {
    alt.log(err);
    setTimeout(() => connectToDatabase(), 5000);
  }
}
connectToDatabase();
