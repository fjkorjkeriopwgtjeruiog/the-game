// Creamos algunas variables claves para el juego
let dirAlien; // En que dirección se mueven los aliens. Van alternando entre izquierda y derecha.
let espera = 500; // A menos 'espera', más rápido irá el juego.
const baji = 200; // El mínimo de 'espera' posible. Tambien es la 'espera' de las balas del jugador.
let score = 0; // La puntuación del ganador.

// Estas variables manejan los eventos que van por tiempo.

let quitaAlien;
let quitaBala;
let quitaBomba;
let quitaBono;
let quitaDatos;

// Variables vinculadas a sonidos.

const jugadorPierde = document.getElementById("derrota");
const jugadorHerido = document.getElementById("golpe");
const alienAvanza = document.getElementById("avance");
const alienDestruido = document.getElementById("gana");
const jugadorDispara = document.getElementById("disparo");
const rojoDestruido = document.getElementById("roja");
const premioRecogido = document.getElementById("premio");
const premioRoto = document.getElementById("roto");

// Creamos las celdas en las que se moverán los objetos.

const width = 20;
const height = width;

const miniAlien = height - 3; // Donde habrán ganado los aliens.

const grid = document.querySelector(".grid");
const marcador = document.querySelector(".puntero");
const cells = [];

for (b = 0; b < height; b++) {
  const limpio = [];
  for (a = 0; a < width; a++) {
    const cell = document.createElement("div");
    cell.classList.add("visor");
    if (b == miniAlien)
      // Indicamos la zona de peligro que los OVNIs no deben descender.
      cell.classList.add("panico");
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

const addJugador = () => {
  if (resistencia == false)
    cells[YPosition][XPosition].classList.add("jugador");
  else cells[YPosition][XPosition].classList.add("poder");
};
const removeJugador = () => {
  if (resistencia == false)
    cells[YPosition][XPosition].classList.remove("jugador");
  else cells[YPosition][XPosition].classList.remove("poder");
};

const salud = () => {
  removeJugador();
  resistencia = !resistencia;
  addJugador();
};

const moverJugador = (event) => {
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
      if (balas.length < BalaLimite) {
        jugadorDispara.play();
        balas.push(new Bala(BalaAltura));
      }
      break;
    case "q":
      if (balas.length == 0 && superAtaque > 0) {
        superAtaque--;
        for (u = 0; u < YPosition; u++) balas.push(new Bala(u));
      }
      break;
    case "Enter":
      pausa();
  }

  addJugador();
  colisionObjetoJugador();
  colisionBombaJugador();
};

addJugador();

/*
Creamos los aliens:
-w: Blanco
-b: Azul
-p: Rosa
-y: Amarillo
-r: Rojo
*/

const listAlien = ["y", "p", "b", "w"];
const falla = listAlien.length;

let alienWidth = 5; // El número de filas de los aliens.
let longitudinal = alienWidth * falla;
const matriz = [];
const matrizAlien = [];

// La posición más "extrema" de los aliens en las coordenadas.
let arriba;
let izquierda;
let abajo;
let derecha;

function restaurar() {
  const horizonte = [];
  const vertice = [];
  for (alfa = 0; alfa < matrizAlien.length; alfa++) {
    horizonte.push(matrizAlien[alfa].x);
    vertice.push(matrizAlien[alfa].y);
  }
  izquierda = Math.min(...horizonte);
  derecha = Math.max(...horizonte);
  arriba = Math.min(...vertice);
  abajo = Math.max(...vertice);
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
    this.addAlien();
  }

  // Funciones para colocar y retirar los aliens en pantalla.

  addAlien() {
    cells[this.y][this.x].classList.add(this.sprite);
  }

  removeAlien() {
    cells[this.y][this.x].classList.remove(this.sprite);
  }
}

