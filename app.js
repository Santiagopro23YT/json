import { CrudController } from './controllers/crud_controller.js';
import { AcademicoModel } from './models/academico_model.js';
import { CrudView } from './views/crud_view.js';
import { modulos } from './views/modulos.js';
import { elemento, icono } from './views/dom.js';

const nombreSistema = 'Sistema de gestión académica';
const secciones = [
    { id: 'inicio', nombre: 'Inicio', icono: 'house', renderizar: mostrarInicio },
    ...Object.entries(modulos).map(([id, modulo]) => ({
        id, ...modulo,
        renderizar(signal) {
            const modelo = new AcademicoModel(id);
            new CrudController(modelo, new CrudView(contenido, modulo, modelo.referencias), signal);
        },
    })),
];

const contenido = document.querySelector('#contenido');
const navegacion = document.querySelector('#navegacion');
const menu = document.querySelector('#menu-lateral');
const botonMenu = document.querySelector('#alternar-menu');
const fondoMenu = document.querySelector('.backdrop');
const pantallaEstrecha = matchMedia('(max-width: 760px)');
const tituloSeccion = document.querySelector('#seccion-actual');
let seccionActiva;
let ciclo;
let menuMovilAbierto = false;
let menuEscritorioVisible = true;

const enlaces = new Map(secciones.map(seccion => {
    const enlace = elemento('a', 'nav-link');
    enlace.href = `#${seccion.id}`;
    enlace.append(icono(seccion.icono), seccion.nombre);
    navegacion.append(enlace);
    return [seccion.id, enlace];
}));

function mostrarInicio() {
    const portada = elemento('section', 'welcome');
    portada.append(
        elemento('h1', '', nombreSistema),
        elemento('p', 'description', 'Bienvenido. Selecciona un módulo para consultar y gestionar la información académica.'),
    );

    const modulos = elemento('section');
    const titulo = elemento('h2', '', 'Módulos del sistema');
    titulo.id = 'titulo-modulos';
    modulos.setAttribute('aria-labelledby', titulo.id);
    const tarjetas = elemento('div', 'dashboard-grid');
    for (const seccion of secciones.slice(1)) {
        const tarjeta = elemento('a', 'module-card');
        tarjeta.href = `#${seccion.id}`;
        const imagen = elemento('span', 'card-icon');
        imagen.append(icono(seccion.icono, 24));
        const texto = elemento('span');
        texto.append(
            elemento('span', 'card-title', seccion.nombre),
            elemento('span', 'card-description', seccion.descripcion),
        );
        tarjeta.append(imagen, texto);
        tarjetas.append(tarjeta);
    }
    modulos.append(titulo, tarjetas);
    contenido.replaceChildren(portada, modulos);
}

function actualizarMenu() {
    const movil = pantallaEstrecha.matches;
    const visible = movil ? menuMovilAbierto : menuEscritorioVisible;
    menu.hidden = !visible;
    fondoMenu.hidden = !(movil && visible);
    contenido.inert = movil && visible;
    document.body.classList.toggle('menu-open', movil && visible);
    botonMenu.setAttribute('aria-expanded', String(visible));
    botonMenu.setAttribute('aria-label', visible ? 'Contraer menú' : 'Abrir menú');
}

function cerrarMenuMovil(devolverFoco = false) {
    if (!menuMovilAbierto) return;
    menuMovilAbierto = false;
    actualizarMenu();
    if (devolverFoco) botonMenu.focus();
}

function navegar() {
    const destino = location.hash.slice(1) || 'inicio';
    const seccion = secciones.find(({ id }) => id === destino) ?? secciones[0];
    if (seccionActiva?.id === seccion.id) return;

    const huboSeccion = Boolean(seccionActiva);
    ciclo?.abort();
    ciclo = new AbortController();
    seccionActiva = seccion;
    for (const [id, enlace] of enlaces) {
        if (id === seccion.id) enlace.setAttribute('aria-current', 'page');
        else enlace.removeAttribute('aria-current');
    }
    tituloSeccion.textContent = seccion.nombre;
    document.title = `${seccion.nombre} | ${nombreSistema}`;
    cerrarMenuMovil();
    seccion.renderizar(ciclo.signal);
    if (huboSeccion) contenido.focus();
}

botonMenu.addEventListener('click', () => {
    if (pantallaEstrecha.matches) {
        menuMovilAbierto = !menuMovilAbierto;
        actualizarMenu();
        if (menuMovilAbierto) enlaces.get(seccionActiva.id).focus();
    } else {
        menuEscritorioVisible = !menuEscritorioVisible;
        actualizarMenu();
    }
});

menu.addEventListener('click', evento => {
    const enlace = evento.target.closest('a');
    if (enlace && menuMovilAbierto && enlace.hash === `#${seccionActiva.id}`) {
        cerrarMenuMovil();
        contenido.focus();
    }
});
fondoMenu.addEventListener('click', () => cerrarMenuMovil(true));
document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') cerrarMenuMovil(true);
});
pantallaEstrecha.addEventListener('change', () => {
    menuMovilAbierto = false;
    const focoEnMenu = menu.contains(document.activeElement);
    actualizarMenu();
    if (menu.hidden && focoEnMenu) botonMenu.focus();
});
document.querySelector('.skip-link').addEventListener('click', evento => {
    evento.preventDefault();
    cerrarMenuMovil();
    contenido.focus();
});
window.addEventListener('hashchange', navegar);
actualizarMenu();
navegar();
