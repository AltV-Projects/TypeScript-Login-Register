import * as alt from "alt-server";

alt.onClient("client::lr:loginAccount", (player: alt.Player, username: string, password: string) => {
    console.log(`User ${username} tries to login with ${password}`);
});

alt.onClient("client::lr:registerAccount", (player: alt.Player, username: string, password: string) => {
    console.log(`User ${username} attempts to register with ${password}`);
});