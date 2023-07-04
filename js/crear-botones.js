// Ruta del archivo XML
const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const year = String(currentDate.getFullYear()).slice(-2);

const xmlFilePath = `xml/reportv_${year}${month}${day}.xml`;

//La siguiente ruta se utiliza para leer el archivo xml y crear los botones de forma dinamica.
const xmlCategoryPath = "paginas/grilla-category.xml";

// Función para convertir una cadena de fecha y hora en un objeto Date en GMT-3
const parseDateTime = (dateTimeString) => {
  const [year, month, day, hours, minutes, seconds] = [
    dateTimeString.slice(0, 4),
    dateTimeString.slice(4, 6),
    dateTimeString.slice(6, 8),
    Number(dateTimeString.slice(8, 10)) - 3,
    dateTimeString.slice(10, 12),
    dateTimeString.slice(12, 14)
  ];

  const date = new Date();
  date.setFullYear(Number(year));
  date.setMonth(Number(month) - 1);
  date.setDate(Number(day));
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  date.setSeconds(Number(seconds));

  return date;
};

// Función para formatear una fecha y hora en formato legible
const formatDateTime = (dateTime) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
  return dateTime.toLocaleDateString("es-ES", options);
};

// Función para obtener la fecha actual en formato YYYYMMDD
const getTodayDate = () => {
  const today = new Date();
  today.setHours(today.getHours() - 3); // Restar 3 horas para ajustar a GMT-3
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const showProgramacion = (channelId, channelName) => {
  fetch(xmlFilePath)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");

      const programmes = Array.from(xml.querySelectorAll(`programme[channel="${channelId}"]`))
        .filter(program => program.getAttribute("start").startsWith(getTodayDate()));

      const table = document.createElement("table");
      table.classList.add("table");

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      const programHeader = document.createElement("th");
      programHeader.textContent = "Programa";
      programHeader.classList.add("first-column");
      headerRow.appendChild(programHeader);

      const descriptionHeader = document.createElement("th");
      descriptionHeader.textContent = "Descripción";
      headerRow.appendChild(descriptionHeader);

      thead.appendChild(headerRow);
      table.appendChild(thead);

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

        const createRow = (label, value) => {
          const row = document.createElement("tr");

          const labelCell = document.createElement("td");
          labelCell.textContent = label;
          row.appendChild(labelCell);

          const valueCell = document.createElement("td");
          valueCell.textContent = formatDateTime(value);
          row.appendChild(valueCell);

          tbody.appendChild(row);
        };

        createRow("Inicio", start);
        createRow("Fin", stop);

        const lineRow = document.createElement("tr");
        lineRow.classList.add("line-row");

        const lineCell = document.createElement("td");
        lineCell.setAttribute("colspan", "2");
        lineCell.classList.add("line-cell");

        lineRow.appendChild(lineCell);

        tbody.appendChild(lineRow);
      });

      table.appendChild(tbody);

      const imageUrl = `asets/img/${channelId}.jpg`;

      const channelImage = new Image();
      channelImage.src = imageUrl;
      channelImage.style.width = "50px";
      channelImage.style.height = "50px";
      channelImage.style.marginRight = "10px";
      channelImage.style.objectFit = "contain";

      // Obtener la fecha actual
      const currentDate = new Date();
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      const formatter = new Intl.DateTimeFormat('es-ES', options);
      const formattedDate = formatter.format(currentDate);

      // Convertir la primera letra del día de la semana y del mes en mayúsculas
      const formattedDateCapitalized = formattedDate.replace(/^\w/, c => c.toUpperCase());

      Swal.fire({
        title: `<div style="display: flex; align-items: center;"><img src="${imageUrl}" style="width: 100px; height: 100px; margin-right: 10px; object-fit: contain;"><h3><strong>${channelName}</strong></h3></div>`,
        html: `<div style="text-align: left;"><strong>${formattedDateCapitalized}</strong></div>` + table.outerHTML, // Agregar el texto de fecha debajo del título y alinearlo a la izquierda
        showConfirmButton: true,
        width: '80%',
        didRender: () => {
          // Ajustar el ancho de la primera columna (ya no es necesario aquí, se maneja con CSS)
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar el archivo XML:", error);
    });
};

const tvChannelsDiv = document.getElementById("tvChannels");
const buttons = [];

const createButton = (channelId, channelName, category) => {
  const button = document.createElement("button");
  button.setAttribute("id", `channel_${channelId}`);
  button.setAttribute("data-category", category);

  const contentContainer = document.createElement("div");
  contentContainer.style.display = "flex";
  contentContainer.style.flexDirection = "column";
  contentContainer.style.alignItems = "center";

  const channelImage = new Image();
  channelImage.src = `asets/img/${channelId}.jpg`;
  channelImage.style.width = "100px";
  channelImage.style.height = "100px";
  channelImage.style.objectFit = "contain";

  const channelTitle = document.createElement("div");
  channelTitle.textContent = channelName;

  const channelCategory = document.createElement("div");
  channelCategory.textContent = category;
  channelCategory.classList.add("channel-category");

  contentContainer.appendChild(channelTitle);
  contentContainer.appendChild(channelImage);
  contentContainer.appendChild(channelCategory);

  button.appendChild(contentContainer);

  button.classList.add("boton-cuadrado");
  button.style.margin = "10px";

  button.addEventListener("click", () => {
    if (category !== "Adultos") {
      showProgramacion(channelId, channelName);
    }
  });

  buttons.push(button);
};

fetch(xmlCategoryPath)
  .then(response => response.text())
  .then(xmlString => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const channels = xmlDoc.getElementsByTagName("channel");

    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      const channelId = channel.getAttribute("id");
      const channelName = channel.getElementsByTagName("channel-name")[0].textContent;
      const category = channel.getElementsByTagName("category-name")[0].textContent;

      createButton(channelId, channelName, category);
    }

    buttons.sort((a, b) => {
      const nameA = a.getElementsByTagName("div")[0].textContent.toLowerCase();
      const nameB = b.getElementsByTagName("div")[0].textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    buttons.forEach(button => {
      tvChannelsDiv.appendChild(button);
    });
  })
  .catch(error => {
    console.error("Error al leer el archivo XML:", error);
  });
