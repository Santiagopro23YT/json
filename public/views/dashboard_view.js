import { NOMBRE_SISTEMA } from '../config/aplicacion.js';
import { elemento, icono } from '../utils/dom.js';

export function mostrarDashboard(contenido, secciones) {
    const portada = elemento('section', 'welcome');
    portada.append(
        elemento('h1', '', NOMBRE_SISTEMA),
        elemento('p', 'description', 'Bienvenido. Selecciona un módulo para consultar y gestionar la información académica.'),
    );

    const modulos = elemento('section');
    const titulo = elemento('h2', '', 'Módulos del sistema');
    titulo.id = 'titulo-modulos';
    modulos.setAttribute('aria-labelledby', titulo.id);
    const tarjetas = elemento('div', 'dashboard-grid');
    for (const seccion of secciones) {
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