function generacion() {
  dirAlien = 1;

  arriba = 0;
  izquierda = 0;
  abajo = falla - 1;
  derecha = alienWidth - 1;

  for (o = 0; o < longitudinal; o++) matriz.push(listAlien[o % falla]);

  // Generamos el alien rojo.

  matriz[Math.floor(Math.random() * longitudinal)] = "r";

  // Hora de crear de verdad los aliens.

  for (o = 0; o < longitudinal; o++)
    matrizAlien.push(new alien(matriz[o], Math.floor(o / falla), o % falla));
}

generacion();

// Hacemos que los aliens se muevan y ataquen al jugador.

const moverAlien = () => {
  if (
    (dirAlien == 1 && derecha == Xtope) ||
    (dirAlien == -1 && izquierda == 0)
  ) {
    if (abajo == miniAlien) fin();
    else {
      dirAlien = -dirAlien;
      abajo++;
      arriba++;
      matrizAlien.forEach((ovni) => {
        ovni.removeAlien();
        ovni.y++;
      });
      retorno();
    }
  } else {
    izquierda += dirAlien;
    derecha += dirAlien;
    matrizAlien.forEach((ovni) => {
      ovni.removeAlien();
      ovni.x += dirAlien;
    });
    retorno();
  }
  colisionBalaOVNI();
  colisionAlienBono();
};

function retorno() {
  // Lo hemos puesto aparte para evitar bugs en los que se intenta dibujar un 2º alien en una casilla.
  matrizAlien.forEach((ovni) => {
    ovni.addAlien();
    if (ovni.y == abajo && Math.random() * 10 < ovni.agresivo)
      bombas.push(new Bomba(ovni.x, ovni.y + 1));
  });
}

// Ahora crearemos las balas del jugador.
// Aquí viene lo bueno, pues tenemos que hacer que asciendan y golpeen a los aliens.

const balas = [];

// Creamos la clase Bala.

class Bala {
  constructor(y) {
    this.x = XPosition;
    this.y = y;
    this.addBala();
  }

  // Funciones para colocar y retirar las balas de la pantalla.

  addBala() {
    cells[this.y][this.x].classList.add("bala");
  }

  removeBala() {
    cells[this.y][this.x].classList.remove("bala");
  }
}

// Tras crear una bala, hay que hacerla ascender.

const subidaBala = () => {
  for (u = 0; u < balas.length; u++) {
    balas[u].removeBala();
    if (balas[u].y > 0) {
      balas[u].y--;
      balas[u].addBala();
    } else {
      balas.splice(u, 1);
      u--;
    }
  }
  colisionBalaBomba();
  colisionBalaOVNI();
  colisionBalaBono();
};

// Es el turno de crear las bombas
const bombas = [];

// Creamos la clase Bomba

class Bomba {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.addBomba();
  }

  // Mostrar o quitar de la pantalla las bombas.

  addBomba() {
    cells[this.y][this.x].classList.add("bomba");
  }

  removeBomba() {
    cells[this.y][this.x].classList.remove("bomba");
  }
}

// Tras crear una bomba, hay que hacerla descender.
// Si la bomba colisiona con el jugador, habrá perdido.

const bajadaBomba = () => {
  for (u = 0; u < bombas.length; u++) {
    bombas[u].removeBomba();
    if (bombas[u].y < YPosition) {
      bombas[u].y++;
      bombas[u].addBomba();
    } else {
      bombas.splice(u, 1);
      u--;
    }
  }
  colisionBombaJugador();
  colisionBalaBomba();
  colisionBombaBono();
};

// Creamos el objeto.

let bonus = "N";
const opciones = ["escudo", "recarga", "ascenso", "potencia", "dinero"];

// Coordenadas del objeto. Solo tiene sentido con el objeto en pantalla.

let bonusX = 0;
let bonusY = 0;

// Mostrar o ocultar el bono. No usaremos un sprite, sino una letra.
const addBono = () => cells[bonusY][bonusX].classList.add(bonus);
const removeBono = () => cells[bonusY][bonusX].classList.remove(bonus);

