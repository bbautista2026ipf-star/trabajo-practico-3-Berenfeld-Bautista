const API_BASE = "https://thesimpsonsapi.com/api/characters";
const CDN_BASE = "https://thesimpsonsapi.com/api/characters/1";

let personajes = [];

const $contenedor = document.getElementById("contenedorTarjetas");
const $mensaje = document.getElementById("mensaje");

async function obtenerListado() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.results ?? [];
  } catch (err) {
    console.error("Error al obtener listado:", err);
    $mensaje.textContent = "No se pudo cargar el listado de personajes.";
    return [];
  }
}

function renderTarjetas(lista) {
  $contenedor.innerHTML = "";
  if (!lista.length) {
    $mensaje.textContent = "No se encontraron personajes.";
    return;
  }
  $mensaje.textContent = "";
  lista.forEach((p) => {
    const img = `${CDN_BASE}${p.portrait_path}`;
    const estado = p.status === "Alive" ? "success" : "secondary";
    $contenedor.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          <img src="${img}" class="card-img-top" alt="${p.name}" onerror="this.src='https://via.placeholder.com/500?text=Sin+imagen'" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text small mb-1"><strong>Ocupación:</strong> ${p.occupation ?? "—"}</p>
            <span class="badge bg-${estado} mb-3 align-self-start">${p.status ?? "—"}</span>
            <button class="btn btn-warning mt-auto btnVerDetalle" data-id="${p.id}">Ver detalle</button>
          </div>
        </div>
      </div>
    `,
    );
  });
}

async function init() {
  personajes = await obtenerListado();
  renderTarjetas(personajes);
}

document.addEventListener("DOMContentLoaded", init);

function filtrarPersonajes(texto) {
  const q = texto.trim().toLowerCase();
  if (!q) {
    $mensaje.textContent = "Ingresá un nombre para buscar.";
    return;
  }
  const filtrados = personajes.filter((p) => p.name.toLowerCase().includes(q));
  renderTarjetas(filtrados);
}

function limpiarResultados() {
  document.getElementById("inputBuscador").value = "";
  $mensaje.textContent = "";
  renderTarjetas(personajes);
}

document.getElementById("btnBuscar").addEventListener("click", () => {
  filtrarPersonajes(document.getElementById("inputBuscador").value);
});

document.getElementById("inputBuscador").addEventListener("keyup", (e) => {
  if (e.key === "Enter") filtrarPersonajes(e.target.value);
});

document
  .getElementById("btnLimpiar")
  .addEventListener("click", limpiarResultados);
