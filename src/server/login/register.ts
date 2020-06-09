import * as alt from "alt-server";
import { IAccountData, IErrorMessage } from "../interfaces";
import { getManager, getConnection } from "typeorm";
import { Account, AccountValidation } from "../database/entity";

alt.onClient(
  "client::lr:registerAccount",
  async (player: alt.Player, data: IAccountData) => {
    const result = await getManager()
      .createQueryBuilder(Account, "account")
      .leftJoinAndSelect("account.validation", "validation")
      .where("account.username = :username", { username: data.username })
      .orWhere("validation.socialId = :socialId", { socialId: player.socialId })
      .orWhere("validation.scNickname = :scNickname", {
        scNickname: data.socialClub,
      })
      .orWhere("validation.licenseHash = :licenseHash", {
        licenseHash: data.licenseHash,
      })
      .getOne();
    console.log(result);
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

    let accData = new Account();
    accData.username = data.username;
    accData.password = data.password;
    accData.validation = accSaveResult;

    await getConnection().manager.save(accData);
  }
);
