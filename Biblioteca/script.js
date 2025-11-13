//***************************************************************
//***************************************************************
// CLASES PRINCIPALES
class MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion, disponible) {
    this.titulo = titulo;
    this.autor = autor;
    this.anioPublicacion = anioPublicacion;
    this.disponible = disponible;
  }

  mostrarInfo() {
    console.log(
      `Título: ${this.titulo}, Autor: ${this.autor}, Año: ${this.anioPublicacion}, Disponible: ${this.disponible}`
    );
  }

  prestar() {
    if (this.disponible) {
      this.disponible = false;
      console.log(`${this.titulo} ha sido prestado.`);
    } else {
      console.log(`${this.titulo} no está disponible.`);
    }
  }

  devolver() {
    if (!this.disponible) {
      this.disponible = true;
      console.log(`${this.titulo} ha sido devuelto.`);
    } else {
      console.log(`${this.titulo} ya estaba disponible.`);
    }
  }
}

//***************************************************************
//***************************************************************
// CLASES DERIVADAS
class Libro extends MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion, disponible, numeroPaginas) {
    super(titulo, autor, anioPublicacion, disponible);
    this.numeroPaginas = numeroPaginas;
  }

  resumen() {
    console.log(
      `El libro ${this.titulo} (autor: ${this.autor}) tiene ${this.numeroPaginas} páginas.`
    );
  }
}

class Revista extends MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion, disponible, numeroEdicion) {
    super(titulo, autor, anioPublicacion, disponible);
    this.numeroEdicion = numeroEdicion;
  }

  mostrarEdicion() {
    console.log(
      `Revista: ${this.titulo} | Edición ${this.numeroEdicion} (${this.anioPublicacion})`
    );
  }
}

class VideoEducativo extends MaterialBiblioteca {
  constructor(titulo, autor, anioPublicacion, disponible, duracion, tema) {
    super(titulo, autor, anioPublicacion, disponible);
    this.duracion = duracion;
    this.tema = tema;
  }

  reproducir() {
    console.log(
      `Reproduciendo "${this.titulo}" (${this.duracion} min) sobre ${this.tema}.`
    );
  }
}

//***************************************************************
//***************************************************************
// CLASE USUARIO
class Usuario {
  constructor(nombre, idUsuario) {
    this.nombre = nombre;
    this.idUsuario = idUsuario;
    this.materialPrestado = [];
  }

  prestarMaterial(material) {
    if (material.disponible) {
      material.prestar();
      this.materialPrestado.push(material);
      console.log(`${this.nombre} ha tomado prestado "${material.titulo}".`);
    } else {
      console.log(`"${material.titulo}" no está disponible para préstamo.`);
    }
  }

  devolverMaterial(material) {
    const index = this.materialPrestado.indexOf(material);
    if (index !== -1) {
      material.devolver();
      this.materialPrestado.splice(index, 1);
      console.log(`${this.nombre} ha devuelto "${material.titulo}".`);
    } else {
      console.log(`${this.nombre} no tiene prestado "${material.titulo}".`);
    }
  }
}

//***************************************************************
//***************************************************************
// CLASE BIBLIOTECA
class Biblioteca {
  constructor() {
    this.materiales = [];
    this.usuarios = [];
  }

  agregarMaterial(material) {
    this.materiales.push(material);
    console.log(`"${material.titulo}" agregado a la biblioteca.`);
  }

  buscarMaterial(titulo) {
    return (
      this.materiales.find(
        (m) => m.titulo.toLowerCase() === titulo.toLowerCase()
      ) || null
    );
  }

  listarMateriales() {
    if (this.materiales.length === 0) {
      console.log("No hay materiales en la biblioteca.");
      return;
    }
    console.log("LISTA DE MATERIALES");
    this.materiales.forEach((m) => {
      const tipo = m.constructor.name;
      console.log(
        `[${tipo}] ${m.titulo} - ${m.disponible ? "Disponible" : "Prestado"}`
      );
    });
  }

  registrarUsuario(usuario) {
    const existe = this.usuarios.some((u) => u.idUsuario === usuario.idUsuario);
    if (!existe) {
      this.usuarios.push(usuario);
      console.log(`Usuario "${usuario.nombre}" registrado.`);
    } else {
      console.log(`El usuario con ID ${usuario.idUsuario} ya existe.`);
    }
  }

  gestionarPrestamo(idUsuario, tituloMaterial) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    const material = this.buscarMaterial(tituloMaterial);

    if (!usuario) return console.log(`Usuario no encontrado.`);
    if (!material)
      return console.log(`Material "${tituloMaterial}" no existe.`);

    usuario.prestarMaterial(material);
  }

  gestionarDevolucion(idUsuario, tituloMaterial) {
    const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
    const material = this.buscarMaterial(tituloMaterial);

    if (!usuario) return console.log(`Usuario no encontrado.`);
    if (!material)
      return console.log(`Material "${tituloMaterial}" no existe.`);

    usuario.devolverMaterial(material);
  }
}

//***************************************************************
//***************************************************************
// CONEXIÓN CON EL DOM

