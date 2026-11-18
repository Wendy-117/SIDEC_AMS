class ContenidoEdu {
  constructor(id = 0, titulo = "Sin asignar") {
    this.id = id;
    this.titulo = titulo;
    this.completada = false;
  }

  getId() {
    return this.id;
  }

  getTitulo() {
    return this.titulo;
  }

  isCompletada() {
    return this.completada;
  }

  setCompletada(completada) {
    this.completada = completada;
  }
}