// El bono descenderá por la pantalla.

function bajadaBono() {
  if (bonus != "N") {
    removeBono();
    if (bonusY < YPosition) {
      bonusY++;
      addBono();
      colisionBalaBono();
      colisionObjetoJugador();
      colisionBombaBono();
      colisionAlienBono();
    } else bonus = "N";
  }
}

// ¡Que empiece de verdad el juego!
chrono();

// Hora de las colisiones.

function colisionBombaJugador() {
  for (u = 0; u < bombas.length; u++) {
    // Colisión bomba-jugador.
    if (bombas[u].y == YPosition && bombas[u].x == XPosition) {
      bombas[u].removeBomba();
      if (resistencia == true) {
        jugadorHerido.play();
        bombas.splice(u, 1);
        u--;
        salud();
      } else {
        jugadorPierde.play();
        removeJugador();
        cells[YPosition][XPosition].classList.add("epilogo"); // Una nave rota para indicar fin de partida por bomba.
        fin();
      }
    }
  }
}

function colisionBalaBomba() {
  balas.forEach((bala) => {
    // Colisión bala-bomba.
    for (u = 0; u < bombas.length; u++)
      if (bala.x == bombas[u].x && bala.y == bombas[u].y) {
        bombas[u].removeBomba();
        bombas.splice(u, 1);
        u--;
      }
  });
}

// Colisión bala-ovni.
let frio = 0;

function frialdad() {
  if (matrizAlien[frio].ps > 1) matrizAlien[frio].ps--;
  else {
    score += matrizAlien[frio].puntos;
    matrizAlien[frio].removeAlien();
    matrizAlien.splice(frio, 1);
    frio--;
    if (matrizAlien.length > 0) {
      if (
        bonus == "N" &&
        matrizAlien[frio].y == abajo &&
        Math.random() * 5 < matrizAlien[frio].objeto
      ) {
        bonus = opciones[Math.floor(Math.random() * opciones.length)];
        bonusX = premierX;
        bonusY = premierY + 1;
        addBono();
      }
      restaurar();
    } else fin();
  }
}

function colisionBalaOVNI() {
  for (o = 0; o < balas.length; o++)
    for (frio = 0; frio < matrizAlien.length; frio++) {
      if (
        balas[o].x == matrizAlien[frio].x &&
        balas[o].y == matrizAlien[frio].y
      ) {
        balas[o].removeBala();
        balas.splice(o, 1); // Quitamos ya la bala.
        o--;
        if (matrizAlien[frio].sprite == "rojo") {
          rojoDestruido.play();
          for (frio = 0; frio < matrizAlien.length; frio++) frialdad();
        } else {
          if (matrizAlien[frio].ps == 1) alienDestruido.play();
          else alienAvanza.play();
          frialdad();
        }
      }
    }
}

// Colisión bala-objeto.

function colisionBalaBono() {
  if (bonus != "N")
    for (g = 0; g < balas.length; g++)
      if (balas[g].x == bonusX && balas[g].y == bonusY) {
        premioRoto.play();
        removeBono();
        bonus = "N"; // Echamos a perder el bono.
        balas[g].removeBala();
        balas.splice(g, 1);
        g--;
      }
}

// Colisión bomba-objeto. En el caso de que choquen, la bomba será eliminada para evitar sorpresas al jugador.

function colisionBombaBono() {
  if (bonus != "N")
    for (g = 0; g < bombas.length; g++)
      if (bombas[g].x == bonusX && bombas[g].y == bonusY) {
        bombas[g].removeBomba();
        bombas.splice(g, 1);
        g--;
      }
}

// Colisión alien-objeto. En el rarisimo caso de que choquen, el objeto será eliminado.

function colisionAlienBono() {
  if (bonus != "N")
    for (g = 0; g < matrizAlien.length; g++)
      if (matrizAlien[g].x == bonusX && matrizAlien[g].y == bonusY) {
        removeBono();
        bonus = "N"; // Es muy raro que pase, siendo común si cae un OVNI de una fila por encima de la más baja.
      }
}

