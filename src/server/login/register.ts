import * as alt from "alt-server";
import {
  IRegisterAccountData,
  IErrorMessage,
  ILoginAccountData,
} from "../interfaces";
import { getManager, getConnection } from "typeorm";
import { Account, AccountValidation } from "../database/entity";
import { genSalt, hash } from "bcryptjs";

alt.onClient(
  "client::lr:registerAccount",
  async (player: alt.Player, data: IRegisterAccountData) => {
    try {
      const result = await getManager()
        .createQueryBuilder(Account, "account")
        .leftJoinAndSelect("account.validation", "validation")
        .where("account.username = :username", { username: data.username })
        .orWhere("validation.socialId = :socialId", {
          socialId: player.socialId,
        })
        .orWhere("validation.scNickname = :scNickname", {
          scNickname: data.socialClub,
        })
        .orWhere("validation.licenseHash = :licenseHash", {
          licenseHash: data.licenseHash,
        })
        .getOne();
      if (result) {
        let err: IErrorMessage = {
          location: "register",
          param: "username",
          message: "The given username already exists",
        };
        return alt.emitClient(player, "server::showRegistrationError", err);
      }

      let accValidation = new AccountValidation();
      accValidation.discordUserID = data.discordUserID;
      accValidation.licenseHash = data.licenseHash;
      accValidation.scNickname = data.socialClub;
      accValidation.socialId = player.socialId;

      let accSaveResult = await getConnection().manager.save(accValidation);

      const rounds: number = process.env.BC_ROUNDS
        ? parseInt(process.env.BC_ROUNDS)
        : 10;
      const salt = await genSalt(rounds);
      const password = await hash(data.password, salt);

      let accData = new Account();
      accData.username = data.username;
      accData.password = password;
      accData.validation = accSaveResult;

      await getConnection().manager.save(accData);

      const loginData: ILoginAccountData = {
        socialClub: accData.validation.scNickname,
        username: accData.username,
        discordUserID: accData.validation.discordUserID,
      };

      player.setSyncedMeta("userData", loginData);
    } catch (error) {
      alt.log(error);
      let err: IErrorMessage = {
        location: "server",
        param: "",
        message: "Internal server error, please try again later",
      };
      return alt.emitClient(player, "server::showRegistrationError", err);
    }
  }
);
