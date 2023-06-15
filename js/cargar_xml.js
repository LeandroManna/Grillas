document.addEventListener("DOMContentLoaded", function () {
  fetch("xml/grilla.xml")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");

      const programmes = xml.querySelectorAll("programme");

      // Objeto para almacenar los programas agrupados por canal
      const programmesByChannel = {};

      programmes.forEach(programme => {
        const channel = programme.getAttribute("channel"); // Obtener el valor del atributo "channel"

        // Verificar si el canal ya existe en el objeto
        if (!programmesByChannel[channel]) {
          programmesByChannel[channel] = [];
        }

        // Almacenar el programa en el canal correspondiente
        programmesByChannel[channel].push(programme);
      });

      const table = document.querySelector("#grilla-canales");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Crear fila de encabezados
      const headerRow = document.createElement("tr");

      // Crear celda para el nombre de canal
      const channelNameHeader = document.createElement("th");
      channelNameHeader.textContent = "Nombre de canal";
      headerRow.appendChild(channelNameHeader);

      // Crear celda para el programa
      const programHeader = document.createElement("th");
      programHeader.textContent = "Programa";
      headerRow.appendChild(programHeader);

      // Crear celda para la descripción
      const descriptionHeader = document.createElement("th");
      descriptionHeader.textContent = "Descripción";
      headerRow.appendChild(descriptionHeader);

      // Crear celda para el inicio del programa
      const startHeader = document.createElement("th");
      startHeader.textContent = "Inicio del programa";
      headerRow.appendChild(startHeader);

      // Crear celda para el fin del programa
      const stopHeader = document.createElement("th");
      stopHeader.textContent = "Fin del programa";
      headerRow.appendChild(stopHeader);

      // Agregar fila de encabezados al thead
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const channels = xml.querySelectorAll("channel");

      // Variables para el control de carga dinámica de canales
      let loadedChannels = 0;
      const channelsPerLoad = 1;

      // Función para cargar canales adicionales
      function loadChannels() {
        const remainingChannels = Array.from(channels).slice(loadedChannels, loadedChannels + channelsPerLoad);
        remainingChannels.forEach(channel => {
          const channelId = channel.getAttribute("id");

          const channelName = xml.querySelector(`channel[id="${channelId}"] channel-name`).textContent;
          const programs = programmesByChannel[channelId];

          // Crear fila para el número y nombre de canal
          const channelRow = document.createElement("tr");

          // Crear celda para el nombre de canal
          const channelNameCell = document.createElement("td");
          channelNameCell.textContent = channelName;
          channelRow.appendChild(channelNameCell);

          // Agregar fila de número y nombre de canal al tbody
          tbody.appendChild(channelRow);

          // Iterar sobre los programas del canal actual
          programs.forEach(program => {
            const title = program.querySelector("title").textContent;
            const description = program.querySelector("desc").textContent;
            const start = parseDateTime(program.getAttribute("start"));
            const stop = parseDateTime(program.getAttribute("stop"));

            // Crear fila para el programa, descripción, inicio y fin del programa
            const programRow = document.createElement("tr");

            // Crear celda vacía para número de canal y nombre de canal
            const emptyCell1 = document.createElement("td");
            emptyCell1.setAttribute("colspan", "1");
            programRow.appendChild(emptyCell1);

            // Crear celda para el programa
            const programCell = document.createElement("td");
            programCell.textContent = title;
            programRow.appendChild(programCell);

            // Crear celda para la descripción
            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = description;
            programRow.appendChild(descriptionCell);

            // Crear celda para el inicio del programa
            const startCell = document.createElement("td");
            startCell.textContent = formatDateTime(start);
            programRow.appendChild(startCell);

            // Crear celda para el fin del programa
            const stopCell = document.createElement("td");
            stopCell.textContent = formatDateTime(stop);
            programRow.appendChild(stopCell);

            // Agregar fila de programa, descripción, inicio y fin del programa al tbody
            tbody.appendChild(programRow);
          });
        });

        // Actualizar el contador de canales cargados
        loadedChannels += remainingChannels.length;

        // Verificar si quedan más canales por cargar
        if (loadedChannels < channels.length) {
          // Mostrar el botón de carga adicional
          loadMoreButton.style.display = "block";
        } else {
          // Ocultar el botón de carga adicional
          loadMoreButton.style.display = "none";
        }

        // Mover el botón debajo de la tabla
        table.insertAdjacentElement("afterend", loadMoreButton);
      }

      // Crear el botón de carga adicional
      const loadMoreButton = document.createElement("button");
      loadMoreButton.textContent = "Cargar más canales";
      loadMoreButton.classList.add("btn", "btn-primary", "my-3");
      loadMoreButton.style.display = "none";
      loadMoreButton.style.margin = "0 auto";
      loadMoreButton.style.display = "block";
      loadMoreButton.style.marginTop = "20px";
      loadMoreButton.style.marginBottom = "20px";
      loadMoreButton.addEventListener("click", loadChannels);

      // Agregar el tbody a la tabla
      table.appendChild(tbody);

      // Cargar los primeros canales
      loadChannels();
    })
    .catch(error => {
      console.error("Error al cargar el archivo XML:", error);
    });
});

// Función para convertir una cadena de fecha y hora en un objeto Date
function parseDateTime(dateTimeString) {
  const year = dateTimeString.slice(0, 4);
  const month = dateTimeString.slice(4, 6);
  const day = dateTimeString.slice(6, 8);
  const hours = dateTimeString.slice(8, 10);
  const minutes = dateTimeString.slice(10, 12);
  const seconds = dateTimeString.slice(12, 14);

  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
}

// Función para formatear una fecha y hora en formato legible
function formatDateTime(dateTime) {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
  return dateTime.toLocaleDateString("es-ES", options);
}
