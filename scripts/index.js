// Creamos algunas variables claves para el juego

let espera = 1000 // A menos 'espera', más rápido irá el juego.
let score = 0 // La puntuación del ganador.

// Creamos las celdas en las que se moverán los objetos.

const width = 10;
const height = 10;

const grid = document.querySelector(".grid");
const marcador = document.querySelector(".puntero")

const cells = [];

for (b = 0; b < height; b++) {
  const limpio = [];
  for (a = 0; a < width; a++) {
    const cell = document.createElement("div");
    cell.classList.add("visor");
    grid.appendChild(cell);
    limpio.push(cell);
  }
  cells.push(limpio);
}

// Creamos las variables y funciones necesarias para mover al jugador.

let XPosition = 5;

// Variables de objetos.

let resistencia = false; // ¿Tienes el escudo que concede aguante a un único ataque?
let BalaLimite = 3; // Límite de balas del jugador en pantalla. Ampliable a 5.
let superAtaque = 3; // Cuantos superataques puedes lanzar.

// Estas constantes harán que no necesitemos realizar una operación matemática en cada step.
const YPosition = height - 1;
const Xtope = width - 1;

const BalaAltura = height - 2;

const addJugador = () => cells[YPosition][XPosition].classList.add("jugador");
const removeJugador = () =>
  cells[YPosition][XPosition].classList.remove("jugador");

const handleKeyPress = (event) => {
  const { key } = event;

  // Movemos al jugador a la izquierda o a la derecha.
  // Si cruzamos un extremo de la pantalla, reapareceremos al otro lado.

  removeJugador();

  switch (key) {
    case "ArrowRight":
      if (XPosition < Xtope) XPosition++;
      else XPosition = 0;
      break;
    case "ArrowLeft":
      if (XPosition > 0) XPosition--;
      else XPosition = Xtope;
      break;
    case "w":
      if (balas.length < BalaLimite) balas.push(new Bala(XPosition));
  }

  addJugador();
  colisionBombaJugador()
};

addJugador();

window.addEventListener("keyup", handleKeyPress);

// Creamos los aliens.

const alienWidth = 5; // El número de filas de los aliens.

/*
-w: Blanco
-b: Azul
-p: Rosa
-y: Amarillo
-r: Rojo
*/

const listAlien = ["y", "p", "b", "w"];

const matriz = [];
const falla = listAlien.length;
const longitudinal = alienWidth * falla;

for (o = 0; o < longitudinal; o++) matriz.push(listAlien[o % falla]);

// Generamos el alien rojo.

matriz[Math.floor(Math.random() * longitudinal)] = "r";

let dirAlien = 1 // En que dirección se mueven los aliens.

// La posición más "extrema" de los aliens en las coordenadas.
let arriba = 0;
let izquierda = 0;
let abajo = falla - 1;
let derecha = alienWidth - 1;

function restaurar() {
  const horizonte = []
  const vertice = []
  for (alfa = 0; alfa < matrizAlien.length; alfa++) {
    horizonte.push(matrizAlien[alfa].x)
    vertice.push(matrizAlien[alfa].y)
  }
  izquierda = Math.min(...horizonte)
  derecha = Math.max(...horizonte)
  arriba = Math.min(...vertice)
  abajo = Math.max(...vertice)
}

// Generamos la clase Alien.

class alien {
  constructor(data, x, y) {
    switch (data) {
      case "w":
        this.ps = 1;
        this.agresivo = 1;
        this.objeto = 1;
        this.puntos = 1;
        this.sprite = "blanco";
        break;
      case "b":
        this.ps = 1;
        this.agresivo = 2;
        this.objeto = 2;
        this.puntos = 2;
        this.sprite = "azul";
        break;
      case "p":
        this.ps = 2;
        this.agresivo = 2;
        this.objeto = 2;
        this.puntos = 4;
        this.sprite = "rosa";
        break;
      case "y":
        this.ps = 3;
        this.agresivo = 3;
        this.objeto = 3;
        this.puntos = 7;
        this.sprite = "amarillo";
        break;
      default:
        this.ps = 1;
        this.agresivo = 0;
        this.objeto = 0;
        this.puntos = 10;
        this.sprite = "rojo";
    }
    this.x = x;
    this.y = y;
    addAlien(this.x, this.y, this.sprite);
  }
}

// Funciones para colocar y retirar los aliens en pantalla.

const addAlien = (x, y, s) => cells[y][x].classList.add(s);
const removeAlien = (x, y, s) => cells[y][x].classList.remove(s);

// Hora de crear de verdad los aliens.

const matrizAlien = [];
for (o = 0; o < longitudinal; o++)
  matrizAlien.push(new alien(matriz[o], Math.floor(o / falla), o % falla));

// Hacemos que los aliens se muevan y ataquen al jugador.

