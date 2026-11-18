class Guia extends ContenidoEdu {
  constructor() {
    super(1, "Introduccion a los Riesgos de la IA Publica y Etica");
    this.respuestas = {
      "hola": "Hola!, Bienvenid@, Soy tu asistente Lumini\n" +
              "Te doy la bienvenida a la plataforma de capacitacion de IA Generativa\n" +
              "¿Que concepto de desarrollo seguro o de etica te gustaria abordar?",
      "buenos dias": "¡Buen dia! Estoy lista para responder a tus preguntas.\n" +
                      "¿Con que tema te gustaria empezar?",
      "etica": "El desarrollo ético con IA implica:\n" +
               "1. No usar código generado que viole derechos de autor.\n" +
               "2. Evitar sesgos discriminatorios en los algoritmos.\n" +
               "3. Ser transparente al declarar que usaste IA en tu software.",
      "plagio": "Debes evitar el plagio o violacion de propiedad intelectual\n" +
                "Sigue los siguientes pasos:\n" +
                "Siempre verifica las licencias (como Apache) del código que te sugiere la IA\n" +
                "antes de meterlo a producción.",
      "seguridad": "Esta es una regla que no debes olvidar!!\n" +
                   "NUNCA pegues datos sensibles en el prompt (ya sea\n" +
                   "tokens, API, passwords o datos REALES de clientes.\n" +
                   "Segun el servicio y su configuracion, esos datos podrian almacenarse o revisarse.",
      "fuga de datos": "La fuga de datos ocurre cuando subes un codigo al prompt\n" +
                       "a una IA publica\n" +
                       "Usa herramientas aprobadas y revisa sus politicas de almacenamiento.\n" +
                       "Una herramienta local puede reducir la exposicion, pero tambien requiere proteccion.",
      "calidad": "La IA genera codigo basado en patrones, no en razonamiento\n" +
                 "Para garantizar la calidad, tu mismo debes auditar el codigo\n" +
                 "aplicar refactorizacion, clean code y hacer pruebas unitarias.",
      "alucinacion": "Es cuando genera codigo inventado, librerias que\n" +
                     "no existen o funciones obsoletas\n" +
                     "Nunca copies y pegues a ciegas, considera primero probar y compilar.",
      "normatividad": "Actualmente existen marcos como la Ley de IA de la\n" +
                      "Unión Europea (EU AI Act) y estándares ISO que regulan\n" +
                      "el nivel de riesgo del software asistido, exigiendo\n" +
                      "auditorías en sistemas de alto impacto.",
      "ley": "Las normativas obligan a los desarrolladores a:\n" +
             "- Garantizar la ciberseguridad\n" +
             "- Mantener la trazabilidad del código generado.\n" +
             "- Asegurar la supervision humana en todo momento.",
      "gracias": "No hay de que! Puedes escribir otra pregunta cuando quieras\n" +
                 "y con gusto te explicare nuevamente.",
      "adios": "Hasta luego!!! No olvides seguir todos los tips que\n" +
               "te he dado. Que tengas un buen dia!",
      "default": "Disculpa, no conozco ese termino. Prueba con:\n" +
                 "etica, plagio, seguridad, fuga de datos, calidad, alucinacion\n" +
                 "normatividad o ley."
    };
  }

  responder(mensaje) {
    const texto = mensaje
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const claves = Object.keys(this.respuestas)
      .filter((clave) => clave !== "default")
      .sort((a, b) => b.length - a.length);

    for (const clave of claves) {
      if (texto.includes(clave)) {
        return this.respuestas[clave];
      }
    }

    return this.respuestas.default;
  }

  obtenerInfo() {
    return "Modulo " + this.getId() + ": " + this.getTitulo();
  }
}