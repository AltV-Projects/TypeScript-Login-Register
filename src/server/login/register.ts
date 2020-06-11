import * as alt from "alt-server";
import {
  IRegisterAccountData,
  IErrorMessage,
  ILoginAccountData,
} from "../interfaces";
import { getConnection } from "typeorm";
import { Account, AccountValidation } from "../database/entity";
import { genSalt, hash } from "bcryptjs";

alt.onClient(
  "client::lr:registerAccount",
  async (player: alt.Player, data: IRegisterAccountData) => {
    try {
      data.socialId = player.socialId;
      const loginConnection = getConnection("lr");
      const result = await loginConnection
        .createQueryBuilder(Account, "account")
        .leftJoinAndSelect("account.validation", "validation")
        .where("account.username = :username", { username: data.username })
        .orWhere("validation.socialId = :socialId", {
          socialId: data.socialId,
        })
        .orWhere("validation.scNickname = :scNickname", {
          scNickname: data.socialClub,
        })
        .orWhere("validation.licenseHash = :licenseHash", {
          licenseHash: data.licenseHash,
        })
        .getOne();
      if (result) {
        let message: string;
        if (result.username == data.username)
          message = "The given username already exists";
        else if (result.validation.scNickname == data.socialClub)
          message =
            "There is already an account linked to your socialclub name";
        else if (result.validation.socialId == data.socialId)
          message = "There is already an account linked to your socialclub id";

        let err: IErrorMessage = {
          location: "register",
          param: "username",
          msg: message,
        };
        return alt.emitClient(player, "server::lr:showRegistrationError", err);
      }

      let accValidation = new AccountValidation();
      accValidation.discordUserID = data.discordUserID;
      accValidation.licenseHash = data.licenseHash;
      accValidation.scNickname = data.socialClub;
      accValidation.socialId = data.socialId;

      let accSaveResult = await getConnection().manager.save(accValidation);

      const salt = await genSalt(10);
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

      alt.emitClient(player, "client:lr:registrationSuccessfull");
    } catch (error) {
      alt.log(error);
      let err: IErrorMessage = {
        location: "server",
        param: "",
        msg: "Internal server error, please try again later",
      };
      return alt.emitClient(player, "server::lr:showRegistrationError", err);
    }
  }
);
