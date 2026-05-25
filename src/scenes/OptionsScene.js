// src/scenes/OptionsScene.js
import Phaser from "phaser";

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super({ key: "OptionsScene" });
  }

  create() {
    this.add
      .text(400, 300, "Pantalla de Opciones (Audio / Controles)", {
        fontSize: "32px",
        color: "#fff",
      })
      .setOrigin(0.5);

    const backBtn = this.add
      .text(400, 500, "Volver al Menú", { fontSize: "24px", color: "#ff0000" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("MainMenu"));
  }
}
