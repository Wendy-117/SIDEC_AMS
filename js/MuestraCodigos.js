class MuestraCodigos extends ContenidoEdu {
  constructor() {
    super(2, "Muestra de codigos e identificacion");
    this.casos = [
      {
        titulo: "Credenciales guardadas en el codigo",
        contexto: "Compara una conexion con credenciales escritas en el archivo y otra que las obtiene de variables de entorno.",
        codigoInseguro:
          "public class ConexionBD {\n" +
          "    private String usuario = \"admin\";\n" +
          "    private String contrasena = \"DEMO_PASSWORD\";\n" +
          "}",
        codigoSeguro:
          "public class ConexionBD {\n" +
          "    private String usuario = System.getenv(\"DB_USER\");\n" +
          "    private String contrasena = System.getenv(\"DB_PASSWORD\");\n" +
          "}",
        pregunta: "¿Cual es la forma recomendada de manejar estas credenciales?",
        opciones: [
          { letra: "A", texto: "Obtenerlas de una configuracion segura, como variables de entorno." },
          { letra: "B", texto: "Escribirlas directamente en el codigo para encontrarlas facilmente." }
        ],
        respuestaCorrecta: "A"
      },
      {
        titulo: "Informacion sensible en los registros",
        contexto: "Los registros ayudan a revisar eventos, pero no deben guardar contrasenas ni tokens.",
        codigoInseguro:
          "public void registrarAcceso(String token) {\n" +
          "    System.out.println(\"Token usado: \" + token);\n" +
          "}",
        codigoSeguro:
          "public void registrarAcceso(String usuario) {\n" +
          "    System.out.println(\"Acceso registrado para \" + usuario);\n" +
          "}",
        pregunta: "¿Que dato conviene evitar en los registros de la aplicacion?",
        opciones: [
          { letra: "A", texto: "El nombre de la operacion realizada." },
          { letra: "B", texto: "La contrasena o el token utilizado." }
        ],
        respuestaCorrecta: "B"
      },
      {
        titulo: "Mensajes de error con detalles internos",
        contexto: "Los mensajes para el usuario deben ser claros sin revelar informacion tecnica innecesaria.",
        codigoInseguro:
          "catch (Exception error) {\n" +
          "    mostrarMensaje(error.getMessage());\n" +
          "}",
        codigoSeguro:
          "catch (Exception error) {\n" +
          "    registrarErrorInterno(error);\n" +
          "    mostrarMensaje(\"No se pudo completar la operacion.\");\n" +
          "}",
        pregunta: "¿Que deberia mostrar la aplicacion cuando ocurre un error?",
        opciones: [
          { letra: "A", texto: "Un mensaje general, sin detalles internos de la excepcion." },
          { letra: "B", texto: "El mensaje tecnico completo de la excepcion." }
        ],
        respuestaCorrecta: "A"
      }
    ];
  }

  obtenerInfo() {
    return "Modulo " + this.getId() + ": " + this.getTitulo();
  }

  getCasos() {
    return this.casos;
  }

  getEjemploMalaPractica() {
    return this.casos[0].codigoInseguro;
  }

  getEjemploBuenaPractica() {
    return this.casos[0].codigoSeguro;
  }

  getPreguntasCodigo() {
    return this.casos.map((caso) => caso.pregunta);
  }

  getRespuestasCorrectas() {
    return this.casos.map((caso) => caso.respuestaCorrecta);
  }
}
