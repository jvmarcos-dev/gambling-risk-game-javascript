//*******************************************************************
//													 VARIABLES PÚBLICAS
//*******************************************************************

let desplazamiento = -100;

//temporizadores
let aux;
let reinicioError;
let reinicioNoti;

let apuestaUsuario;
let ronda = 0;
let saldo = 300;
let cartas = 0;
let valorRonda = 0;
let candado = false;
let bomba = false


function botones(nboton) {
	// situamos puntero sonido al principio por si ya estaba sonando
	document.getElementById("pasarporboton").currentTime = 0;
	document.getElementById("pulsarboton").currentTime = 0;
	//Reproducir sonido al pulsar boton
	document.getElementById("pulsarboton").play();

	//Comprobamos que boton ha sido pulsado para saber que ocultar y que mostrar
	if (nboton == 1) {
		limpiarNotificaciones()
		muestroPantalla("ocultarapuesta");
		//Pongo valor saldo en su contenedor
		document.getElementById("saldo").value = saldo;

		let musicafondo = document.getElementById("ambiente")
		//Si musica no está sonando
		if (musicafondo.paused) {
			//Establezco volumen al 20%
			musicafondo.volume = 0.2;
			//Reproduzco musica
			musicafondo.play()
			//alert("sonando musica")	
		}
		/*else{
						alert("la musica ya estaba sonando")
					}*/
	}

	if (nboton == 2) {
		//Muestro instrucciones
		muestroPantalla("ocultarinstrucciones");
	}

	if (nboton == 3) {
		limpiarNotificaciones()
		//Muestro menu inicial
		muestroPantalla("menuinicial");

		//pauso musica
		let musicafondo = document.getElementById("ambiente")
		musicafondo.pause()
		//alert("La musica se ha pausado")
		//pongo musica a 0
		musicafondo.currentTime = 0
	}

	if (nboton == 4) {
		limpiarNotificaciones()
		//Reinicio cartas a 0
		cartas = 0
		//Establezco la bomba como false
		bomba = false;
		//Guardo valor apuesta en variable
		apuestaUsuario = parseInt(document.getElementById("apuesta").value);
		//alert(apuestaUsuario)
		//Reinicio las cartas
		resetearCartas();

		//Si la apuesta es valida
		if (apuestaUsuario <= saldo && apuestaUsuario > 0) {
			//Muestro el juego
			muestroPantalla("ocultarjuego");
			//Sumo una ronda
			ronda++;
			jugar()
			deshabilitarBotonVolver();
		} else {
			//Emito notificacion no hay saldo suficiente
			notificacion()
		}

	}

	if (nboton == 5) {
		if (ronda != 5) {
			//Pongo texto te has plantado
			document.getElementById("noti").innerText = "Te has plantado"
			//Muestro notificacion
			notificacion()
			configurarBotonSiguienteRonda();
		} else if (ronda == 5 && saldo < 10000) {
			finalizarPartidaPerdida();
			return;
		}

		deshabilitarCartas();
	}

	if (nboton == 6) {
		//calculo cuanto saldo va a tener antes de cambiar de pantalla
		let saldoProyectado;
		if (!bomba) {
			saldoProyectado = saldo + parseInt(apuestaUsuario) + parseInt(valorRonda);
		} else {
			//si ha salido la bomba, la apuesta no se tiene en cuenta
			saldoProyectado = saldo + parseInt(valorRonda);
			bomba = false;
		}

		//si el saldo es 0, la partida ha terminado
		if (saldoProyectado <= 0) {
			saldo = 0; // Fijamos el saldo en 0
			document.getElementById("saldo").value = 0;

			finalizarPartidaPerdida();
			return;
		}

		//si hay saldo suficiente, la partida continua
		//Establezco el saldo como la misma cantidad que el saldoProyectado
		saldo = saldoProyectado;
		limpiarNotificaciones();
		//Muestro pantalla apuesta
		muestroPantalla("ocultarapuesta");

		//establezco cartas en 0
		cartas = 0;
		//pongo al saldo el valor correspondiente
		document.getElementById("saldo").value = saldo;
		//pongo valor ronda a 0
		valorRonda = 0;
		reiniciarBotonPlantarse();
	}
}

