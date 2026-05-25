import Phaser from "phaser";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
  }

  preload() {
    // Cargamos las imagenes
    this.load.image("fondo", "/src/assets/menu-background.png");
    this.load.image("logo", "/src/assets/logo.png");
    this.load.image("btn_jugar", "/src/assets/btn_play.png");
    this.load.image("btn_opciones", "/src/assets/btn_options.png");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    //Creamos el fondo, el logo y los botones
    this.add.image(centerX, centerY, "fondo");
    this.add.image(centerX, centerY - 200, "logo");

    // Creamos el boton de jugar
    const playButton = this.add
      .image(centerX, centerY + 175, "btn_jugar")
      .setInteractive()
      .setScale(2.5); // Aumentamos el tamaño

    // Creamos el texto del botón de jugar
    const playText = this.add
      .text(centerX, centerY + 175, "JUGAR", {
        fontSize: "70px",
        fontStyle: "bold",
        color: "#ffffff", // Texto blanco
        stroke: "#000000", // Borde negro
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Creamos el boton de opciones
    const optionsButton = this.add
      .image(centerX, centerY + 350, "btn_opciones")
      .setInteractive()
      .setScale(2.5); // Aumentamos un poco el tamaño

    // Creamos el texto del botón de opciones
    const optionsText = this.add
      .text(centerX, centerY + 350, "OPCIONES", {
        fontSize: "70px",
        fontStyle: "bold",
        color: "#ffffff", // Texto blanco
        stroke: "#000000", // Borde negro
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Efectos visuales para "Jugar"
    playButton.on("pointerover", () => {
      playButton.setTint(0xcccccc);
      playText.setColor("#bababa"); // El texto se pone gris claro
    });
    playButton.on("pointerout", () => {
      playButton.clearTint();
      playText.setColor("#ffffff"); // El texto vuelve a blanco
    });
    playButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // Efectos visuales para "Opciones"
    optionsButton.on("pointerover", () => {
      optionsButton.setTint(0xcccccc);
      optionsText.setColor("#bababa"); // El texto se pone gris claro
    });
    optionsButton.on("pointerout", () => {
      optionsButton.clearTint();
      optionsText.setColor("#ffffff");
    });
    optionsButton.on("pointerdown", () => {
      this.scene.start("OptionsScene");
    });
  }
}
