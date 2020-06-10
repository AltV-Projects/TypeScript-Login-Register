import * as alt from "alt-client";
import * as native from "natives";
import { IRegisterAccountData, IErrorMessage } from "../interfaces";

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
    const data: IRegisterAccountData = {
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
      const data: IRegisterAccountData = {
        username: username,
        password: password,
        licenseHash: alt.getLicenseHash(),
        socialClub: native.scGetNickname(),
        discordUserID: alt.Discord.currentUser
          ? alt.Discord.currentUser.id
          : undefined,
      };
      alt.emitServer("client::lr:registerAccount", data);
    }
  );
});

alt.onServer("server::lr:showRegistrationError", (err: IErrorMessage) => {
  lrView.emit("client::lr:showRegistrationError", err);
});

alt.onServer("server::lr:showLoginError", (err: IErrorMessage) => {
  lrView.emit("client::lr:showLoginError", err);
});

alt.onServer("client:lr:loginSuccessfull", () => {
  alt.emit("client::lr:success");
});

alt.onServer("client:lr:registrationSuccessfull", () => {
  alt.emit("client::lr:success");
});

alt.on("client::lr:success", () => {
  lrView.unfocus();
  lrView.destroy();
  lrView = undefined;

  alt.toggleGameControls(true);
  alt.showCursor(false);
  native.freezeEntityPosition(localPlayer.scriptID, false);
  native.displayHud(true);
  native.displayRadar(true);
  native.disableControlAction(1, 1, false);
  native.disableControlAction(1, 2, false);
});
