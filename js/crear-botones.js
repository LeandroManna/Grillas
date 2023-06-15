// Ruta del archivo XML
const xmlFilePath = "xml/grilla.xml";
const xmlCategoryPath = "xml/grilla-category.xml";

// Función para convertir una cadena de fecha y hora en un objeto Date en GMT-3
function parseDateTime(dateTimeString) {
  const year = dateTimeString.slice(0, 4);
  const month = dateTimeString.slice(4, 6);
  const day = dateTimeString.slice(6, 8);
  const hours = Number(dateTimeString.slice(8, 10) - 3);
  const minutes = dateTimeString.slice(10, 12);
  const seconds = dateTimeString.slice(12, 14);

  const date = new Date();
  date.setFullYear(Number(year));
  date.setMonth(Number(month) - 1);
  date.setDate(Number(day));
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  date.setSeconds(Number(seconds));

  return date;
}
// Función para formatear una fecha y hora en formato legible
function formatDateTime(dateTime) {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
  return dateTime.toLocaleDateString("es-ES", options);
}
// Función para obtener la fecha actual en formato YYYYMMDD
function getTodayDate() {
  const today = new Date();
  today.setHours(today.getHours() - 3); // Restar 3 horas para ajustar a GMT-3
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}


function showProgramacion(channelId, channelName) {
  fetch(xmlFilePath)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");

      const programmes = Array.from(xml.querySelectorAll(`programme[channel="${channelId}"]`))
        .filter(program => program.getAttribute("start").startsWith(getTodayDate()));

      // Crear la tabla de programación
      const table = document.createElement("table");
      table.classList.add("table");

      // Crear el encabezado de la tabla
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      // Crear celda para el programa
      const programHeader = document.createElement("th");
      programHeader.textContent = "Programa";
      programHeader.classList.add("first-column"); // Agregar clase CSS para la primera columna
      headerRow.appendChild(programHeader);

      // Crear celda para la descripción
      const descriptionHeader = document.createElement("th");
      descriptionHeader.textContent = "Descripción";
      headerRow.appendChild(descriptionHeader);

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Crear el cuerpo de la tabla
      const tbody = document.createElement("tbody");
      programmes.forEach(program => {
        const title = program.querySelector("title").textContent;
        const description = program.querySelector("desc").textContent;
        const start = parseDateTime(program.getAttribute("start"));
        const stop = parseDateTime(program.getAttribute("stop"));

        const programRow = document.createElement("tr");

        const programCell = document.createElement("td");
        programCell.textContent = title;
        programRow.appendChild(programCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = description;
        programRow.appendChild(descriptionCell);

        tbody.appendChild(programRow);

        // Crear fila para el inicio del programa
        const startRow = document.createElement("tr");

        const startLabelCell = document.createElement("td");
        startLabelCell.textContent = "Inicio";
        startRow.appendChild(startLabelCell);

        const startValueCell = document.createElement("td");
        startValueCell.textContent = formatDateTime(start);
        startRow.appendChild(startValueCell);

        tbody.appendChild(startRow);

        // Crear fila para el fin del programa
        const stopRow = document.createElement("tr");

        const stopLabelCell = document.createElement("td");
        stopLabelCell.textContent = "Fin";
        stopRow.appendChild(stopLabelCell);

        const stopValueCell = document.createElement("td");
        stopValueCell.textContent = formatDateTime(stop);
        stopRow.appendChild(stopValueCell);

        tbody.appendChild(stopRow);

        // Crear fila adicional con línea más gruesa después del fin del programa
        const lineRow = document.createElement("tr");
        lineRow.classList.add("line-row");

        const lineCell = document.createElement("td");
        lineCell.setAttribute("colspan", "2");
        lineCell.classList.add("line-cell");

        lineRow.appendChild(lineCell);

        tbody.appendChild(lineRow);
      });

      table.appendChild(tbody);

      // Obtener la URL de la imagen del canal
      const imageUrl = `asets/img/${channelId}.jpg`; // Ajusta la ruta según la ubicación de las imágenes descargadas

      // Crear imagen del canal
      const channelImage = new Image();
      channelImage.src = imageUrl;
      channelImage.style.width = "50px";
      channelImage.style.height = "50px";
      channelImage.style.marginRight = "10px";

      // Mostrar SweetAlert con la tabla de programación y la imagen del canal
      Swal.fire({
        title: `<div style="display: flex; align-items: center;"><img src="${imageUrl}" style="width: 100px; height: 100px; margin-right: 10px;"><h3><strong>${channelName}</strong></h3></div>`,
        html: table.outerHTML,
        showConfirmButton: true,
        width: '90%', // Ancho personalizado para el SweetAlert
        didRender: () => {
          // Ajustar el ancho de la primera columna (ya no es necesario aquí, se maneja con CSS)
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar el archivo XML:", error);
    });
}

// Obtener el div contenedor de los botones
const tvChannelsDiv = document.getElementById("tvChannels");

// Array para almacenar los botones
const buttons = [];

// Función para crear y agregar los botones
function createButton(channelId, channelName, category) {
  // Crear el botón
  const button = document.createElement("button");
  button.setAttribute("id", `channel_${channelId}`);
  button.setAttribute("data-category", category); // Agregar el atributo data-category

  // Crear el contenedor para el título y la imagen
  const contentContainer = document.createElement("div");
  contentContainer.style.display = "flex";
  contentContainer.style.flexDirection = "column";
  contentContainer.style.alignItems = "center";

  // Crear la imagen del canal
  const channelImage = new Image();
  channelImage.src = `asets/img/${channelId}.jpg`; // Ajusta la ruta según la ubicación de las imágenes descargadas
  channelImage.style.width = "100px";
  channelImage.style.height = "100px";
  channelImage.style.objectFit = "contain"; // Ajusta la imagen para que cubra completamente el contenedor sin deformarse

  // Crear el título del canal
  const channelTitle = document.createElement("div");
  channelTitle.textContent = channelName;

  // Crear la categoría del canal
  const channelCategory = document.createElement("div");
  channelCategory.textContent = category;
  channelCategory.classList.add("channel-category"); // Agregar clase CSS para la categoría

  // Agregar el título y la imagen al contenedor
  contentContainer.appendChild(channelTitle);
  contentContainer.appendChild(channelImage);
  contentContainer.appendChild(channelCategory);

  // Agregar el contenedor al botón
  button.appendChild(contentContainer);

  // Agregar la clase para el estilo cuadrado
  button.classList.add("boton-cuadrado");

  // Agregar margen al botón
  button.style.margin = "10px";

  // Agregar el evento de clic al botón
  button.addEventListener("click", function () {
    if (category !== "Adultos") {
      showProgramacion(channelId, channelName);
    }
  });

  // Agregar el botón al array
  buttons.push(button);
}

// Leer el archivo XML utilizando fetch
fetch(xmlCategoryPath)
  .then(response => response.text())
  .then(xmlString => {
    // Convertir el XML en un objeto Document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Obtener todos los canales del XML
    const channels = xmlDoc.getElementsByTagName("channel");

    // Crear y agregar los botones para cada canal
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      const channelId = channel.getAttribute("id");
      const channelName = channel.getElementsByTagName("channel-name")[0].textContent;
      const category = channel.getElementsByTagName("category-name")[0].textContent;

      // Crear y agregar el botón al array
      createButton(channelId, channelName, category);
    }

    // Ordenar el array de botones por nombre
    buttons.sort(function(a, b) {
      const nameA = a.getElementsByTagName("div")[0].textContent.toLowerCase();
      const nameB = b.getElementsByTagName("div")[0].textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Agregar los botones ordenados al div contenedor
    buttons.forEach(function(button) {
      tvChannelsDiv.appendChild(button);
    });
  })
  .catch(error => {
    console.error("Error al leer el archivo XML:", error);
  });

  
