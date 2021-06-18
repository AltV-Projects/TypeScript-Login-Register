import * as alt from "alt-server";

alt.on("playerConnect", (player: alt.Player) => {
  player.pos = new alt.Vector3(-630.07, -236.332, 38.05704);

  // Change to a random dimension between 100 - 200
  player.dimension = Math.floor(Math.random() * Math.floor(100)) + 100;
});
