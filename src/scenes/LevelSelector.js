import Phaser from "phaser";

export default class LevelSelector extends Phaser.Scene {
  constructor() {
    super({ key: "LevelSelector" });
  }

  preload() {
    // Cargamos el fondo existente y las nuevas imágenes para los niveles
    this.load.image("fondo-lvl", "/src/assets/background.png");
    this.load.image("btn_nivel", "/src/assets/btn_level.png");
    this.load.image("btn_volver", "/src/assets/btn_back.png");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // 1. Fondo
    this.add.image(centerX, centerY, "fondo-lvl");

    // 2. Título de la pantalla
    this.add
      .text(centerX, centerY - 300, "SELECCIONAR NIVEL", {
        fontSize: "56px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // 3. Configuración de los 3 niveles
    // Posiciones horizontales espaciadas para los niveles 1, 2 y 3
    const posicionesX = [centerX - 350, centerX, centerX + 350];

    posicionesX.forEach((posX, index) => {
      const numeroNivel = index + 1;

      // Contenedor visual del nivel (imagen)
      const levelButton = this.add
        .image(posX, centerY, "btn_nivel")
        .setInteractive()
        .setScale(1.2);

      // Texto con el número del nivel sobre la imagen
      const levelText = this.add
        .text(posX, centerY, numeroNivel.toString(), {
          fontSize: "48px",
          fontStyle: "bold",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5);

      // Efectos visuales de interacción
      levelButton.on("pointerover", () => {
        levelButton.setTint(0xcccccc);
        levelText.setColor("#ffff00");
      });
      levelButton.on("pointerout", () => {
        levelButton.clearTint();
        levelText.setColor("#ffffff");
      });

      // Al dar clic, vamos a GameScene y le pasamos el nivel elegido
      levelButton.on("pointerdown", () => {
        // AQUÍ DETENEMOS LA MÚSICA DEL MENÚ, ya que el jugador va a empezar a jugar
        this.sound.stopAll();
        this.scene.start("GameScene", { level: numeroNivel });
      });
    });

    // 4. Botón Volver al Menú Principal
    const backButton = this.add
      .image(centerX, centerY + 300, "btn_volver")
      .setInteractive()
      .setScale(1.2);

    backButton.on("pointerover", () => {
      backButton.setTint(0xcccccc);
      backText.setColor("#bababa"); // Cambia a rojo al pasar el mouse
    });
    backButton.on("pointerout", () => {
      backButton.clearTint();
      backText.setColor("#ffffff");
    });
    backButton.on("pointerdown", () => {
      // Regresa al menú principal (la música seguirá sonando sin problemas)
      this.scene.start("MainMenu");
    });
  }
}
