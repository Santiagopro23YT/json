import { NOMBRE_SISTEMA } from './config/aplicacion.js';
import { modulos } from './config/modulos.js';
import { mostrarDashboard } from './views/dashboard_view.js';
import { NavegacionView } from './views/navegacion_view.js';
import { crearPresentacion } from './views/presentacion.js';

const contenido = document.querySelector('#contenido');
const entidades = Object.fromEntries(modulos.map(({ id, reglas }) => [id, reglas]));
const vistas = Object.fromEntries(modulos.map(({ id, vista }) => [id, vista]));
const presentacion = crearPresentacion(vistas);

const seccionesModulo = modulos.map(({ id, vista, montar }) => ({
    id,
    nombre: vista.nombre,
    icono: vista.icono,
    descripcion: vista.descripcion,
    renderizar: signal => montar(contenido, signal, entidades, presentacion),
}));
const inicio = {
    id: 'inicio',
    nombre: 'Inicio',
    icono: 'house',
    renderizar: () => mostrarDashboard(contenido, seccionesModulo),
};
const secciones = [inicio, ...seccionesModulo];
const navegacion = new NavegacionView(document, contenido, secciones);

let seccionActiva;
let ciclo;

function navegar() {
    const destino = location.hash.slice(1) || inicio.id;
    const seccion = secciones.find(({ id }) => id === destino) ?? inicio;
    if (seccionActiva === seccion) return;

    const huboSeccion = Boolean(seccionActiva);
    ciclo?.abort();
    ciclo = new AbortController();
    seccionActiva = seccion;
    document.title = `${seccion.nombre} | ${NOMBRE_SISTEMA}`;
    navegacion.activar(seccion);
    seccion.renderizar(ciclo.signal);
    if (huboSeccion) contenido.focus();
}

window.addEventListener('hashchange', navegar);
navegar();
