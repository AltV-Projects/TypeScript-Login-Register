import * as alt from "alt-server";

alt.on("playerConnect", (player: alt.Player) => {
  player.pos = { x: -630.07, y: -236.332, z: 38.05704 };

  // Change to a random dimension between 100 - 200
  player.dimension = Math.floor(Math.random() * Math.floor(100)) + 100;
});