//Inicialización de datos
const biblioteca = new Biblioteca();
const usuarioActual = new Usuario("Lau", 1);
biblioteca.registrarUsuario(usuarioActual);

//Materiales iniciales
biblioteca.agregarMaterial(
  new Libro("El Quijote", "Cervantes", 1605, true, 863)
);
biblioteca.agregarMaterial(new Libro("1984", "Orwell", 1949, true, 328));
biblioteca.agregarMaterial(
  new Revista("National Geographic", "Varios", 2023, false, 210)
);

// Libros adicionales
biblioteca.agregarMaterial(
  new Libro("Cien años de soledad", "Gabriel García Márquez", 1967, true, 496)
);
biblioteca.agregarMaterial(
  new Libro("Un mundo feliz", "Aldous Huxley", 1932, true, 256)
);
biblioteca.agregarMaterial(
  new Libro("Orgullo y prejuicio", "Jane Austen", 1813, false, 432)
);
biblioteca.agregarMaterial(
  new Libro("El Señor de los Anillos", "J. R. R. Tolkien", 1954, true, 1178)
);

//***************************************************************
//***************************************************************

//actualizar materiales (Los pintamos)
function actualizarMateriales() {
  //Almacenamos en una variable el elemento html con el que queremos trabajar
  const contenedor = document.getElementById("lista-materiales");
  contenedor.innerHTML = "";

  if (biblioteca.materiales.length === 0) {
    contenedor.innerHTML = "<p>No hay materiales registrados.</p>";
    return;
  }

  biblioteca.materiales.forEach((m) => {
    //Obtenemos el tipo de material y el estado
    const tipo = m.constructor.name;
    const estado = m.disponible ? "Disponible" : "Prestado";
    //Creamos un nuevo elemento <div> para representar visualmente el material
    const card = document.createElement("div");
    card.classList.add("material-card"); //Para darle estilo!!
    // Añadir una clase para el estado: 'disponible' o 'prestado' para dale estilo!
    const estadoClase = m.disponible
      ? "material-disponible"
      : "material-prestado";

    //A continuación insertamos dentro de este div la info que queremos que contenga
    //En el estado añadimos la class para pintarlo
    card.innerHTML = `
    <p><strong>${m.titulo}</strong> (${tipo})</p>
    <p>${m.autor} - ${m.anioPublicacion}</p>  
    <p><span class="${estadoClase}">${estado}</span></p> 
    `;
    //agregamos esa tarjeta al contenedor principal en el DOM
    contenedor.appendChild(card);
  });
}

//***************************************************************
//***************************************************************
//actualizar materiales prestados
function actualizarPrestados() {
  //Almacenamos en una variable el elemento html con el que queremos trabajar
  const contenedor = document.getElementById("lista-prestados");
  //agrego contenido
  if (usuarioActual.materialPrestado.length === 0) {
    // Si la lista de material prestado está vacía
    contenedor.innerHTML = "Ninguno";
  } else {
    // Si hay material prestado
    contenedor.innerHTML = usuarioActual.materialPrestado //MaterialPrestado era un array (recorro con map)
      .map((m) => `• ${m.titulo}`)
      .join("<br>");
  }
}

//***************************************************************
//***************************************************************
//Para ver el histrial de Registros
function agregarHistorial(mensaje) {
  //Almacenamos en una variable el elemento html con el que queremos trabajar
  const area = document.getElementById("area-registro");
  const p = document.createElement("p");
  p.textContent = mensaje;
  //Inserta la p dentro del area
  area.appendChild(p);
  //Para mantener el scroll!
  area.scrollTop = area.scrollHeight;
}

//***************************************************************
//***************************************************************
//Funciones DOM de préstamo y devolución

function gestionarPrestamo2() {
  //Almacenamos en una variable el elemento html con el que queremos trabajar
  const titulo = document.getElementById("titulo-accion").value.trim();
  if (!titulo) return;

  //buscamos sin el título coincide con algún material
  const material = biblioteca.buscarMaterial(titulo);
  if (!material) return agregarHistorial(`No existe el material "${titulo}".`);

  //extraemos si está o no disponible
  const antes = material.disponible;
  //cambiamos su disponibilidad con "gestionarPrestamo"
  biblioteca.gestionarPrestamo(usuarioActual.idUsuario, titulo);

  //Aseguramos que la disponibilidad cambió
  if (antes !== material.disponible) {
    agregarHistorial(`${usuarioActual.nombre} prestó "${titulo}".`); //agregamos al historial
    actualizarMateriales();
    actualizarPrestados();
  }
}

function gestionarDevolucion2() {
  //Almacenamos en una variable el elemento html con el que queremos trabajar
  const titulo = document.getElementById("titulo-accion").value.trim();
  if (!titulo) return;

  //buscamos sin el título coincide con algún material
  const material = biblioteca.buscarMaterial(titulo);
  if (!material) return agregarHistorial(`No existe el material "${titulo}".`);

  //extraemos si está o no disponible
  const antes = material.disponible;
  //cambiamos su disponibilidad con "gestionarDevolución"
  biblioteca.gestionarDevolucion(usuarioActual.idUsuario, titulo);

  //Aseguramos que la disponibilidad cambió
  if (antes !== material.disponible) {
    agregarHistorial(`${usuarioActual.nombre} devolvió "${titulo}".`); //agregamos al historial
    actualizarMateriales();
    actualizarPrestados();
  }
}

