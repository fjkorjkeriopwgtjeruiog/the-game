# The Game
Space Invaders (Taito, 1978)

## What is it?
Vas a hacer Space Invaders, un juego creado en 1978 por Taito.
Este juego consiste en que tienes que repeler a unos OVNIs con tu cañón, con el cual dispararás proyectiles con los que destruirás a tus enemigos.
Ganas si logras destruir a todos los enemigos. Pierdes si destruyen tu cañón, o los enemigos logran llegar a tierra.
Los OVNIS podrán lanzar proyectiles que tu cañón deberá esquivar. Uno solo de estos proyectiles basta para destruir el cañón. Si una bala del jugador impacta en un proyectil enemigo, el proyectil enemigo será destruido mientras que el proyectil del jugador seguirá adelante.
Un OVNI solo podrá disparar un proyectil si está en la zona más abajo del batallón.
Pulsarás Z o X para mover respectivamente a izquierda o derecha y P para disparar.
Si el cañón llega a un extremo de la pantalla, reaparecerás al otro lado.
Puedes tener hasta 3 balas en pantalla.
Los aliens empiezan en la izquierda y se mueven a la derecha. Si uno de los OVNIs llega al extremo derecho, todos descenderán un poco y pasarán a moverse a la izquierda. Cuando lleguen al extremo izquierdo, bajaran de nuevo y irán a la derecha. Y así sucesivamente hasta llegar a su línea de meta.
Hay que poner un sprite de “meta” indicando la altura a la que deben descender los OVNIs para que derroten al jugador. Así el jugador sabrá cuanto tiempo le queda antes de que pierda.
Habrá variedad de OVNIs, cada uno con distintos niveles de agresividad y resistencia a los ataques del jugador.
El cañón dispondrá de un superataque con el que barrer a los enemigos. Podrá usarlo hasta 3 veces.
También existirá un OVNI comandante que al destruirse dañará a todo el ejército enemigo, haciendo que cada OVNI pierda 1 PS (Puntos de Salud), destruyendo a los OVNIs que solo les quedase uno.
A veces de los enemigos destruidos caerán premios que el jugador podrá recoger para ganar mejoras. Ya sea un escudo que le permita aguantar un golpe, una recarga de superataque, hacer que los enemigos asciendan o incrementar temporalmente el máximo de proyectiles.
Solo puede haber un objeto en pantalla. Los disparos del jugador podrán destruirlos, lo que obligará al jugador a tener cuidado. Y por supuesto, hay que estar posicionado en el momento justo para recoger el objeto.
Conforme el jugador supere las oleadas enemigas, el juego se hará más veloz para incrementar la dificultad y aparecerán más enemigos.
Cada vez que un OVNI es destruido, el jugador recibirá puntos. En última instancia, el objetivo del jugador en cada partida es mejorar la puntuación obtenida en la partida anterior.
Podríamos investigar si es posible guardar los records de los jugadores.

## How to install

## How to run

