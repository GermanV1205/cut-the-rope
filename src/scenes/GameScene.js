import Phaser from "phaser";

const LEVELS = {
  1: {
    background: "space_background",
    gravityY: 750,
    timeLimit: 90,
    robot: { x: 960, y: 885 },
    battery: { x: 960, y: 580 },
    anchors: [
      { x: 750, y: 200 },
      { x: 1170, y: 210 },
    ],
    stars: [
      { x: 800, y: 550 },
      { x: 960, y: 480 },
      { x: 1120, y: 550 },
    ],
    hazard: null,
    floorY: 995,
    supportY: 200,
    stiffness: 0.18,
    damping: 0.008,
    constraintStrength: 0.78,
    segmentLength: 20,
    swingMultiplier: 1.1,
    intro: "Nivel 1",
    instruction: "Corta ambas cuerdas para llegar al robot. ¡Empieza fácil!",
  },
  2: {
    background: "space_background",
    gravityY: 800,
    timeLimit: 85,
    robot: { x: 1300, y: 885 },
    battery: { x: 620, y: 550 },
    anchors: [
      { x: 800, y: 200 },
      { x: 1100, y: 220 },
    ],
    stars: [
      { x: 700, y: 520 },
      { x: 960, y: 450 },
      { x: 1220, y: 520 },
    ],
    hazard: {
      x: 950,
      y: 720,
      leftBound: 800,
      rightBound: 1100,
      speed: 80,
      threshold: 35,
    },
    floorY: 995,
    supportY: 210,
    stiffness: 0.16,
    damping: 0.008,
    constraintStrength: 0.78,
    segmentLength: 22,
    swingMultiplier: 1.1,
    intro: "Nivel 2",
    instruction: "Batería a la izquierda — cuidado con el obstáculo.",
  },
  3: {
    background: "space_background",
    gravityY: 800,
    timeLimit: 80,
    robot: { x: 960, y: 885 },
    battery: { x: 500, y: 520 },
    anchors: [
      { x: 600, y: 180 },
      { x: 960, y: 160 },
      { x: 1320, y: 190 },
    ],
    stars: [
      { x: 620, y: 480 },
      { x: 960, y: 420 },
      { x: 1300, y: 490 },
    ],
    hazard: {
      x: 900,
      y: 740,
      leftBound: 750,
      rightBound: 1050,
      speed: 100,
      threshold: 35,
    },
    floorY: 995,
    supportY: 180,
    stiffness: 0.14,
    damping: 0.008,
    constraintStrength: 0.78,
    segmentLength: 24,
    swingMultiplier: 1.15,
    intro: "Nivel 3",
    instruction: "3 cuerdas, gran distancia y obstáculo — ¡El reto final!",
  },
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.levelNumber = Phaser.Math.Clamp(Number(data?.level ?? 1), 1, 3);
  }

  preload() {
    this.load.image("game_background", "/src/assets/space_background.png");
    this.load.image("game_floor", "/src/assets/floor.png");
    this.load.image("game_supports", "/src/assets/supports.png");
    this.load.image("game_rope", "/src/assets/rope.png");
    this.load.image("game_battery", "/src/assets/battery_clean.png");
    this.load.image("game_robot_waiting", "/src/assets/robot_waiting.png");
    this.load.image("game_robot_happy", "/src/assets/robot_happy.png");
    this.load.image("game_robot_sad", "/src/assets/robot_sad.png");
    this.load.image("game_star", "/src/assets/stars.png");
    this.load.image("game_knife", "/src/assets/knife.png");

    this.load.audio("game_music", "/src/audio/1-08. Game Music.mp3");
    this.load.audio("game_eat", "/src/audio/1-12. Om Nom - Monster Chewing.mp3");
    this.load.audio("game_open", "/src/audio/1-14. Om Nom - Monster Open.mp3");
    this.load.audio("game_close", "/src/audio/1-13. Om Nom - Monster Close.mp3");
    this.load.audio("game_win", "/src/audio/2-10. Win.mp3");
    this.load.audio("game_break", "/src/audio/candy_break.wav");
  }

  create() {
    this.level = LEVELS[this.levelNumber] ?? LEVELS[1];
    this.gameState = "playing";
    this.collectedStars = 0;
    this.score = 0;
    this.timeRemaining = this.level.timeLimit;
    this.batteryReleased = false;
    this.cutTriggered = false;
    this.ropeCut = [false, false];
    this.lastPointer = null;
    this.swipeActive = false;
    this.bobTime = 0;
    this.hazardDirection = 1;
    this.highScore = Number(localStorage.getItem("highScore") ?? "0");
    this.unlockedLevel = Number(localStorage.getItem("unlockedLevel") ?? "1");
    this.audioMuted = localStorage.getItem("audioMuted") === "true";
    this.musicVolume = Number(localStorage.getItem("musicVolume") ?? "0.5");
    this.sfxVolume = Number(localStorage.getItem("sfxVolume") ?? "0.5");

    this.sound.mute = this.audioMuted;
    this.sound.stopAll();

    const { width, height } = this.cameras.main;
    this.centerX = width / 2;
    this.centerY = height / 2;

    this.add.image(this.centerX, this.centerY, "game_background").setDisplaySize(width, height);

    const gapByLevel = { 1: 520, 2: 460, 3: 420 };
    const gap = gapByLevel[this.levelNumber] ?? 500;
    const leftWidth = Math.floor((width - gap) / 2);
    const rightWidth = leftWidth;

    const leftCenterX = leftWidth / 2;
    const rightCenterX = width - rightWidth / 2;

    this.leftFloor = this.physics.add.staticImage(leftCenterX, this.level.floorY, "game_floor");
    this.leftFloor.setDisplaySize(leftWidth, 130).refreshBody();
    this.leftFloor.setVisible(false);
    this.rightFloor = this.physics.add.staticImage(rightCenterX, this.level.floorY, "game_floor");
    this.rightFloor.setDisplaySize(rightWidth, 130).refreshBody();
    this.rightFloor.setVisible(false);

    this.robot = this.physics.add.image(this.level.robot.x, this.level.robot.y, "game_robot_waiting");
    this.robot.setImmovable(true);
    this.robot.body.allowGravity = false;
    this.robot.setScale(0.95);
    this.robot.setDepth(12);

    this.robotPlatform = this.add.image(this.level.robot.x, this.level.robot.y + 72, "game_floor");
    this.robotPlatform.setDisplaySize(260, 64).setDepth(6);

    this.battery = this.physics.add.image(this.level.battery.x, this.level.battery.y, "game_battery");
    this.battery.setCollideWorldBounds(true);
    this.battery.setBounce(0.18);
    this.battery.setDrag(6, 6);
    this.battery.body.allowGravity = false;
    if (this.battery.body && this.battery.body.checkCollision) {
      this.battery.body.checkCollision.down = false;
    }

    if (this.physics && this.physics.world) {
      this.physics.world.gravity.y = this.level.gravityY ?? this.physics.world.gravity.y;
    }

    this.anchors = this.level.anchors.map((anchor, index) => {
      const supportSprite = this.add.image(anchor.x, anchor.y, "game_supports").setScale(0.45).setDepth(120);
      const defaultLength = Phaser.Math.Distance.Between(anchor.x, anchor.y, this.level.battery.x, this.level.battery.y);
      const length = anchor.length ?? defaultLength;
      const segmentLength = this.level.segmentLength ?? 18;
      const segments = [];
      return {
        ...anchor,
        supportSprite,
        cut: false,
        length,
        segmentLength,
        segments,
        index,
      };
    });

    this.starGroup = this.physics.add.group();
    this.level.stars.forEach((star) => {
      const collectible = this.starGroup.create(star.x, star.y, "game_star");
      collectible.setScale(0.55);
      collectible.body.allowGravity = false;
      collectible.setImmovable(true);
      collectible.setCircle(18, 10, 10);
    });

    this.physics.add.overlap(this.battery, this.starGroup, this.collectStar, null, this);

    if (this.level.hazard) {
      this.hazard = this.physics.add.image(this.level.hazard.x, this.level.hazard.y, "game_knife");
      this.hazard.setScale(1.05);
      this.hazard.body.allowGravity = false;
      this.hazard.setImmovable(true);
      this.hazardDirection = 1;
    }

    this.ropeGraphics = this.add.graphics();
    this.pointerTrail = this.add.graphics();

    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture("cutParticle", 8, 8);
    g.destroy();

    this.physics.add.overlap(this.battery, this.robot, this.handleVictory, null, this);
    this.physics.add.collider(this.battery, this.leftFloor);
    this.physics.add.collider(this.battery, this.rightFloor);

    this.hud = {
      score: this.add.text(34, 28, "Puntaje: 0", this.hudStyle()).setScrollFactor(0),
      stars: this.add.text(34, 72, "Estrellas: 0/3", this.hudStyle()).setScrollFactor(0),
      level: this.add.text(34, 116, `Nivel: ${this.levelNumber}`, this.hudStyle()).setScrollFactor(0),
      timer: this.add.text(34, 160, "Tiempo: 0", this.hudStyle()).setScrollFactor(0),
      info: this.add.text(this.centerX, 28, this.level.instruction, this.infoStyle()).setOrigin(0.5, 0),
    };

    this.pauseButton = this.createButton(width - 210, 30, "PAUSA", () => this.togglePause());
    this.muteButton = this.createButton(width - 410, 30, this.audioMuted ? "SONIDO: OFF" : "SONIDO: ON", () => this.toggleMute());
    this.retryButton = null;
    this.homeButton = null;

    this.overlay = this.add.container(0, 0).setVisible(false).setDepth(2000);
    this.overlayBg = this.add.rectangle(this.centerX, this.centerY, width, height, 0x000000, 0.72);
    this.overlayTitle = this.add.text(this.centerX, this.centerY - 140, "", {
      fontFamily: "Arial",
      fontSize: "72px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 10,
    }).setOrigin(0.5);
    this.overlayMessage = this.add.text(this.centerX, this.centerY - 50, "", {
      fontFamily: "Arial",
      fontSize: "30px",
      color: "#f8f8f8",
      align: "center",
      wordWrap: { width: 900 },
    }).setOrigin(0.5);
    this.overlay.add([this.overlayBg, this.overlayTitle, this.overlayMessage]);

    this.startMusic();
    this.refreshHud();

    this.boundPointerDown = this.handlePointerDown.bind(this);
    this.boundPointerMove = this.handlePointerMove.bind(this);
    this.boundPointerUp = this.handlePointerUp.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);

    this.input.on("pointerdown", this.boundPointerDown);
    this.input.on("pointermove", this.boundPointerMove);
    this.input.on("pointerup", this.boundPointerUp);
    this.input.keyboard?.on("keydown", this.boundKeyDown);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  update(time, delta) {
    if (this.gameState === "paused" || this.gameState === "won" || this.gameState === "lost") {
      this.drawRopes();
      return;
    }

    this.timeRemaining = Math.max(0, this.timeRemaining - delta / 1000);
    if (this.timeRemaining <= 0) {
      this.handleLoss("Se acabó el tiempo.");
      return;
    }

    if (!this.batteryReleased) {
      this.bobTime += delta / 1000;
      this.battery.x = this.level.battery.x + Math.sin(this.bobTime * 1.8) * 8;
      this.battery.y = this.level.battery.y + Math.sin(this.bobTime * 2.6) * 6;
      this.battery.setVelocity(0, 0);
      this.battery.body.allowGravity = false;
    } else {
      this.battery.body.allowGravity = true;
    }

    if (this.hazard) {
      const hazardSpeed = this.level.hazard.speed * delta / 1000 * this.hazardDirection;
      this.hazard.x += hazardSpeed;
      if (this.hazard.x <= this.level.hazard.leftBound) {
        this.hazard.x = this.level.hazard.leftBound;
        this.hazardDirection = 1;
      }
      if (this.hazard.x >= this.level.hazard.rightBound) {
        this.hazard.x = this.level.hazard.rightBound;
        this.hazardDirection = -1;
      }
      const thresh = this.level.hazard.threshold ?? 44;
      const dHaz = Phaser.Math.Distance.Between(this.battery.x, this.battery.y, this.hazard.x, this.hazard.y);
      if (dHaz < thresh) {
        this.handleHazardHit();
      }
    }

    this.enforceConstraints(delta);

    const stars = this.starGroup.getChildren();
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!s.active) continue;

      const d = Phaser.Math.Distance.Between(this.battery.x, this.battery.y, s.x, s.y);
      if (d < 36) {
        this.collectStar(this.battery, s);
        continue;
      }

      for (let a = 0; a < this.anchors.length; a++) {
        const anchor = this.anchors[a];
        if (!anchor || anchor.cut) continue;

        const ax = anchor.x;
        const ay = anchor.y;
        const bx = this.battery.x;
        const by = this.battery.y;

        const vx = bx - ax;
        const vy = by - ay;
        const len2 = vx * vx + vy * vy;
        if (len2 === 0) continue;

        const t = ((s.x - ax) * vx + (s.y - ay) * vy) / len2;
        const tt = Math.max(0, Math.min(1, t));
        const projx = ax + vx * tt;
        const projy = ay + vy * tt;

        const d2 = Phaser.Math.Distance.Between(s.x, s.y, projx, projy);
        if (d2 < 34) {
          this.collectStar(this.battery, s);
          break;
        }
      }
    }

    const height = this.cameras.main.height;
    if (this.battery.y > height + 160 && this.gameState === "playing") {
      this.handleLoss("La batería se perdió fuera de la pantalla.");
    }

    this.drawRopes();
    this.refreshHud();
  }

  hudStyle() {
    return {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5,
    };
  }

  infoStyle() {
    return {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center",
      wordWrap: { width: 1100 },
    };
  }

  createButton(x, y, label, callback) {
    const buttonBg = this.add.rectangle(x, y, 150, 50, 0x132a45, 0.9).setStrokeStyle(3, 0xffffff, 0.9).setInteractive({ useHandCursor: true });
    const buttonText = this.add.text(x, y, label, {
      fontFamily: "Arial",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#ffffff",
    }).setOrigin(0.5);

    buttonBg.on("pointerover", () => buttonBg.setFillStyle(0x285582, 0.96));
    buttonBg.on("pointerout", () => buttonBg.setFillStyle(0x132a45, 0.9));
    buttonBg.on("pointerdown", callback);

    return { bg: buttonBg, text: buttonText };
  }

  startMusic() {
    this.music = this.sound.add("game_music", {
      loop: true,
      volume: this.musicVolume,
    });
    this.music.play();
  }

  handlePointerDown(pointer) {
    if (this.gameState !== "playing") {
      return;
    }

    this.swipeActive = true;
    this.lastPointer = new Phaser.Math.Vector2(pointer.x, pointer.y);
    this.pointerTrail.clear();
    this.pointerTrail.lineStyle(4, 0xffffff, 0.8);
  }

  handlePointerMove(pointer) {
    if (this.gameState !== "playing" || !this.swipeActive || !pointer.isDown || !this.lastPointer) {
      return;
    }

    const current = new Phaser.Math.Vector2(pointer.x, pointer.y);
    this.pointerTrail.lineBetween(this.lastPointer.x, this.lastPointer.y, current.x, current.y);
    this.tryCutRopes(this.lastPointer, current);
    this.lastPointer = current;
  }

  handlePointerUp() {
    this.swipeActive = false;
    this.lastPointer = null;
    this.pointerTrail.clear();
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === "p") {
      this.togglePause();
    }
    if (key === "m") {
      this.toggleMute();
    }
    if (key === "r" && this.gameState !== "playing") {
      this.restartLevel();
    }
  }

  tryCutRopes(startPoint, endPoint) {
    this.anchors.forEach((anchor, index) => {
      if (anchor.cut || this.ropeCut[index]) {
        return;
      }

      const ropeLine = new Phaser.Geom.Line(anchor.x, anchor.y, this.battery.x, this.battery.y);
      const swipeLine = new Phaser.Geom.Line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      const cut = Phaser.Geom.Intersects.LineToLine(ropeLine, swipeLine);

      if (cut) {
        this.cutRope(index);
      }
    });
  }

  cutRope(index) {
    if (this.ropeCut[index]) {
      return;
    }

    this.ropeCut[index] = true;
    this.anchors[index].cut = true;
    this.anchors[index].segments.forEach((s) => s.destroy?.());
    this.anchors[index].segments.length = 0;
    this.spawnCutParticles(this.battery.x, this.battery.y);
    this.playSfx("game_break", 0.55);

    if (!this.cutTriggered) {
      this.cutTriggered = true;
      this.releaseBattery();
      this.playSfx("game_open", 0.35);
    }
  }

  releaseBattery() {
    this.batteryReleased = true;
    if (this.battery.body) this.battery.body.allowGravity = false;
    if (this.battery.setAllowGravity) this.battery.setAllowGravity(false);
    this.battery.setVelocity(12, -6);
    this.battery.setAngularVelocity(0);
  }

  collectStar(battery, star) {
    if (!star.active) {
      return;
    }

    star.disableBody(true, true);
    this.collectedStars += 1;
    this.score += 100;
    this.playSfx("game_eat", 0.2);
    this.refreshHud();
  }

  handleVictory() {
    if (this.gameState !== "playing") {
      return;
    }

    this.gameState = "won";
    this.robot.setTexture("game_robot_happy");
    this.battery.setVelocity(0, 0);
    this.battery.body.allowGravity = false;
    this.score += Math.floor(this.timeRemaining * 10);
    this.playSfx("game_win", 0.45);

    const nextLevel = Math.min(this.levelNumber + 1, 3);
    this.unlockedLevel = Math.max(this.unlockedLevel, nextLevel);
    localStorage.setItem("unlockedLevel", String(this.unlockedLevel));
    this.saveHighScore();

    this.showOverlay(
      "¡Nivel completado!",
      `Tu robot ya recibió la batería.\n\nPuntaje final: ${this.score}\nEstrellas: ${this.collectedStars}/3`,
      true,
    );
  }

  handleHazardHit() {
    if (this.gameState !== "playing") {
      return;
    }

    this.handleLoss("La batería tocó el obstáculo móvil.");
  }

  handleLoss(message) {
    if (this.gameState !== "playing") {
      return;
    }

    this.gameState = "lost";
    this.robot.setTexture("game_robot_sad");
    this.battery.setVelocity(0, 0);
    this.battery.body.allowGravity = false;
    this.playSfx("game_close", 0.4);
    this.saveHighScore();
    this.showOverlay("Game Over", `${message}\n\nPresiona R para reintentar o vuelve al selector.`, false);
  }

  togglePause() {
    if (this.gameState === "won" || this.gameState === "lost") {
      return;
    }

    if (this.gameState === "paused") {
      this.gameState = "playing";
      this.overlay.setVisible(false);
      this.pauseButton.text.setText("PAUSA");
      return;
    }

    this.gameState = "paused";
    this.showOverlay("Pausa", "El juego se detuvo.\n\nPresiona P para continuar o usa el botón de reintento.", false);
    this.pauseButton.text.setText("REANUDAR");
  }

  toggleMute() {
    this.audioMuted = !this.audioMuted;
    this.sound.mute = this.audioMuted;
    localStorage.setItem("audioMuted", String(this.audioMuted));
    this.muteButton.text.setText(this.audioMuted ? "SONIDO: OFF" : "SONIDO: ON");
  }

  restartLevel() {
    this.sound.stopAll();
    this.scene.restart({ level: this.levelNumber });
  }

  showOverlay(title, message, showActions) {
    this.overlayTitle.setText(title);
    this.overlayMessage.setText(message);
    this.overlay.setVisible(true);

    if (this.retryButton) {
      this.retryButton.bg.destroy();
      this.retryButton.text.destroy();
    }
    if (this.homeButton) {
      this.homeButton.bg.destroy();
      this.homeButton.text.destroy();
    }

    this.retryButton = this.createButton(this.centerX - 170, this.centerY + 170, showActions ? "SIGUIENTE" : "REINTENTAR", () => {
      if (showActions) {
        this.scene.start("LevelSelector");
        return;
      }

      this.restartLevel();
    });

    this.homeButton = this.createButton(this.centerX + 170, this.centerY + 170, "MENU", () => {
      this.sound.stopAll();
      this.scene.start("LevelSelector");
    });

    this.overlay.add([this.retryButton.bg, this.retryButton.text, this.homeButton.bg, this.homeButton.text]);
  }

  refreshHud() {
    this.hud.score.setText(`Puntaje: ${this.score}`);
    this.hud.stars.setText(`Estrellas: ${this.collectedStars}/3`);
    this.hud.timer.setText(`Tiempo: ${Math.ceil(this.timeRemaining)}`);
  }

  drawRopes() {
    this.ropeGraphics.clear();
    this.ropeGraphics.lineStyle(10, 0x4d3625, 1);

    this.anchors.forEach((anchor, index) => {
      if (this.ropeCut[index]) {
        anchor.segments.forEach((s) => s?.setVisible(false));
        return;
      }

      const dx = this.battery.x - anchor.x;
      const dy = this.battery.y - anchor.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      this.ropeGraphics.lineBetween(anchor.x, anchor.y, this.battery.x, this.battery.y);

      const segLen = anchor.segmentLength || 18;
      const count = Math.max(1, Math.ceil(dist / segLen));
      const nx = dx / dist || 0;
      const ny = dy / dist || 0;
      while (anchor.segments.length < count) {
        const s = this.add.image(anchor.x, anchor.y, "game_rope");
        s.setOrigin(0.5, 0.5);
        s.setDepth(500);
        anchor.segments.push(s);
      }
      while (anchor.segments.length > count) {
        const s = anchor.segments.pop();
        s.destroy();
      }

      for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / count;
        const px = anchor.x + nx * dist * t;
        const py = anchor.y + ny * dist * t;
        const seg = anchor.segments[i];
        seg.setPosition(px, py);
        seg.setRotation(Math.atan2(ny, nx) + Math.PI / 2);
        seg.setDisplaySize(12, Math.max(6, dist / count));
        seg.setVisible(true);
      }
    });

    if (this.batteryReleased && this.anchors.every((anchor) => anchor.cut)) {
      this.ropeGraphics.lineStyle(0);
    }
  }

  enforceConstraints(delta) {
    if (!this.batteryReleased) return;

    const gravity = this.physics.world.gravity.y ?? this.level.gravityY ?? 1000;
    const dt = Math.min(delta / 1000, 0.016);
    const numIterations = 3;

    const vx = this.battery.body.velocity.x;
    const vy = this.battery.body.velocity.y;
    
    const airDamping = 0.9982;
    let newVx = vx * airDamping;
    let newVy = vy * airDamping + gravity * dt;
    
    this.battery.x += newVx * dt;
    this.battery.y += newVy * dt;

    for (let iteration = 0; iteration < numIterations; iteration++) {
      this.anchors.forEach((anchor, idx) => {
        if (this.ropeCut[idx]) return;

        const ax = anchor.x;
        const ay = anchor.y;
        const bx = this.battery.x;
        const by = this.battery.y;
        
        const dx = bx - ax;
        const dy = by - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max = anchor.length;
        
        if (dist > max && dist > 0.1) {
          const nx = dx / dist;
          const ny = dy / dist;
          
          const desiredX = ax + nx * max;
          const desiredY = ay + ny * max;
          
          const constraintStr = this.level.constraintStrength ?? 0.8;
          this.battery.x += (desiredX - bx) * constraintStr;
          this.battery.y += (desiredY - by) * constraintStr;
        }
      });
    }

    this.battery.body.velocity.x = newVx;
    this.battery.body.velocity.y = newVy;
  }

  spawnCutParticles(x, y) {
    for (let i = 0; i < 10; i++) {
      const px = this.physics.add.image(x, y, "cutParticle");
      const angle = Phaser.Math.FloatBetween(-Math.PI, Math.PI);
      const speed = Phaser.Math.Between(80, 220);
      px.setScale(Phaser.Math.FloatBetween(0.6, 1.1));
      px.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed - Phaser.Math.Between(20, 120));
      px.setBounce(0.3);
      px.setDrag(30, 30);
      px.body.allowGravity = true;
      px.setDepth(1500);
      this.time.delayedCall(600 + Phaser.Math.Between(0, 400), () => px.destroy());
    }
  }

  saveHighScore() {
    const currentScore = Number(localStorage.getItem("highScore") ?? "0");
    if (this.score > currentScore) {
      localStorage.setItem("highScore", String(this.score));
    }
  }

  playSfx(key, volume = 1) {
    if (this.audioMuted) {
      return;
    }

    const sound = this.sound.add(key, { volume: volume * this.sfxVolume });
    sound.play();
  }

  cleanup() {
    this.input.off("pointerdown", this.boundPointerDown);
    this.input.off("pointermove", this.boundPointerMove);
    this.input.off("pointerup", this.boundPointerUp);
    this.input.keyboard?.off("keydown", this.boundKeyDown);
    this.sound.stopAll();
  }
}
