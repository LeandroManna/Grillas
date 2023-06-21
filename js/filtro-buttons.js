// Obtener todos los botones de filtro
const filterButtons = document.querySelectorAll("#filter button");

// Función para filtrar los botones por categoría
function filterButtonsByCategory(category) {
  const buttons = document.querySelectorAll("#tvChannels button");

  buttons.forEach(button => {
    const buttonCategory = button.getAttribute("data-category");
  
    // Mostrar u ocultar el botón según la categoría seleccionada
    if (category === "todos" || buttonCategory === category) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });
}

// Agregar el evento de clic a cada botón de filtro
filterButtons.forEach(button => {
  button.addEventListener("click", function () {
    const category = this.getAttribute("id");
    filterButtonsByCategory(category);
  });
});

// Agregar evento de clic al botón "Mostrar todos"
const showAllButton = document.getElementById("todos");
showAllButton.addEventListener("click", function () {
  location.reload();
});

// Obtener el elemento del título del filtro
const tituloFiltro = document.getElementById('titulo-filtro');
    
// Obtener todos los botones de filtro
const botonesFiltro = document.querySelectorAll('#filter button');

// Agregar un controlador de eventos a cada botón de filtro
botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', (event) => {
    // Obtener el nombre del filtro del botón
    const filtro = event.target.getAttribute('data-filter');

    // Actualizar el contenido del elemento del título del filtro
    tituloFiltro.textContent = filtro;
  });
});