## Documentation
### Variables y Funciones
Necesitamos una variable con el ancho del escenario y otra con el alto.
Necesitamos una variable con la coordenada X del jugador.
También necesitamos una variable que almacene la puntuación total.
Si piensas almacenar el record, necesitarás dicha variable.
Necesitaremos un vector de objetos que almacene las balas del jugador, almacenando las coordenadas X e Y de cada bala. Similar ocurrirá con los proyectiles del jugador.
También necesitamos un vector para los OVNIs. Deben almacenar, además de las coordenadas X e Y, sus PS restantes, su sprite, su valor de agresividad y su posibilidad de soltar objeto.
En relación a los OVNIs, debería haber una variable que indique en qué dirección (izquierda o derecha) deben moverse.
Necesitamos funciones para conocer cuál es el OVNI más a derecha y el que está más a la izquierda, para tenerlo en cuenta de cara a saber cuándo se ha llegado a un extremo de la pantalla y hacer descender los enemigos.
También necesitamos funciones para saber quién está más abajo y más arriba. La función de más abajo es para comprobar si algún OVNI ya ha tocado la ‘meta’ y saber cuáles pueden atacar, mientras que la otra función se usuaria en el potenciador de hacer ascender los enemigos, para que no se vayan por encima del “techo” del juego.
En caso de que sí que haya enemigos en la zona más alta, usaremos una función que compruebe que un OVNI no está en lo más alto y no tiene encima a ningún compañero. Si se cumple ambas cosas, ascenderá una casilla.
Necesitamos una variable con el número de superataques disponibles. Dicho superataque sería las balas del jugador de abajo a arriba. Este superataque solo se puede usar si no hay proyectiles del jugador en pantalla.
Necesitaremos una variable con el número de rondas ganadas. A más rondas, más dificultad.
También hará falta una variable que indicará si tiene el jugador el potenciador de resistencia, siendo un booleano que estará a ‘true’ si lo tiene, pasando a ‘false’ tras recibir un ataque.
Necesitamos una variable ‘char’ que indique que existe en pantalla un objeto.
Estos serían los posibles valores:
-	‘N’: No existe el objeto.
-	‘E’: Activa un escudo que protegerá al jugador. Este potenciador permanecerá hasta recibir un ataque.
-	‘R’: Recarga de superataque. El máximo que se puede tener es 9.
-	‘A’: Los enemigos ascenderán, si es que les es posible.
-	‘P’: Aumenta el tope de proyectiles de 3 a 5. Se pierde tras empezar la siguiente ronda.
Además, necesitaremos variables para las coordenadas X e Y del objeto, suponiendo que hay un objeto en pantalla.
Y estos serían los datos de los enemigos:
-	Blanco: 1 PS, agresividad bajo, baja posibilidad de dar objeto, 1 punto por vencerlo.
-	Azul: 1 PS, agresividad media, posibilidad de dar objeto media, 2 puntos por vencerlo.
-	Rosa: 2 PS, agresividad media, posibilidad de dar objeto media, 4 puntos por vencerlo.
-	Amarillo: 3 PS, agresividad alta, posibilidad de dar objeto alta, 7 puntos por vencerlo.
-	Rojo: 1 PS, agresividad nula, posibilidad de dar objeto nula, 10 puntos por vencerlo.
Recuerda que al destruirse un OVNI rojo, todos los demás enemigos pierden 1PS.
De por si no hay enemigos rojos en el vector, sino que uno de los enemigos aleatoriamente será cambiado por un OVNI rojo. Deberás hacer una función que generará un número al azar de 0 hasta el largo del vector de OVNIs menos uno y el OVNI en el índice elegido será sustituido por un OVNI rojo.
Mostrar la información en pantalla
Los datos los mostraremos en una barra HUD colocado debajo del jugador.
En él se incluirá la puntuación (Score), cuantos superataques le quedan (Sp) y cuantas balas aún puede disparar (Ammo).
Si el ataque especial consiste en toneladas de balas, hay que asegurarse de que en caso de que las balas superen el tope permitido, el indicador de balas quede en 0, para evitar mostrar números negativos.
Algo más avanzado sería que balas y superataques se muestren como sprites en lugar de como un número.
Si el jugador tiene activado su escudo o no se mostraría cambiando el color del cañón.

### Pasos para montar el juego
1.	Obtén los sprites que vas a usar.
2.	Escribe el código HTML.
3.	Escribe el código CSS.
4.	Forma una base con Javascript para montar un “esqueleto” del juego. Esto servirá para que se vea como empezará el juego. Tiene que verse el jugador, los enemigos y la barra de datos.
5.	Haz la función que indique como se moverá nuestro personaje.
6.	Haz la función que haga que el cañón dispare las balas. Debes hacer que en cada “step” las balas avancen 1 casilla hacia arriba, además de que en caso de colisionar con un OVNI debe dañarlo, junto al resto de reglas.
7.	Haz la función del ataque especial. Recuerda que entre sus reglas esta descontar en 1 el número de usos del ataque especial.
8.	Haz la función del ataque de los OVNIs. Recuerda que solo atacarán los que estén debajo del todo.
9.	Haz la función del movimiento de los OVNIs. Este paso va a ser uno de los más complicados.
10.	Para que el jugador gane, debe eliminar a todos los enemigos. Haz que el juego indique victoria si se cumple la condición.
11.	Para que el jugador pierda, debe uno de los proyectiles enemigos golpear al jugador, o deben los enemigos descender hasta cierta altura. Haz que el juego indique derrota si se cumplen estas condiciones.
12.	Cuando el juego termina, tanto por victoria como derrota, el juego debe detenerse. No se puede mover el jugador ni atacar de ninguna manera, y similar respecto a los OVNIs restantes en caso de derrota. Todo proyectil en pantalla, tanto del jugador como de los enemigos, quedarán eliminados.
13.	Haz que a veces un OVNI suelte un objeto al destruirse. El jugador debe poder recogerlo, aunque por ahora no haga nada. Y también debe poder ser destruido por los disparos del jugador.
14.	Haz que cada objeto, si lo recoge el jugador, haga el efecto que se espera de él.
15.	Haz que si el jugador pierde, los puntos y las rondas ganadas vuelvan a 0, regrese a 3 el contador de ataques especiales y se reinicie la partida, mientras que si gana se incrementa en 1 las rondas ganadas. En ambos casos, hay que eliminar el potenciador de balas máximos y resetear los enemigos.
16.	Opcionalmente, incluye sonidos en el juego.

[requirements](./docs/readme.md)