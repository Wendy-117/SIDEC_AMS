class Evaluador extends ContenidoEdu {
  constructor(preguntasQuizz = null, respuestasCorr = null, id = 3, titulo = "Quizz de Evaluacion") {
    super(id, titulo);

    if (preguntasQuizz !== null && respuestasCorr !== null) {
      this.preguntasQuizz = preguntasQuizz;
      this.respuestasCorr = respuestasCorr;
    } else {
      this.preguntasQuizz = new Array(10);
      this.respuestasCorr = new Array(10);
      this.responderCuestionario();
    }
  }

  responderCuestionario() {
    this.preguntasQuizz[0] = "1.- ¿Que riesgo puede existir al introducir informacion\n o codigo propietario en una IA publica?\n" +
      "A) El servidor de la IA podria saturarse.\nB) El servicio podria almacenar el contenido segun sus politicas y exponerlo por un incidente o una configuracion inadecuada.";
    
    this.preguntasQuizz[1] = "2.- ¿Que significa el termino 'Credenciales Hardcoded'?\n" +
      "A) Guardar contraseñas fijas en texto plano directamente dentro del codigo.\n" +
      "B) Cifrar llaves criptograficas de forma segura en el sistema operativo.";
    
    this.preguntasQuizz[2] = "3.- ¿Por que es una buena práctica usar\n variables de entorno mediante 'System.getenv()'?\n" +
      "A) Aislan la informacion confidencial fuera del\n codigo fuente, evitando filtraciones.\n" +
      "B) Reducen drasticamente el peso del archivo ejecutable final JAR.";
    
    this.preguntasQuizz[3] = "4.- ¿Cual es el objetivo de realizar validaciones\n preventivas antes de procesar una variable critica?\n" +
      "A) Detener el flujo de inmediato ante un error (Fail-Fast)\n para evitar fallas graves.\n" +
      "B) Modificar de manera automatica el diseño visual de los JFrames.";
    
    this.preguntasQuizz[4] = "5.- ¿Que peligro corren las claves si el proyecto\n se sube a un repositorio publico en internet sin una revision previa?\n" +
      "A) Que los servidores web rechacen el proyecto por falta de licencias.\n" +
      "B) Que bots automatizados rastreen el codigo y extraigan las claves expuestas en minutos.";
    
    this.preguntasQuizz[5] = "6.- Segun Clean Code, ¿por que se debe priorizar el\n" +
      "uso de nombres descriptivos completos sobre siglas cortas?\n" +
      "A) Facilita la legibilidad y mantenimiento del sistema para otros desarrolladores.\n" +
      "B) Permite que la computadora procese las instrucciones logicas en la mitad de tiempo.";
    
    this.preguntasQuizz[6] = "7.- ¿Por que es recomendable que los metodos reciban\n datos mediante parametros en lugar de variables globales sueltas?\n" +
      "A) Reduce el acoplamiento del software, haciendo al metodo autonomo y reutilizable.\n" +
      "B) Fuerza al sistema operativo a ejecutar la operacion en hilos asincronos.";
    
    this.preguntasQuizz[7] = "8.- ¿Cual es la función estricta del 'Controlador' dentro del patron\n de arquitectura de software MVC?\n" +
      "A) Almacenar los textos de la interfaz y renderizar los componentes de la vista.\n" +
      "B) Actuar como puente y centralizar la logica de negocio, validaciones y decisiones.";
    
    this.preguntasQuizz[8] = "9.- ¿En que consiste el principio de ciberseguridad\n 'Confianza Cero' aplicado al desarrollo?\n" +
      "A) En asumir que todo codigo generado por fuentes externas o automaticas debe ser auditado.\n" +
      "B) En deshabilitar los protocolos de red y firewalls de los servidores de produccion.";
    
    this.preguntasQuizz[9] = "10.- ¿Que indica System.exit(0) al terminar una aplicacion Java?\n" +
      "A) Finaliza la maquina virtual de Java con un codigo que indica terminacion normal.\n" +
      "B) Cierra solo la ventana activa y deja la maquina virtual en ejecucion.";

    this.respuestasCorr[0] = "B";
    this.respuestasCorr[1] = "A";
    this.respuestasCorr[2] = "A";
    this.respuestasCorr[3] = "A";
    this.respuestasCorr[4] = "B";
    this.respuestasCorr[5] = "A";
    this.respuestasCorr[6] = "A";
    this.respuestasCorr[7] = "B";
    this.respuestasCorr[8] = "A";
    this.respuestasCorr[9] = "A";
  }

  generarPresentacionBot() {
    return "BOT: Iniciando el modulo numero " + this.getId() + ": " + this.getTitulo() + ".\n" +
           "Por favor responde unicamente con la letra de la opcion A o B.\n";
  }

  getPreguntasQuizz() {
    return this.preguntasQuizz;
  }

  getRespuestasCorr() {
    return this.respuestasCorr;
  }
}