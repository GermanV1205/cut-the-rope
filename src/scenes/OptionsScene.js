import Phaser from "phaser";

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super({ key: "OptionsScene" });
  }

  preload() {
    this.load.image("fondo", "/src/assets/background.png");
    this.load.image("btn_volver", "/src/assets/btn_back.png");

    // Nuevos assets para los sliders
    this.load.image("icon_music", "/src/assets/icon_music.png");
    this.load.image("icon_sfx", "/src/assets/icon_sfx.png");
    this.load.image("barra_fondo", "/src/assets/barra_fondo.png");
    this.load.image("barra_boton", "/src/assets/barra_boton.png");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.image(centerX, centerY, "fondo");

    this.add
      .text(centerX, centerY - 350, "OPCIONES", {
        fontSize: "56px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Leemos los volúmenes guardados o usamos 0.5 (50%) por defecto
    let musicVol = parseFloat(localStorage.getItem("musicVolume") ?? "0.5");
    let sfxVol = parseFloat(localStorage.getItem("sfxVolume") ?? "0.5");

    // --- CREAR SLIDER DE MÚSICA ---
    this.crearSlider(
      centerX,
      centerY - 100,
      "icon_music",
      musicVol,
      (nuevoVolumen) => {
        localStorage.setItem("musicVolume", nuevoVolumen);
        // Si la música del menú está sonando, le actualizamos el volumen en tiempo real
        let musicaMenu = this.sound.get("musica_menu");
        if (musicaMenu) musicaMenu.setVolume(nuevoVolumen);
      },
    );

    // --- CREAR SLIDER DE EFECTOS (SFX) ---
    this.crearSlider(
      centerX,
      centerY + 50,
      "icon_sfx",
      sfxVol,
      (nuevoVolumen) => {
        localStorage.setItem("sfxVolume", nuevoVolumen);
      },
    );

    // --- BOTÓN VOLVER ---
    const backBtn = this.add
      .image(centerX, centerY + 300, "btn_volver")
      .setInteractive()
      .setScale(1.2);

    backBtn.on("pointerover", () => {
      backBtn.setTint(0xcccccc);
      backText.setColor("#ff0000");
    });
    backBtn.on("pointerout", () => {
      backBtn.clearTint();
      backText.setColor("#ffffff");
    });
    backBtn.on("pointerdown", () => this.scene.start("MainMenu"));
  }

  // --- FUNCIÓN REUTILIZABLE PARA CREAR SLIDERS ---
  crearSlider(x, y, iconKey, volumenInicial, onVolumeChange) {
    // 1. Dibujar el ícono a la izquierda de la barra
    this.add.image(x - 300, y, iconKey).setScale(0.8);

    // 2. Dibujar la barra de fondo
    const track = this.add.image(x, y, "barra_fondo");

    // 3. Calcular límites: dónde empieza y termina la barra
    const minX = track.x - track.width / 2;
    const maxX = track.x + track.width / 2;

    // 4. Posicionar el botón según el volumen inicial guardado
    const startX = minX + track.width * volumenInicial;
    const thumb = this.add
      .image(startX, y, "barra_boton")
      .setInteractive({ draggable: true }); // ¡Esto lo hace arrastrable!

    // 5. Lógica matemática de arrastre
    this.input.on("drag", (pointer, gameObject, dragX) => {
      if (gameObject !== thumb) return; // Asegurar que movemos el botón correcto

      // Limitar el movimiento para que el botón no se salga de la barra
      gameObject.x = Phaser.Math.Clamp(dragX, minX, maxX);

      // Calcular el porcentaje de volumen (de 0.0 a 1.0)
      const porcentaje = (gameObject.x - minX) / (maxX - minX);

      // Llamar a la función que actualiza y guarda el volumen
      onVolumeChange(porcentaje);
    });
  }
}
