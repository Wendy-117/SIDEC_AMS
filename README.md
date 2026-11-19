# SIDEC - Sistema Interactivo de Desarrollo Etico

SIDEC es una plataforma web educativa que explica el uso seguro y etico de la inteligencia artificial generativa. La aplicacion permite consultar conceptos con un asistente basado en reglas, comparar fragmentos de codigo Java, responder un cuestionario y guardar el progreso en el navegador.

## Funcionalidades

- Inicio con una vista general del curso y del avance logrado.
- GuiaChatTest: chat local llamado **Asistente Lumini**.
- CodigosEjemplos: practica con codigo seguro e inseguro.
- QuizzTest: cuestionario final de 10 preguntas.
- Barra de progreso que registra los modulos aprobados.
- Persistencia del avance con `localStorage`.
- Diseño adaptable para escritorio, tableta y telefono.
- Modal de confirmacion para reiniciar el progreso.

## Tecnologias utilizadas

- HTML5 para la estructura de las vistas.
- CSS3 para estilos, componentes y diseño responsive.
- JavaScript moderno sin frameworks.
- `localStorage` para guardar el progreso.
- SVG integrado para ilustraciones e iconos.

No necesita servidor de base de datos ni API externa. El asistente trabaja con coincidencias locales de palabras clave y no utiliza una IA real.

## Estructura del proyecto

```text
ProyectoSIDEC/
├── index.html
├── README.md
├── cs/
│   └── estilos.css
└── js/
    ├── ContenidoEdu.js
    ├── Guia.js
    ├── MuestraCodigos.js
    ├── Evaluador.js
    └── EvaluadorControlador.js
```

### Archivos principales

| Archivo | Funcion |
|---|---|
| `index.html` | Contiene las vistas Inicio, Guia, Ejercicios y Cuestionario. |
| `cs/estilos.css` | Define variables visuales, componentes, notificaciones, modales y responsive. |
| `js/ContenidoEdu.js` | Clase base con identificador, titulo y estado de finalizacion. |
| `js/Guia.js` | Contiene las respuestas y palabras clave del Asistente Lumini. |
| `js/MuestraCodigos.js` | Administra los tres casos practicos de codigo Java. |
| `js/Evaluador.js` | Guarda las 10 preguntas del cuestionario y sus respuestas correctas. |
| `js/EvaluadorControlador.js` | Coordina la interfaz, navegacion, evaluaciones y progreso persistente. |

## Ejecucion

No requiere compilacion ni instalacion.

### Desde Visual Studio Code

1. Abre la carpeta `ProyectoSIDEC`.
2. Ejecuta `index.html` con Live Server u otra extension similar.
3. Abre el enlace que indique el servidor local.

### Desde el explorador

Tambien puedes abrir directamente `index.html` en el navegador. Para evitar restricciones entre navegadores, se recomienda utilizar Live Server o un servidor HTTP local.

```powershell
cd "C:\Users\princ\OneDrive\Música\Documentos\ProyectoSIDEC"
python -m http.server 5500
```

Después abre `http://localhost:5500`.

## Como funciona

### Navegacion

La pagina usa varias secciones con la clase `seccion-vista`. Solo la vista activa recibe la clase `activo` y se muestra.

Las funciones principales son:

- `EvaluadorControlador.cambiarVista(idVista, botonElemento)`: cambia la vista visible.
- `EvaluadorControlador.irAModulo(idVista)`: abre un modulo desde una tarjeta o boton.
- `ActualizarIndicadores()`: actualiza progreso, etiquetas y el aviso de curso completado.

### Asistente Lumini

El usuario escribe una consulta o selecciona una pregunta rapida. El controlador agrega el mensaje a la interfaz y ejecuta `Guia.responder()`.

El metodo normaliza el texto:

1. Lo convierte a minusculas.
2. Elimina acentos.
3. Busca palabras clave dentro del mensaje.
4. Devuelve la respuesta asociada.
5. Si no encuentra una coincidencia, muestra la respuesta `default`.

Las palabras clave incluyen `etica`, `plagio`, `seguridad`, `fuga de datos`, `calidad`, `alucinacion`, `normatividad`, `ley`, `gracias` y `adios`.

### Practica de codigo

Cada caso contiene:

- Titulo y contexto.
- Codigo inseguro.
- Codigo corregido.
- Pregunta y opciones.
- Letra de la respuesta correcta.

Los casos de `MuestraCodigos` son:

1. Credenciales en texto plano.
2. Tokens o contrasenas en registros.
3. Detalles internos expuestos en errores.

El modulo permite hasta dos intentos fallidos. Si se alcanzan los dos:

- Se muestra un modal informativo.
- El progreso del modulo vuelve al primer caso.
- Los intentos fallidos se restablecen a cero.
- El usuario regresa al inicio.

Para aprobarse, el usuario debe responder correctamente los tres casos.

### Cuestionario final

El cuestionario contiene 10 preguntas con opciones A y B. El controlador:

1. Comprueba que todas las preguntas tengan respuesta.
2. Compara cada seleccion con `Evaluador.getRespuestasCorr()`.
3. Calcula el porcentaje de aciertos.
4. Requiere al menos 80% para aprobar.
5. Conserva una revision detallada de las respuestas.
6. Genera un reporte de texto disponible en el panel de resultados.

Para aprobar las 10 preguntas se necesitan como minimo 8 aciertos.

### Sistema de progreso

El progreso se guarda bajo la clave:

```text
sidec_estado_sesion
```

El estado tiene esta forma:

```javascript
{
  pasoMod2: 0,
  intentosFallidosMod2: 0,
  mod2Aprobado: false,
  mod3Aprobado: false
}
```

Al abrir la pagina, el controlador valida el contenido almacenado. Un dato incompleto, corrupto o fuera de rango se elimina y se reemplaza por el estado inicial.

El curso se considera completado cuando:

- `mod2Aprobado` es `true`.
- `mod3Aprobado` es `true`.

El boton **Reiniciar progreso** elimina el estado guardado y vuelve al inicio.

## Diseño responsive

`estilos.css` organiza la pagina con variables CSS y media queries:

- Mas de 900 px: barra lateral fija y contenido principal desplazado.
- 900 px o menos: barra lateral superior y navegacion adaptada.
- 620 px o menos: tarjetas y formularios en una sola columna.
- 380 px o menos: elementos se ajustan aun mas para pantallas pequenas.
- `prefers-reduced-motion`: reduce las animaciones cuando el usuario lo solicita.

## Buenas practicas incluidas

Los ejemplos educativos promueven:

- Uso de variables de entorno para credenciales.
- Evitar contrasenas y tokens en registros.
- Mostrar mensajes generales al usuario ante errores.
- Auditar el codigo generado por IA.
- Verificar licencias y propiedad intelectual.
- Proteger datos sensibles.
- Mantener supervision humana y trazabilidad.

## Personalizacion

### Agregar respuestas al chat

Edita el objeto `this.respuestas` de `js/Guia.js`. Agrega una clave normalizada en minusculas y sin acentos:

```javascript
"clave": "Texto de respuesta."
```

Las respuestas se evaluan por coincidencia dentro del mensaje del usuario.

### Agregar casos de codigo

Anade objetos al arreglo `this.casos` dentro de `js/MuestraCodigos.js`. Cada caso debe incluir:

- `titulo`
- `contexto`
- `codigoInseguro`
- `codigoSeguro`
- `pregunta`
- `opciones`
- `respuestaCorrecta`

### Modificar preguntas del cuestionario

Las preguntas se crean en `js/Evaluador.js` dentro de `responderCuestionario()`. Cada entrada debe contener el enunciado y las opciones marcadas con `A)` y `B)`.

Posteriormente actualiza `this.respuestasCorr` con la letra correcta correspondiente al indice de la pregunta.

## Limitaciones conocidas

- El chat no usa inteligencia artificial ni una API externa.
- Las respuestas dependen de palabras clave presentes en el mensaje.
- El progreso se mantiene solo en el navegador actual.
- El almacenamiento puede borrarse si el usuario limpia los datos del sitio.
- No existe autenticacion de usuarios ni conexion con una base de datos.

## Documentacion SCRUM y Jira

La entrega de SCRUM, Jira, graficas, portafolio GitHub y cierre del proyecto se encuentra en [ENTREGA_SCRUM_JIRA.md](ENTREGA_SCRUM_JIRA.md). Los diagramas PlantUML estan en [diagramas/](diagramas/).