function muestroPantalla(idPantalla) {
	/*menuinicial
	ocultarapuesta
	ocultarinstrucciones
	ocultarjuego*/

	let losocultos = document.querySelectorAll(".lapantalla");

	//Oculto todas las pantallas
	losocultos.forEach(function (objeto) {
		objeto.classList.add("oculto");
	})
	//Desoculto el que pasa por parametro
	document.getElementById(idPantalla).classList.remove("oculto")
}

function resetearCartas() {
	let lascartas = document.querySelectorAll(".lascartas");
	lascartas.forEach(function (objeto) {
		//Pongo reverso a todas las cartas
		objeto.src = "imagenes/0.jpg";
		//Pongo cursor pointer a todas las cartas
		objeto.style.cursor = "pointer";
	});
}

function deshabilitarBotonVolver() {
	let botonVolver = document.getElementById("botonvolver");
	//deshabilito el boton
	botonVolver.disabled = true;
	//pongo cursor como not-allowed
	botonVolver.style.cursor = "not-allowed";
	//elimino la clase hover
	botonVolver.classList.remove("hover")
}

function habilitarBotonVolver() {
	let botonVolver = document.getElementById("botonvolver");
	//habilito el boton
	botonVolver.disabled = false;
	//pongo el cursor pointer
	botonVolver.style.cursor = "pointer";
	//añado la clase hover
	botonVolver.classList.add("hover")
}

function deshabilitarCartas() {
	let lascartas = document.querySelectorAll(".lascartas");
	lascartas.forEach(function (objeto) {
		//Quito evento onclick a todas las cartas.
		objeto.onclick = null;
		//Pongo cursor not-allowed a todas las cartas
		objeto.style.cursor = "not-allowed";
	})
}

function configurarBotonSiguienteRonda() {
	let plantarse = document.getElementById("botonplantarse")
	//Cambio texto plantarse por siguiente ronda
	plantarse.innerText = "SIGUIENTE RONDA"
	//Pongo color fondo boton negro
	plantarse.style.backgroundColor = "black"
	//Pongo color borde blanco
	plantarse.style.border = "solid 2px rgba(255, 255, 255, 0.5)"
	//Pongo hover
	plantarse.classList.add("botonplantarsehover")
	//Elimino el hover que no le corresponde
	plantarse.classList.remove("hover")
	//Pongo que al hacer click llame a botones(6)
	plantarse.onclick = function () {
		botones(6);
	};
}

function configurarBotonTerminarPartida() {
	let btn = document.getElementById("botonplantarse");
	//Cambio texto siguiente ronda o plantarse por terminar partida
	btn.innerText = "TERMINAR PARTIDA";
	//Pongo color fondo boton rojo
	btn.style.backgroundColor = "rgba(102, 24, 24, 0.596)";
	//Pongo color borde rojo
	btn.style.border = "solid 2px rgba(255, 0, 0, 0.5)";
	//Pongo hover
	btn.classList.remove("botonplantarsehover")
	btn.classList.add("hover")
	deshabilitarCartas();
	//Llamo a terminarPartida
	btn.onclick = function () {
		terminarPartida()
	};
}

function finalizarPartidaPerdida() {
	//Pogno texto notificacion has perdido
	document.getElementById("noti").innerText = "FIN DE PARTIDA: No has alcanzado los 10000$.";
	//Muestro notificacion
	notificacion();

	configurarBotonTerminarPartida();
}

function reiniciarBotonPlantarse() {
	//mismo funcionamiento que el de terminar partida y siguiente ronda
	let plantarse = document.getElementById("botonplantarse");
	plantarse.innerText = "PLANTARSE";
	plantarse.style.backgroundColor = "rgba(102, 24, 24, 0.596)";
	plantarse.style.border = "solid 2px rgba(255, 0, 0, 0.5)";
	plantarse.classList.remove("botonplantarsehover");
	plantarse.classList.add("hover");
	plantarse.onclick = function () {
		botones(5);
	};
}

