import * as alt from "alt-client";
import * as native from "natives";
import { IAccountData } from "../interfaces";

let lrView: alt.WebView;
let localPlayer: alt.Player = alt.Player.local;
// let afkTimeout: number;

function resetAFKTimer() {
  native.invalidateIdleCam();
}

alt.requestIpl("post_hiest_unload");

alt.on("connectionComplete", () => {
  lrView = new alt.WebView("http://resource/client/login/html/index.html");

  alt.toggleGameControls(false);
  alt.showCursor(true);
  native.freezeEntityPosition(localPlayer.scriptID, true);
  native.displayHud(false);
  native.displayRadar(false);
  native.disableControlAction(1, 1, true);
  native.disableControlAction(1, 2, true);

  alt.setInterval(resetAFKTimer, 29000);

  lrView.on("web::lr:domContentLoaded", () => {
    lrView.focus();
  });

  lrView.on("web::lr::loginAccount", (username: string, password: string) => {
    const data: IAccountData = {
      username: username,
      password: password,
      licenseHash: alt.getLicenseHash(),
      socialClub: native.scGetNickname(),
      discordUserID: alt.Discord.currentUser
        ? alt.Discord.currentUser.id
        : undefined,
    };
    alt.emitServer("client::lr:loginAccount", data);
  });

  lrView.on(
    "web::lr::registerAccount",
    (username: string, password: string) => {
      const data: IAccountData = {
        username: username,
        password: password,
        licenseHash: alt.getLicenseHash(),
        socialClub: native.scGetNickname(),
        discordUserID: alt.Discord.currentUser
          ? alt.Discord.currentUser.id
          : undefined,
      };
      console.log(data);
      alt.emitServer("client::lr:registerAccount", data);
    }
  );
});