// Colisión objeto-jugador.

function colisionObjetoJugador() {
  if (bonus != "N" && bonusY == YPosition && bonusX == XPosition) {
    premioRecogido.play();
    switch (bonus) {
      case "dinero":
        score += 17;
        break;
      case "escudo":
        if (resistencia == false) salud();
        break;
      case "potencia":
        BalaLimite = 5;
        break;
      case "recarga":
        if (superAtaque < 9) superAtaque++;
        break;
      default:
        // Hacer ascender a los aliens.
        if (arriba > 0) {
          arriba--;
          abajo--;
          matrizAlien.forEach((ovni) => {
            ovni.removeAlien(); // Quitamos los aliens.
          });
          matrizAlien.forEach((ovni) => {
            ovni.y--; // Ascendemos y volvemos a mostrar los aliens.
            ovni.addAlien();
          });
        }
    }
    removeBono();
    bonus = "N";
  }
}

// Mostramos los datos del juego.

function mostrada() {
  recamara = BalaLimite - balas.length;
  if (recamara < 1) recamara = 0;
  marcador.innerHTML =
    "Sp: " + superAtaque + " - Ammo: " + recamara + " - Score: " + score;
}

// Tras terminar la partida, paramos los eventos.
function fin() {
  detener();

  // ¿Ganaste o perdiste?

  if (matrizAlien.length == 0) {
    texto = "Victory! Press Intro to go the next round.";
    window.addEventListener("keyup", reiniciar);
  } else texto = "Game Over! Reset the webpage to play again.";
  marcador.innerHTML = texto + " Score: " + score;
}

function reiniciar(event) {
  const { key } = event;
  if (key == "Enter") {
    window.removeEventListener("keyup", reiniciar); // Ya no necesitamos este evento.

    // Limpiamos algunos elementos en pantalla.

    removeBono();

    balas.forEach((bala) => {
      bala.removeBala();
    });

    bombas.forEach((bomba) => {
      bomba.removeBomba();
    });

    // Reseteamos algunas variables.

    BalaLimite = 3; // Reiniciamos este poder.
    bonus = "N"; // Quitamos de la pantalla el objeto.

    // Limpiamos unas cuantas matrices de cara a la siguiente partida.

    matriz.splice(0, matriz.length);
    balas.splice(0, balas.length);
    bombas.splice(0, bombas.length);

    if (espera > baji) espera -= 50;
    if (alienWidth < 10 && Math.random() * 3 < 2) {
      alienWidth++;
      longitudinal += falla;
    }
    generacion();
    chrono();
  }
}

// Activando eventos relacionados con tiempo. Hemos incluido tambien el evento del movimiento del jugador.

function chrono() {
  quitaAlien = setInterval(() => {
    moverAlien();
  }, espera);

  quitaDatos = setInterval(() => {
    mostrada();
  }, 100);

  quitaBala = setInterval(() => {
    subidaBala();
  }, baji);

  quitaBomba = setInterval(() => {
    bajadaBomba();
  }, espera);

  quitaBono = setInterval(() => {
    bajadaBono();
  }, espera);

  window.addEventListener("keyup", moverJugador);
}

// Función que para el juego.

function detener() {
  clearInterval(quitaAlien);
  clearInterval(quitaBala);
  clearInterval(quitaBomba);
  clearInterval(quitaBono);
  clearInterval(quitaDatos);
  window.removeEventListener("keyup", moverJugador);
}

// Pausamos la partida.

function pausa() {
  detener();
  marcador.innerHTML =
    "Pause! Press Enter to return to the game! Score: " + score;
  window.addEventListener("keyup", regresar);
}

// Volvemos de la pausa.

function regresar(event) {
  const { key } = event;
  if (key == "Enter") {
    window.removeEventListener("keyup", regresar);
    chrono();
  }
}
