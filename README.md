# Cut the Rope - Feed the Robot

Un juego interactivo tipo "Cut the Rope" desarrollado con Phaser 4 y JavaScript. Ayuda al robot a recibir la batería cortando cuerdas, resolviendo acertijos de física y coleccionando estrellas en 3 niveles desafiantes.

## 🎮 Descripción del Juego

En este juego debes ayudar al robot a obtener la batería que necesita. La batería cuelga de cuerdas ancladas en puntos fijos. Tu misión es cortar estratégicamente las cuerdas para que la batería caiga en la boca del robot, mientras recopilas estrellas y evitas obstáculos.

### Características Principales
- **Física realista**: Sistema Verlet integrado con gravedad y restricciones de cuerda natural
- **3 niveles progresivos**: Dificultad creciente con nuevos obstáculos y configuraciones
- **Mecánicas dinámicas**:
  - Corte de cuerdas mediante gestos de deslizamiento
  - Colección de estrellas (máximo 3 por nivel)
  - Obstáculos móviles que detectan riesgos
  - Límite de tiempo por nivel
- **Sistema de audio**: Música de fondo y efectos de sonido (5 SFX)
- **Control de volumen**: Ajusta música y efectos SFX independientemente
- **Persistencia de datos**: Guarda puntuación máxima, niveles desbloqueados y preferencias de audio

## 🚀 Guía de Ejecución

### Requisitos Previos
- Node.js (v14 o superior)
- npm o pnpm como gestor de paquetes

### Instalación

1. **Clona el repositorio** (si aún no lo has hecho):
   ```bash
   git clone https://github.com/GermanV1205/cut-the-rope.git
   cd cut-the-rope
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   # o si usas pnpm:
   pnpm install
   ```

### Ejecutar el Juego

**Modo desarrollo** (con hot reload):
```bash
npm run dev
# o
pnpm dev
```

El juego se abrirá automáticamente en `http://localhost:5173`

**Build para producción**:
```bash
npm run build
# o
pnpm build
```

Los archivos compilados se generarán en la carpeta `dist/`

**Ejecutar el build compilado** (localmente):
```bash
npm run preview
```

## 🎮 Controles del Juego

### Entrada Táctil / Mouse
- **Desliza el dedo/mouse** sobre la cuerda para cortarla
- Necesitas cruzar toda la cuerda para que se corte correctamente

### Teclado
| Tecla | Acción |
|-------|--------|
| **P** | Pausar/Reanudar el juego |
| **M** | Activar/Desactivar música |
| **R** | Reintentar nivel actual |
| **Flechas** | Navegar en menús |
| **Enter** | Seleccionar opción |

### Interfaz de Usuario
- **HUD Superior**: Puntuación, estrellas recogidas (máx 3), nivel actual
- **HUD Inferior**: Tiempo restante y barra de progreso
- **Botones de Volumen**: Control visual para música y SFX
- **Menú Pausa**: Accede a opciones desde el juego

## 📊 Niveles

### Nivel 1: Introducción
- **Gravedad**: 750 px/s²
- **Tiempo Límite**: 90 segundos
- **Dificultad**: Fácil
- **Obstáculos**: Ninguno
- **Objetivos**: Aprende a cortar cuerdas y recopilar estrellas

### Nivel 2: Desafío Intermedio
- **Gravedad**: 800 px/s²
- **Tiempo Límite**: 85 segundos
- **Dificultad**: Intermedio
- **Obstáculos**: Trampa móvil (velocidad 80 px/s)
- **Objetivos**: Evita el obstáculo mientras coordinas el corte de cuerdas

### Nivel 3: Experto
- **Gravedad**: 800 px/s²
- **Tiempo Límite**: 80 segundos
- **Dificultad**: Difícil
- **Obstáculos**: Trampa rápida (velocidad 100 px/s) + complejidad aumentada
- **Objetivos**: Domina la física y los tiempos

## 🏗️ Estructura del Proyecto