function terminarPartida() {
	//Reinicio todas las variables
	saldo = 300;
	ronda = 0;
	cartas = 0;
	valorRonda = 0;
	candado = false;
	desplazamiento = -100;

	//Reinicio la interfaz del juego
	document.getElementById("esta_ronda").value = 0;
	document.getElementById("cant_apuesta").value = 0;
	document.getElementById("cant_total").value = saldo;
	document.getElementById("numero_ronda").innerText = "RONDA 1/5";
	document.getElementById("apuesta").value = "";
	document.getElementById("elcandado").classList.add("oculto");

	habilitarBotonVolver();

	//Reinicio el botón plantarse
	reiniciarBotonPlantarse();
	//Vuelvo al menú inicial
	botones(3);
}

function jugar() {
	//Pongo en contenedor apuesta el valor de la apuesta
	document.getElementById("cant_apuesta").value = apuestaUsuario
	//Resto al saldo la apuesta
	saldo -= apuestaUsuario
	//Muestro los valores correspondientes en pantalla
	document.getElementById("cant_total").value = saldo
	document.getElementById("esta_ronda").value = valorRonda
	document.getElementById("numero_ronda").innerText = "RONDA " + ronda + "/5"
	let lascartas = document.querySelectorAll(".lascartas");
	//Añado evento onclick a todas las cartas.
	lascartas.forEach(function (objeto, indice) {
		objeto.onclick = function () {
			pulso(indice + 1);
		}
	});

}

function actualizarValor(ncarta, imagen, ganancia) {
	//Pongo en carta pulsada la imagen correspondiente
	document.getElementById('c' + ncarta).src = "imagenes/" + imagen + ".jpg";
	//Sumo la ganancia al valor de la ronda
	valorRonda += ganancia;
	//Pongo en contenedor ronda valorRonda
	document.getElementById("esta_ronda").value = valorRonda
}

function cartaBomba(ncarta) {
	//Pongo la bomba en true
	bomba = true;
	//Pongo en carta pulsada imagen 1
	document.getElementById('c' + ncarta).src = "imagenes/1.jpg";
	//Pongo texto notificacion ha salido una bomba
	document.getElementById("noti").innerText = "Has perdido el dinero ganado en esta ronda y lo que habías apostado. La ronda ha terminado"
	//Muestro notificacion
	notificacion()
	//Pongo el valor de la ronda a 0
	valorRonda = 0
	//Pongo en contenedor ronda valorRonda
	document.getElementById("esta_ronda").value = valorRonda

	deshabilitarCartas();
	configurarBotonSiguienteRonda();
}

function cartaCandado(ncarta) {
	//Pongo candado true
	candado = true
	//Pongo en carta pulsada imagen 6
	document.getElementById('c' + ncarta).src = "imagenes/6.jpg";
	//Pongo texto notificacion para candado
	document.getElementById("noti").innerText = "Mientras esté activo, serás inmune a las bombas"
	//Muestro notificacion
	notificacion()
	//Quito oculto candado
	document.getElementById("elcandado").classList.remove("oculto")
}

function cartaRuina(ncarta) {
	//Pongo en carta pulsada imagen 8
	document.getElementById('c' + ncarta).src = "imagenes/8.jpg";
	//si candado está oculto
	if (!candado) {
		//Pongo texto notificacion ha salido una ruina
		document.getElementById("noti").innerText = "Tu dinero ganado en esta ronda se ha restablecido"
		//Muestro notificacion
		notificacion()
		//Pongo el valor de la ronda a 0
		valorRonda = 0
		//Pongo en contenedor ronda valorRonda
		document.getElementById("esta_ronda").value = valorRonda
	} else {
		//Pongo texto notificacion ha salido una ruina y el candado te ha salvado
		document.getElementById("noti").innerText = "El candado te ha salvado de perder lo ganado en esta ronda"
		//Muestro notificacion
		notificacion()
		//Oculto candado
		document.getElementById("elcandado").classList.add("oculto")
		candado = false
	}
}

function verificarVictoria() {
	if (saldo + valorRonda + apuestaUsuario >= 10000) {
		//Pongo texto notificacion has ganado
		document.getElementById("noti").innerText = "Has ganado. Pulsa otra vez para finalizar la partida";
		//Muestro notificacion
		notificacion();

		configurarBotonTerminarPartida();
		return true;
	}
	return false;
}

function verificarDerrota() {
	if ((ronda == 5 && (cartas == 4 || bomba) && (saldo + valorRonda + apuestaUsuario) < 10000) || (saldo + valorRonda + apuestaUsuario) == 0) {
		finalizarPartidaPerdida();
		return true;
	}
	return false;
}