//***************************************************************
//***************************************************************
// EVENTO: Agregar nuevo libro
document
  //seleccionamos el div del formulario
  .getElementById("formulario-agregar-material")
  //cuando hagamos el submit
  .addEventListener("submit", (e) => {
    //Evitamos que el formulario recargue la página
    e.preventDefault();

    //Almacenar los valores que tienen los campos del formulario introducidos por el usuario
    const titulo = document.getElementById("agregar-titulo").value.trim();
    const autor = document.getElementById("agregar-autor").value.trim();
    const anio = parseInt(document.getElementById("agregar-anio").value);
    const disponibilidadString =
      document.getElementById("disponibilidad").value;

    //Validamos que todos los campos tengan valores
    if (!titulo || !autor || !anio || !disponibilidad) {
      agregarHistorial("Completa todos los campos.");
      return;
    }

    //Convertir el String del value del select a Booleano!!!!!
    const disponibleBooleano = disponibilidadString.toLowerCase() === "true";

    //Añadimos el material a la biblioteca
    biblioteca.agregarMaterial(
      new Libro(titulo, autor, anio, disponibleBooleano)
    );
    //Actualizamos el historial
    agregarHistorial(`Libro "${titulo}" agregado.`);
    //Pintamos el nuevo material por pantalla
    actualizarMateriales();
    //Vaciamos el formulario
    e.target.reset();
  });

//***************************************************************
//***************************************************************
// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
  //cargamos el usuario que tiene la sesion iniciada
  document.getElementById(
    "info-usuario-actual"
  ).textContent = `Sesión iniciada con: ${usuarioActual.nombre}`;
  //cargamos los materiales
  actualizarMateriales();
  //Cargamos los materiales presatados por el usuario actual
  actualizarPrestados();
});

/*
// === PRUEBAS DE LA CLASE BIBLIOTECA ===
console.log("=== INICIO DE PRUEBAS DE LA BIBLIOTECA ===");


// 1. Agregar materiales a la Biblioteca
console.log("\n--- 1. AGREGAR MATERIALES ---");
materialesIniciales.forEach((m) => miBiblioteca.agregarMaterial(m));

// 2. Registrar usuarios
console.log("\n--- 2. REGISTRAR USUARIOS ---");
miBiblioteca.registrarUsuario(ana);
miBiblioteca.registrarUsuario(carlos);
// Intento de registro con ID duplicado
miBiblioteca.registrarUsuario(new Usuario("Otro Ana", 101)); 

// 3. Listar todos los materiales (Estado inicial en la biblioteca)
miBiblioteca.listarMateriales(); 

// 4. Buscar Materiales
miBiblioteca.buscarMaterial("El Aleph"); // Búsqueda exitosa
miBiblioteca.buscarMaterial("cien años de soledad"); // Búsqueda con minúsculas
miBiblioteca.buscarMaterial("Material Inexistente"); // Búsqueda fallida

// 5. Gestión de Préstamos
console.log("\n--- 5. GESTIÓN DE PRÉSTAMOS ---");

// 5.1 Préstamo Exitoso (Ana toma una revista)
miBiblioteca.gestionarPrestamo(101, "National Geographic");

// 5.2 Préstamo de Material ya Prestado (Carlos intenta tomar "El Aleph")
miBiblioteca.gestionarPrestamo(102, "El Aleph");

// 5.3 Préstamo de material disponible (Carlos toma un video)
miBiblioteca.gestionarPrestamo(102, "Fundamentos de JavaScript");

// 5.4 Préstamo fallido por usuario no registrado
miBiblioteca.gestionarPrestamo(999, "Viaje al Sol");

// 5.5 Préstamo fallido por material inexistente
miBiblioteca.gestionarPrestamo(101, "El Quijote");

// 6. Mostrar Historial de Préstamos por Usuario
ana.mostrarHistorial();
carlos.mostrarHistorial();

// 7. Gestión de Devoluciones
console.log("\n--- 7. GESTIÓN DE DEVOLUCIONES ---");

// 7.1 Devolución exitosa (Ana devuelve National Geographic)
miBiblioteca.gestionarDevolucion(101, "National Geographic");

// 7.2 Devolución fallida (Ana intenta devolver algo que no tiene)
miBiblioteca.gestionarDevolucion(101, "Cien Años de Soledad");

// 7.3 Devolución fallida (Carlos intenta devolver un material que no existe)
miBiblioteca.gestionarDevolucion(102, "No existe");

// 8. Mostrar Historial de Ana después de la devolución
ana.mostrarHistorial();

// 9. Listar el estado final de la Biblioteca
miBiblioteca.listarMateriales(); 

// 10. Probar métodos específicos de clases derivadas
const miLibro = materialesIniciales[0];
const miVideo = materialesIniciales[5];
const miRivista = materialesIniciales[1];
miLibro.resumen();
miVideo.reproducir();
miRivista.mostrarEdicion();
*/