const moverAlien = () => {
  if ((dirAlien == 1 && derecha == Xtope) || (dirAlien == -1 && izquierda == 0))
    dirAlien = -dirAlien
  else {
    izquierda += dirAlien
    derecha += dirAlien
    matrizAlien.forEach(ovni => {
      removeAlien(ovni.x, ovni.y, ovni.sprite)
      ovni.x += dirAlien
    }
    )
    // Lo hemos puesto aparte para evitar bugs en los que se intenta dibujar un 2º alien en una casilla.
    matrizAlien.forEach(ovni => {
      addAlien(ovni.x, ovni.y, ovni.sprite)
      if (ovni.y == abajo && Math.random() * 10 < ovni.agresivo)
        bombas.push(new Bomba(ovni.x, ovni.y))
    })
  }
  colisionBalaOVNI()
};

const quitaAlien = setInterval(() => {
  moverAlien()
}, espera);

// Ahora crearemos las balas del jugador.
// Aquí viene lo bueno, pues tenemos que hacer que asciendan y golpeen a los aliens.

const balas = []

// Creamos la clase Bala.

class Bala {
  constructor(x) {
    this.x = x;
    this.y = BalaAltura;
    addBala(this.x, this.y);
  }
}

// Funciones para colocar y retirar las balas de la pantalla.

const addBala = (x, y) => cells[y][x].classList.add("bala");
const removeBala = (x, y) => cells[y][x].classList.remove("bala");

// Tras crear una bala, hay que hacerla ascender.

const subidaBala = () => {
  for (u = 0; u < balas.length; u++) {
    removeBala(balas[u].x, balas[u].y);
    if (balas[u].y > 0) {
      balas[u].y--;
      addBala(balas[u].x, balas[u].y);
    } else {
      balas.splice(u, 1);
      u--;
    }
  }
  colisionBalaBomba()
  colisionBalaOVNI()
};

const quitaBala = setInterval(() => {
  subidaBala()
}, espera);

// Es el turno de crear las bombas
const bombas = [];

// Creamos la clase Bomba

class Bomba {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    addBomba(this.x, this.y);
  }
}

// Mostrar o quitar de la pantalla las bombas.

const addBomba = (x, y) => cells[y][x].classList.add("bomba");
const removeBomba = (x, y) => cells[y][x].classList.remove("bomba");

// Tras crear una bomba, hay que hacerla descender.
// Si la bomba colisiona con el jugador, habrá perdido.

const bajadaBomba = () => {
  for (u = 0; u < bombas.length; u++) {
    removeBomba(bombas[u].x, bombas[u].y);
    if (bombas[u].y < YPosition) {
      bombas[u].y++;
      addBomba(bombas[u].x, bombas[u].y);
    }
    else {
      bombas.splice(u, 1);
      u--;
    }
  }
  colisionBombaJugador()
  colisionBalaBomba()
};

const quitaBomba = setInterval(() => {
  bajadaBomba()
}, espera);

// Creamos el objeto.

let bonus = 'N'
const opciones = ['E', 'R', 'A', 'P', 'D']

// Coordenadas del objeto. Solo tiene sentido con el objeto en pantalla.

let bonusX = 0
let bonusY = 0

// Mostrar o ocultar el bono. No usaremos un sprite, sino una letra.
const addBono = (x, y) => cells[y][x].innerHTML = bonus;
const removeBono = (x, y) => cells[y][x].classList.innerHTML = "";

// Hora de las colisiones.

function colisionBombaJugador() {
  bombas.forEach(bomba => { // Colisión bomba-jugador.
    if (bomba.y == YPosition && bomba.x == XPosition) {
      removeBomba(bomba.x, bomba.y)
      removeJugador()
      fin()
    }
  });
}

function colisionBalaBomba() {
  balas.forEach(bala => { // Colisión bala-bomba.
    for (u = 0; u < bombas.length; u++)
      if (bala.x == bombas[u].x && bala.y == bombas[u].y) {
        removeBomba(bombas[u].x, bombas[u].y)
        bombas.splice(u, 1)
        u--
      }
  })
}

// Colisión bala-ovni.
let frio = 0

function frialdad() {
  if (matrizAlien[frio].ps > 1)
    matrizAlien[frio].ps--
  else {
    score += matrizAlien[frio].puntos
    marcador.innerHTML = "Score: " + score
    removeAlien(matrizAlien[frio].x, matrizAlien[frio].y, matrizAlien[frio].sprite)
    matrizAlien.splice(frio, 1)
    frio--
    if (matrizAlien.length > 0)
      restaurar()
    else
      fin()
  }
}

function colisionBalaOVNI() {
  for (o = 0; o < balas.length; o++)
    for (frio = 0; frio < matrizAlien.length; frio++) {
      if (balas[o].x == matrizAlien[frio].x && balas[o].y == matrizAlien[frio].y) {
        removeBala(balas[o].x, balas[o].y)
        balas.splice(o, 1) // Quitamos ya la bala.
        o--
        if (matrizAlien[frio].sprite == "rojo") {
          for (frio = 0; frio < matrizAlien.length; frio++)
            frialdad()
        }
        else
          frialdad()
      }
    }
}

// Tras terminar la partida, paramos los eventos.
function fin() {
  clearInterval(quitaAlien)
  clearInterval(quitaBala)
  clearInterval(quitaBomba)
  window.removeEventListener('keyup', handleKeyPress)
}