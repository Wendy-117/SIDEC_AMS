const EvaluadorControlador = (() => {
  const guia = new Guia();
  const muestraCodigos = new MuestraCodigos();
  const evaluador = new Evaluador();

  function crearEstadoInicial() {
    return {
      pasoMod2: 0,
      intentosFallidosMod2: 0,
      mod2Aprobado: false,
      mod3Aprobado: false
    };
  }

  let estado = crearEstadoInicial();
  let temporizadorNotificacion;

  function mostrarNotificacion(texto, tipo = "informacion", centrada = false) {
    const notificacion = document.getElementById("notificacion-emergente");
    if (!notificacion) throw new Error("No se encontro el contenedor de notificaciones.");

    window.clearTimeout(temporizadorNotificacion);
    notificacion.textContent = texto;
    notificacion.className = `notificacion-emergente notificacion-${tipo}${centrada ? " notificacion-centrada" : ""}`;
    temporizadorNotificacion = window.setTimeout(() => {
      notificacion.classList.add("oculto");
    }, 3500);
  }

  function cargarEstado() {
    const guardado = localStorage.getItem("sidec_estado_sesion");
    if (!guardado) return;

    let estadoGuardado;
    try {
      estadoGuardado = JSON.parse(guardado);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      console.error("El progreso guardado esta dañado y se reiniciara.", error);
      localStorage.removeItem("sidec_estado_sesion");
      return;
    }

    const esEstadoValido =
      estadoGuardado &&
      typeof estadoGuardado === "object" &&
      !Array.isArray(estadoGuardado) &&
      Number.isInteger(estadoGuardado.pasoMod2) &&
      estadoGuardado.pasoMod2 >= 0 &&
      estadoGuardado.pasoMod2 < muestraCodigos.getCasos().length &&
      Number.isInteger(estadoGuardado.intentosFallidosMod2) &&
      estadoGuardado.intentosFallidosMod2 >= 0 &&
      estadoGuardado.intentosFallidosMod2 <= 2 &&
      typeof estadoGuardado.mod2Aprobado === "boolean" &&
      typeof estadoGuardado.mod3Aprobado === "boolean";

    if (!esEstadoValido) {
      console.error("El progreso guardado no tiene un formato valido y se reiniciara.");
      localStorage.removeItem("sidec_estado_sesion");
      return;
    }

    estado = { ...crearEstadoInicial(), ...estadoGuardado };
  }

  function guardarEstado() {
    localStorage.setItem("sidec_estado_sesion", JSON.stringify(estado));
    actualizarIndicadores();
  }

  function actualizarIndicadores() {
    const aprobados = (estado.mod2Aprobado ? 1 : 0) + (estado.mod3Aprobado ? 1 : 0);
    const porcentaje = (aprobados / 2) * 100;

    document.getElementById("barra-progreso-actual").style.width = `${porcentaje}%`;
    document.getElementById("detalle-progreso").textContent = `${aprobados} de 2 módulos aprobados`;

    const indicadorModuloDos = document.getElementById("indicador-modulo-dos");
    if (estado.mod2Aprobado) { indicadorModuloDos.textContent = "Aprobado"; indicadorModuloDos.classList.add("aprobado"); }
    else { indicadorModuloDos.textContent = "Pendiente"; indicadorModuloDos.classList.remove("aprobado"); }

    const indicadorModuloTres = document.getElementById("indicador-modulo-tres");
    if (estado.mod3Aprobado) { indicadorModuloTres.textContent = "Aprobado"; indicadorModuloTres.classList.add("aprobado"); }
    else { indicadorModuloTres.textContent = "Pendiente"; indicadorModuloTres.classList.remove("aprobado"); }

    const indicadorGeneral = document.getElementById("estado-general");
    const avisoCurso = document.getElementById("aviso-curso-completado");

    if (estado.mod2Aprobado && estado.mod3Aprobado) {
      indicadorGeneral.textContent = "COMPLETADO";
      indicadorGeneral.className = "indicador-estado estado-completado";
      avisoCurso.classList.remove("oculto");
    } else {
      indicadorGeneral.textContent = "EN PROGRESO";
      indicadorGeneral.className = "indicador-estado estado-en-progreso";
      avisoCurso.classList.add("oculto");
    }
  }

  function cambiarVista(idVista, botonElemento) {
    const vista = document.getElementById(idVista);
    if (!vista) throw new Error(`No existe la vista "${idVista}".`);
    document.querySelectorAll(".seccion-vista").forEach(seccion => seccion.classList.remove("activo"));
    vista.classList.add("activo");

    document.querySelectorAll(".boton-navegacion").forEach(boton => boton.classList.remove("activo"));
    if (botonElemento) {
      botonElemento.classList.add("activo");
    } else {
      const botonObjetivo = document.querySelector(`.boton-navegacion[data-vista="${idVista}"]`);
      if (botonObjetivo) botonObjetivo.classList.add("activo");
    }

    if (idVista === "vista-ejercicios") renderizarCodigosEjemplos();
    if (idVista === "vista-cuestionario") renderizarQuizzTest();
  }

  function irAModulo(idVista) {
    cambiarVista(idVista, null);
  }

  function agregarMensaje(texto, tipo) {
    const contenedor = document.getElementById("mensajes-chat");
    if (!contenedor) throw new Error("No se encontro el contenedor del chat.");
    const elementoMensaje = document.createElement("div");
    elementoMensaje.className = `mensaje ${tipo === "user" ? "mensaje-usuario" : "mensaje-asistente"}`;
    elementoMensaje.textContent = texto;
    contenedor.appendChild(elementoMensaje);
    contenedor.scrollTop = contenedor.scrollHeight;
  }

  function procesarChat(evento) {
    evento.preventDefault();
    const entrada = document.getElementById("entrada-chat");
    const texto = entrada.value.trim();
    if (!texto) {
      agregarMensaje("Escribe una consulta antes de enviarla.", "bot");
      entrada.focus();
      return;
    }

    agregarMensaje(texto, "user");
    entrada.value = "";

    setTimeout(() => {
      const respuesta = guia.responder(texto);
      agregarMensaje(respuesta, "bot");
    }, 250);
  }

  function enviarPreguntaRapida(pregunta) {
    agregarMensaje(pregunta, "user");
    setTimeout(() => {
      const respuesta = guia.responder(pregunta);
      agregarMensaje(respuesta, "bot");
    }, 250);
  }

  function renderizarCodigosEjemplos() {
    const casos = muestraCodigos.getCasos();
    const totalCasos = casos.length;
    if (totalCasos === 0) throw new Error("No hay casos de codigo para mostrar.");

    document.getElementById("total-ejercicios").textContent = totalCasos;
    document.getElementById("intentos-fallidos").textContent = `${estado.intentosFallidosMod2} / 2`;

    const retroalimentacion = document.getElementById("retroalimentacion-ejercicio");
    retroalimentacion.className = "caja-retroalimentacion oculto";

    if (estado.mod2Aprobado) {
      document.getElementById("numero-ejercicio").textContent = totalCasos;
      document.getElementById("titulo-ejercicio").textContent = "¡Ejercicios completados!";
      document.getElementById("contexto-ejercicio").textContent = "Revisaste los tres casos de buenas practicas de seguridad.";
      document.getElementById("codigo-incorrecto").textContent = "// Ejercicios completados.";
      document.getElementById("codigo-corregido").textContent = "// Buenas practicas aplicadas.";
      document.getElementById("pregunta-ejercicio").textContent = "Estatus del módulo:";
      document.getElementById("opciones-ejercicio").innerHTML = `<button class="boton-principal" onclick="EvaluadorControlador.irAModulo('vista-cuestionario')">Continuar al cuestionario</button>`;
      return;
    }

    const caso = casos[estado.pasoMod2];
    document.getElementById("numero-ejercicio").textContent = estado.pasoMod2 + 1;
    document.getElementById("titulo-ejercicio").textContent = caso.titulo;
    document.getElementById("contexto-ejercicio").textContent = caso.contexto;
    document.getElementById("codigo-incorrecto").textContent = caso.codigoInseguro;
    document.getElementById("codigo-corregido").textContent = caso.codigoSeguro;
    document.getElementById("pregunta-ejercicio").textContent = caso.pregunta;

    const contenedorOpciones = document.getElementById("opciones-ejercicio");
    contenedorOpciones.innerHTML = "";
    caso.opciones.forEach((opcion) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "boton-opcion";
      boton.textContent = `${opcion.letra}) ${opcion.texto}`;
      boton.onclick = () => validarCodigoMod2(opcion.letra);
      contenedorOpciones.appendChild(boton);
    });
  }

  function validarCodigoMod2(letraSeleccionada) {
    const caso = muestraCodigos.getCasos()[estado.pasoMod2];
    const respuestaCorrecta = caso.respuestaCorrecta;
    const retroalimentacion = document.getElementById("retroalimentacion-ejercicio");

    if (letraSeleccionada === respuestaCorrecta) {
      estado.pasoMod2++;
      if (estado.pasoMod2 >= muestraCodigos.getCasos().length) {
        estado.pasoMod2 = muestraCodigos.getCasos().length - 1;
        estado.mod2Aprobado = true;
      }
      guardarEstado();
      renderizarCodigosEjemplos();
      if (estado.mod2Aprobado) {
        mostrarNotificacion("¡Completaste los tres casos de codigo!", "exito");
      } else {
        mostrarNotificacion(`¡Correcto! Avanzas al caso ${estado.pasoMod2 + 1} de ${muestraCodigos.getCasos().length}.`, "exito");
      }
    } else {
      estado.intentosFallidosMod2++;
      document.getElementById("intentos-fallidos").textContent = `${estado.intentosFallidosMod2} / 2`;
      guardarEstado();

      if (estado.intentosFallidosMod2 >= 2) {
        document.getElementById("aviso-intentos-agotados").classList.remove("oculto");
      } else {
        retroalimentacion.textContent = "Respuesta incorrecta. Te queda un intento antes de reiniciar el modulo.";
        retroalimentacion.className = "caja-retroalimentacion retroalimentacion-aviso";
        retroalimentacion.classList.remove("oculto");
      }
    }
  }

  function cerrarModalYReiniciarMod2() {
    document.getElementById("aviso-intentos-agotados").classList.add("oculto");
    estado.pasoMod2 = 0;
    estado.intentosFallidosMod2 = 0;
    estado.mod2Aprobado = false;
    guardarEstado();
    renderizarCodigosEjemplos();
    irAModulo("vista-inicio");
  }

  function renderizarQuizzTest() {
    const contenedorPreguntas = document.getElementById("lista-preguntas");
    contenedorPreguntas.innerHTML = "";

    const preguntas = evaluador.getPreguntasQuizz();
    preguntas.forEach((textoPregunta, indicePregunta) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-pregunta-cuestionario";

      const indiceOpcionA = textoPregunta.indexOf("\nA)");
      const indiceOpcionB = textoPregunta.indexOf("\nB)");
      if (indiceOpcionA === -1 || indiceOpcionB === -1 || indiceOpcionB < indiceOpcionA) {
        throw new Error(`La pregunta ${indicePregunta + 1} no tiene el formato esperado.`);
      }

      const enunciado = textoPregunta.slice(0, indiceOpcionA).replace(/\s+/g, " ").trim();
      const opciones = [
        textoPregunta.slice(indiceOpcionA + 1, indiceOpcionB).replace(/\s+/g, " ").trim(),
        textoPregunta.slice(indiceOpcionB + 1).replace(/\s+/g, " ").trim()
      ];
      const encabezado = document.createElement("h4");
      encabezado.textContent = enunciado;
      tarjeta.appendChild(encabezado);

      opciones.forEach((opcion, indice) => {
        const letra = indice === 0 ? "A" : "B";
        const etiqueta = document.createElement("label");
        etiqueta.className = "etiqueta-respuesta-cuestionario";

        const respuesta = document.createElement("input");
        respuesta.type = "radio";
        respuesta.name = `q_${indicePregunta}`;
        respuesta.value = letra;
        respuesta.required = true;

        etiqueta.append(respuesta, document.createTextNode(` ${opcion}`));
        tarjeta.appendChild(etiqueta);
      });

      contenedorPreguntas.appendChild(tarjeta);
    });
  }

  function evaluarQuizzTest(evento) {
    evento.preventDefault();
    const formulario = document.getElementById("formulario-cuestionario");
    const preguntas = evaluador.getPreguntasQuizz();
    if (preguntas.length === 0) throw new Error("El cuestionario no tiene preguntas.");

    const indiceSinRespuesta = preguntas.findIndex((_, indice) =>
      !formulario.querySelector(`input[name="q_${indice}"]:checked`)
    );
    if (indiceSinRespuesta !== -1) {
      mostrarNotificacion("Responde todas las preguntas antes de calificar el cuestionario.", "informacion");
      formulario.querySelector(`input[name="q_${indiceSinRespuesta}"]`).focus();
      return;
    }

    let aciertos = 0;
    let reporte = "=== REPORTE OFICIAL QUIZZTEST (SIDEC) ===\n\n";
    const correctas = evaluador.getRespuestasCorr();
    const tarjetasPregunta = formulario.querySelectorAll(".tarjeta-pregunta-cuestionario");
    const listaRevision = document.getElementById("lista-revision-respuestas");
    listaRevision.textContent = "";

    preguntas.forEach((_, indicePregunta) => {
      const tarjetaPregunta = tarjetasPregunta[indicePregunta];
      if (!tarjetaPregunta) throw new Error(`No se encontro la tarjeta de la pregunta ${indicePregunta + 1}.`);

      const enunciado = tarjetaPregunta.querySelector("h4");
      const seleccion = tarjetaPregunta.querySelector(`input[name="q_${indicePregunta}"]:checked`);
      if (!enunciado || !seleccion) throw new Error(`No se pudo leer la respuesta de la pregunta ${indicePregunta + 1}.`);

      const opciones = Array.from(tarjetaPregunta.querySelectorAll(".etiqueta-respuesta-cuestionario")).map((etiqueta) => {
        const entrada = etiqueta.querySelector("input[type='radio']");
        if (!entrada) throw new Error(`No se encontro una opcion de la pregunta ${indicePregunta + 1}.`);
        return {
          letra: entrada.value,
          texto: etiqueta.textContent.trim().replace(/^[A-Z]\)\s*/, "")
        };
      });

      const valorRespuesta = seleccion.value;
      const esCorrecta = valorRespuesta === correctas[indicePregunta];
      const opcionElegida = opciones.find(opcion => opcion.letra === valorRespuesta);
      const opcionCorrecta = opciones.find(opcion => opcion.letra === correctas[indicePregunta]);
      if (!opcionElegida || !opcionCorrecta) throw new Error(`No se pudo identificar la opcion de la pregunta ${indicePregunta + 1}.`);
      const textoEnunciado = enunciado.textContent.trim();

      if (esCorrecta) aciertos++;
      reporte += `Pregunta ${indicePregunta + 1}: ${textoEnunciado}\nTu respuesta [${valorRespuesta}] -> ${esCorrecta ? "[CORRECTA]" : "[INCORRECTA] (Correcta: " + correctas[indicePregunta] + ")"}\n\n`;

      const tarjetaRevision = document.createElement("article");
      tarjetaRevision.className = `tarjeta-revision-respuesta ${esCorrecta ? "respuesta-revision-aprobada" : "respuesta-revision-incorrecta"}`;

      const encabezadoRevision = document.createElement("div");
      encabezadoRevision.className = "encabezado-revision-respuesta";

      const tituloPregunta = document.createElement("h4");
      tituloPregunta.textContent = `Pregunta ${indicePregunta + 1}`;

      const estadoRespuesta = document.createElement("span");
      estadoRespuesta.className = "estado-revision-respuesta";
      estadoRespuesta.textContent = esCorrecta ? "Correcta" : "Incorrecta";
      encabezadoRevision.append(tituloPregunta, estadoRespuesta);

      const textoPregunta = document.createElement("p");
      textoPregunta.className = "enunciado-revision-respuesta";
      textoPregunta.textContent = textoEnunciado;

      const respuestaElegida = document.createElement("p");
      respuestaElegida.className = `detalle-revision-respuesta ${esCorrecta ? "detalle-respuesta-correcta" : "detalle-respuesta-incorrecta"}`;
      respuestaElegida.textContent = `${esCorrecta ? "Respuesta correcta" : "Tu respuesta"}: ${opcionElegida.texto}`;

      tarjetaRevision.append(encabezadoRevision, textoPregunta, respuestaElegida);

      if (!esCorrecta) {
        const respuestaCorrecta = document.createElement("p");
        respuestaCorrecta.className = "detalle-revision-respuesta detalle-respuesta-correcta";
        respuestaCorrecta.textContent = `Respuesta correcta: ${opcionCorrecta.texto}`;
        tarjetaRevision.appendChild(respuestaCorrecta);
      }

      listaRevision.appendChild(tarjetaRevision);
    });

    const totalPreguntas = preguntas.length;
    const puntajeMinimo = Math.ceil(totalPreguntas * 0.8);
    const aprobado = aciertos >= puntajeMinimo;

    reporte += `PUNTAJE FINAL: ${aciertos} / ${totalPreguntas} (${(aciertos / totalPreguntas) * 100}%)\n`;
    reporte += `ESTATUS: ${aprobado ? "APROBADO" : `NO APROBADO (Minimo requerido: ${puntajeMinimo}/${totalPreguntas})`}`;

    if (aprobado) estado.mod3Aprobado = true;
    guardarEstado();

    formulario.classList.add("oculto");
    const panelResultados = document.getElementById("panel-resultados-cuestionario");
    panelResultados.classList.toggle("resultado-aprobado", aprobado);
    panelResultados.classList.toggle("resultado-no-aprobado", !aprobado);
    panelResultados.classList.remove("oculto");

    const resumen = document.getElementById("resumen-puntuacion");
    resumen.textContent = aprobado
      ? "¡Excelente trabajo! Aprobaste el cuestionario."
      : "Aún no alcanzas el puntaje necesario para aprobar.";

    document.getElementById("detalle-puntuacion").textContent =
      `Obtuviste ${aciertos} de ${totalPreguntas} aciertos. Se requieren ${puntajeMinimo} para aprobar.`;

    const estadoResultado = document.getElementById("estado-resultado");
    estadoResultado.className = `estado-resultado ${aprobado ? "estado-resultado-aprobado" : "estado-resultado-pendiente"}`;
    estadoResultado.textContent = aprobado ? "APROBADO" : "SIGUE PRACTICANDO";

    const porcentaje = Math.round((aciertos / totalPreguntas) * 100);
    const barraPuntuacion = document.getElementById("barra-puntuacion-cuestionario");
    barraPuntuacion.setAttribute("aria-valuenow", String(porcentaje));
    document.getElementById("relleno-puntuacion-cuestionario").style.width = `${porcentaje}%`;

    document.getElementById("reporte-cuestionario").value = reporte;
  }

  function reiniciarQuizzTest() {
    document.getElementById("panel-resultados-cuestionario").classList.add("oculto");
    document.getElementById("formulario-cuestionario").classList.remove("oculto");
    document.getElementById("formulario-cuestionario").reset();
  }

  function solicitarReinicio() {
    const dialogo = document.getElementById("dialogo-reinicio");
    if (!dialogo.open) dialogo.showModal();
  }

  function cancelarReinicio() {
    const dialogo = document.getElementById("dialogo-reinicio");
    if (dialogo.open) dialogo.close();
  }

  function confirmarReinicio() {
    cancelarReinicio();
    reiniciarTodo();
    mostrarNotificacion("El progreso del curso se reinicio.", "exito", true);
  }

  function reiniciarTodo() {
    localStorage.removeItem("sidec_estado_sesion");
    estado = crearEstadoInicial();
    document.getElementById("aviso-intentos-agotados").classList.add("oculto");
    reiniciarQuizzTest();
    actualizarIndicadores();
    irAModulo("vista-inicio");
  }

  window.addEventListener("DOMContentLoaded", () => {
    cargarEstado();
    actualizarIndicadores();
    if (!estado.mod2Aprobado && estado.intentosFallidosMod2 >= 2) {
      document.getElementById("aviso-intentos-agotados").classList.remove("oculto");
    }
  });

  return {
    cambiarVista,
    irAModulo,
    procesarChat,
    enviarPreguntaRapida,
    cerrarModalYReiniciarMod2,
    evaluarQuizzTest,
    reiniciarQuizzTest,
    solicitarReinicio,
    cancelarReinicio,
    confirmarReinicio,
    reiniciarTodo
  };
})();