```
cut-the-rope/
├── index.html                    # Archivo HTML principal
├── package.json                  # Configuración del proyecto y dependencias
├── vite.config.js               # Configuración de Vite
├── tsconfig.json                # Configuración TypeScript (si aplica)
├── README.md                    # Este archivo
├── public/                      # Archivos estáticos públicos
│   ├── audio/                   # Archivos de audio
│   │   ├── background_music.mp3 # Música de fondo
│   │   ├── rope_cut.mp3         # SFX: corte de cuerda
│   │   ├── eat.mp3              # SFX: comida recogida
│   │   ├── door_open.mp3        # SFX: puerta abierta
│   │   ├── door_close.mp3       # SFX: puerta cerrada
│   │   └── win.mp3              # SFX: victoria
│   └── images/                  # Imágenes y sprites
│       ├── robot_idle.png       # Robot en reposo
│       ├── robot_happy.png      # Robot feliz
│       ├── robot_sad.png        # Robot triste
│       ├── robot_waiting.png    # Robot esperando
│       └── space_background.png # Fondo del juego
├── src/
│   ├── main.js                  # Punto de entrada principal
│   ├── counter.js               # Contador auxiliar (si existe)
│   ├── style.css                # Estilos globales
│   ├── scenes/
│   │   └── GameScene.js         # Escena principal del juego
│   │       ├── LEVELS           # Configuración de 3 niveles
│   │       ├── create()         # Inicialización de escena
│   │       ├── update()         # Loop principal
│   │       ├── enforceConstraints() # Física Verlet
│   │       ├── drawRopes()      # Renderizado de cuerdas
│   │       ├── cutRope()        # Mecánica de corte
│   │       ├── collectStar()    # Recopilación de estrellas
│   │       └── ...más métodos   # Manejo de UI, audio, física
│   ├── managers/                # Gestores de juego (si existen)
│   ├── objects/                 # Objetos del juego
│   ├── physics/                 # Código de física
│   ├── ui/                      # Componentes de interfaz
│   ├── audio/                   # Configuración de audio
│   └── assets/                  # Otros recursos
├── dist/                        # Build compilado (generado después de build)
└── node_modules/               # Dependencias del proyecto
```

## ⚙️ Configuración Técnica

### Física del Juego (Verlet Integration)
El juego utiliza un sistema de física personalizado basado en **Integración Verlet** para simular la cuerda de manera realista:

- **Gravedad**: Aplicada por nivel (750-800 px/s²)
- **Amortiguamiento de aire**: 0.9982 (ultra bajo para mantener energía)
- **Restricciones de cuerda**: Verificadas 3 iteraciones por frame
- **Fuerza de restricción**: 0.78 (equilibrio entre suavidad y rigidez)

### Detección de Corte
- Detecta intersecciones entre el gesto de deslizamiento del usuario y cada segmento de cuerda
- Requiere cruzar la cuerda completamente para que se corte
- Genera partículas visuales y reproduce SFX al cortar

### Persistencia
Los siguientes datos se guardan en localStorage:
- `highScore`: Puntuación máxima alcanzada
- `unlockedLevel`: Nivel máximo desbloqueado
- `audioMuted`: Estado del silenciador de audio
- `musicVolume`: Volumen de música (0-100)
- `sfxVolume`: Volumen de efectos de sonido (0-100)

## 🎨 Diseño Visual

- **Resolución**: Adaptable (responsive)
- **Fondo**: Espacio oscuro con degradado
- **Sprites**: Estilo 2D pixel art minimalista
- **UI**: Interfaz limpia con botones grandes y accesibles
- **Efectos**: Partículas en cortes de cuerda, animaciones suaves

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Phaser** | 4.1.0 | Motor de juegos 2D |
| **Vite** | 8.0.14 | Bundler y servidor de desarrollo |
| **JavaScript** | ES6+ | Lenguaje de programación |
| **HTML5** | Canvas | Renderizado gráfico |
| **CSS3** | - | Estilos y layout |

## 📝 Notas de Desarrollo

### Cambios Recientes
- Implementación de física Verlet para simulación realista de cuerdas
- Optimización de amortiguamiento de aire para mejor sensación de péndulo
- Adición de sistema de persistencia con localStorage
- Creación de 3 niveles con dificultad progresiva
- Sistema de audio completo con control de volumen individual

### Conocidos (No Críticos)
- La física puede sentirse sensible en dispositivos con baja frecuencia de actualización
- Audio puede tener latencia en navegadores con restricciones de reproducción

## 🤝 Créditos

**Equipo de Desarrollo:**
- **Germán Vanegas** - Líder de proyecto, programación principal, física del juego
- **Melany Alarcón** - Diseño de niveles, balance de dificultad, UI/UX
- **Nathaly Gaibor** - Programación de mecánicas, sistemas de audio, persistencia
- **Santiago Pinta** - Pruebas, optimización, documentación

**Tecnologías y Recursos:**
- Phaser 4 (motor de juegos)
- Vite (herramienta de construcción)
- Sonidos de OpenGameArt.org (CC0)
- Tipografía del sistema

## 📄 Licencia

Este proyecto está bajo licencia MIT. Consulta el archivo LICENSE para más detalles.

---

**¿Problemas o sugerencias?** Abre un issue en el repositorio de GitHub o contacta al equipo de desarrollo.

**Última actualización**: Mayo 2026
