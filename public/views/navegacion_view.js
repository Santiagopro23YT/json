import { elemento, icono } from '../utils/dom.js';

export class NavegacionView {
    constructor(documento, contenido, secciones) {
        this.documento = documento;
        this.contenido = contenido;
        this.menu = documento.querySelector('#menu-lateral');
        this.botonMenu = documento.querySelector('#alternar-menu');
        this.fondo = documento.querySelector('.backdrop');
        this.titulo = documento.querySelector('#seccion-actual');
        this.pantallaEstrecha = matchMedia('(max-width: 760px)');
        this.menuMovilAbierto = false;
        this.menuEscritorioVisible = true;

        const navegacion = documento.querySelector('#navegacion');
        this.enlaces = new Map(secciones.map(seccion => {
            const enlace = elemento('a', 'nav-link');
            enlace.href = `#${seccion.id}`;
            enlace.append(icono(seccion.icono), seccion.nombre);
            navegacion.append(enlace);
            return [seccion.id, enlace];
        }));

        this.conectar();
        this.actualizarMenu();
    }

    activar({ id, nombre }) {
        this.activa = id;
        for (const [destino, enlace] of this.enlaces) {
            if (destino === id) enlace.setAttribute('aria-current', 'page');
            else enlace.removeAttribute('aria-current');
        }
        this.titulo.textContent = nombre;
        this.cerrarMenuMovil();
    }

    actualizarMenu() {
        const movil = this.pantallaEstrecha.matches;
        const visible = movil ? this.menuMovilAbierto : this.menuEscritorioVisible;
        this.menu.hidden = !visible;
        this.fondo.hidden = !(movil && visible);
        this.contenido.inert = movil && visible;
        this.documento.body.classList.toggle('menu-open', movil && visible);
        this.botonMenu.setAttribute('aria-expanded', String(visible));
        this.botonMenu.setAttribute('aria-label', visible ? 'Contraer menú' : 'Abrir menú');
    }

    cerrarMenuMovil(devolverFoco = false) {
        if (!this.menuMovilAbierto) return;
        this.menuMovilAbierto = false;
        this.actualizarMenu();
        if (devolverFoco) this.botonMenu.focus();
    }

    conectar() {
        this.botonMenu.addEventListener('click', () => {
            if (this.pantallaEstrecha.matches) {
                this.menuMovilAbierto = !this.menuMovilAbierto;
                this.actualizarMenu();
                if (this.menuMovilAbierto) this.enlaces.get(this.activa).focus();
            } else {
                this.menuEscritorioVisible = !this.menuEscritorioVisible;
                this.actualizarMenu();
            }
        });

        this.menu.addEventListener('click', evento => {
            const enlace = evento.target.closest('a');
            if (enlace && this.menuMovilAbierto && enlace.hash === `#${this.activa}`) {
                this.cerrarMenuMovil();
                this.contenido.focus();
            }
        });
        this.fondo.addEventListener('click', () => this.cerrarMenuMovil(true));
        this.documento.addEventListener('keydown', evento => {
            if (evento.key === 'Escape') this.cerrarMenuMovil(true);
        });
        this.pantallaEstrecha.addEventListener('change', () => {
            this.menuMovilAbierto = false;
            const focoEnMenu = this.menu.contains(this.documento.activeElement);
            this.actualizarMenu();
            if (this.menu.hidden && focoEnMenu) this.botonMenu.focus();
        });
        this.documento.querySelector('.skip-link').addEventListener('click', evento => {
            evento.preventDefault();
            this.cerrarMenuMovil();
            this.contenido.focus();
        });
    }
}
