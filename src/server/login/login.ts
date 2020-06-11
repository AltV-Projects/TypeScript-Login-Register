import * as alt from "alt-server";
import { ILoginAccountData, IErrorMessage } from "../interfaces";
import { getConnection } from "typeorm";
import { Account } from "../database/entity";
import { compare } from "bcryptjs";

alt.onClient(
  "client::lr:loginAccount",
  async (player: alt.Player, data: ILoginAccountData) => {
    try {
      data.socialId = player.socialId;
      const loginConnection = getConnection("lr");
      const result = await loginConnection
        .createQueryBuilder(Account, "account")
        .leftJoinAndSelect("account.validation", "validation")
        .where("account.username = :username", { username: data.username })
        .getOne();
      if (!result) {
        let err: IErrorMessage = {
          location: "login",
          param: "username",
          msg: "The given username does not exist",
        };
        return alt.emitClient(player, "server::lr:showLoginError", err);
      }

      let passwordResult: boolean = await compare(
        data.password,
        result.password
      );

      if (!passwordResult) {
        let err: IErrorMessage = {
          location: "login",
          param: "password",
          msg: "The given password is incorrect",
        };
        return alt.emitClient(player, "server::lr:showLoginError", err);
      }

      if (data.socialClub != result.validation.scNickname) {
        let err: IErrorMessage = {
          location: "login",
          param: "scNickname",
          msg:
            "Your socialclub name diffes from the one, you registred with, please use your old account to login",
        };
        return alt.emitClient(player, "server::lr:showLoginError", err);
      }

      if (data.socialId != result.validation.socialId) {
        let err: IErrorMessage = {
          location: "login",
          param: "socialId",
          msg:
            "Your socialclub id diffes from the one, you registred with, please use your old account to login",
        };
        return alt.emitClient(player, "server::lr:showLoginError", err);
      }

      const loginData: ILoginAccountData = {
        socialClub: result.validation.scNickname,
        username: result.username,
        discordUserID: result.validation.discordUserID,
      };

      player.setSyncedMeta("userData", loginData);

      alt.emitClient(player, "client:lr:loginSuccessfull");
    } catch (error) {
      alt.log(error);
      let err: IErrorMessage = {
        location: "server",
        param: "",
        msg: "Internal server error, please try again later",
      };
      return alt.emitClient(player, "server::lr:showLoginError", err);
    }
  }
);