function pulso(ncarta) {
	limpiarNotificaciones();

	//Reproducir sonido al pulsar carta
	document.getElementById("pulsarcarta").currentTime = 0;
	document.getElementById("pulsarcarta").play();
	//Genero numero aleatorio 1-100
	let numero = Math.floor(Math.random() * (100)) + 1;
	//Evito que salga mas de un candado
	if (candado) {
		while (numero >= 71 && numero <= 85) {
			numero = Math.floor(Math.random() * (100)) + 1;
		}
	}
	//alert("El numero generado es " + numero)
	cartas++;
	//Quito evento onclick a carta pulsada
	document.getElementById('c' + ncarta).onclick = null;
	//Pongo cursor not allwed a carta pulsada
	document.getElementById('c' + ncarta).style.cursor = "not-allowed";

	if (numero <= 35) {
		//genero numero aleatorio 1-3
		let numero2 = Math.floor(Math.random() * (3)) + 1;
		//alert("El numero generado es " + numero2)
		if (numero2 == 1) { //+25%
			actualizarValor(ncarta, 2, Math.floor(apuestaUsuario * 0.25));
		}

		if (numero2 == 2) { //+50%
			actualizarValor(ncarta, 3, Math.floor(apuestaUsuario * 0.5));
		}

		if (numero2 == 3) { //+75%
			actualizarValor(ncarta, 4, Math.floor(apuestaUsuario * 0.75));
		}
	}

	if (numero >= 36 && numero <= 55) { //ruina
		cartaRuina(ncarta);
	}

	if (numero >= 56 && numero <= 70) { //x2
		actualizarValor(ncarta, 5, apuestaUsuario * 2);
	}

	if (numero >= 71 && numero <= 85) { //candado
		cartaCandado(ncarta);
	}

	if (numero >= 86 && numero <= 95) { //x3
		actualizarValor(ncarta, 7, apuestaUsuario * 3);
	}

	if (numero >= 96) { //bomba
		cartaBomba(ncarta);
	}

	if (cartas == 4) {
		configurarBotonSiguienteRonda();
	}

	if (verificarVictoria()) {
		return;
	}

	if (verificarDerrota()) {
		return;
	}
}

function sonidopasarporencima() {
	document.getElementById("pasarporboton").currentTime = 0;
	document.getElementById("pasarporboton").play();
}

function animarNotificacion(contenedor, esError) {
	//Animación de desplazamiento
	if (desplazamiento < 10) {
		contenedor.style.top = desplazamiento + "px";
		desplazamiento = desplazamiento + 1;
		aux = setTimeout(notificacion, 5);
	} else {
		clearTimeout(aux);
		if (esError) {
			reinicioError = setTimeout(function () {
				contenedor.classList.add("oculto");
				desplazamiento = -100;
			}, 5000);
		} else {
			reinicioNoti = setTimeout(function () {
				contenedor.classList.add("oculto");
				desplazamiento = -100;
			}, 5000);
		}
	}
}

function notificacion() {
	clearTimeout(reinicioError);
	clearTimeout(reinicioNoti);

	let juegoOculto = document.getElementById("ocultarjuego").classList.contains("oculto");
	let contenedor = juegoOculto ? document.getElementById("error") : document.getElementById("lanotificacion");

	//Elimino oculto a la notificacion correspondiente
	contenedor.classList.remove("oculto");
	//Reproduzco sonido
	document.getElementById("sonidonoti").currentTime = 0;
	if (!juegoOculto) {
		document.getElementById("sonidonoti").volume = 1;
	}
	document.getElementById("sonidonoti").play();

	animarNotificacion(contenedor, juegoOculto);
}

function limpiarNotificaciones() {
	//Reestablezco todos los valores
	clearTimeout(aux);
	clearTimeout(reinicioError);
	clearTimeout(reinicioNoti);

	desplazamiento = -100;

	let contenedorError = document.getElementById("error");
	let contenedorNoti = document.getElementById("lanotificacion");

	contenedorError.classList.add("oculto");
	contenedorNoti.classList.add("oculto");

	contenedorError.style.top = "-100px";
	contenedorNoti.style.top = "-100px";
}