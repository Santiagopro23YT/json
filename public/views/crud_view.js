import { elemento, icono } from '../utils/dom.js';

function boton(accion, texto, archivo, estilo = '') {
    const control = elemento('button', `button ${estilo}`.trim());
    control.type = 'button';
    control.dataset.accion = accion;
    if (archivo) control.append(icono(archivo, 18));
    control.append(texto);
    return control;
}

export class CrudView {
    constructor(contenedor, modulo, referencias, presentacion) {
        this.modulo = modulo;
        this.referencias = referencias;
        this.presentacion = presentacion;
        this.contenedor = contenedor;
    }

    conectar(controlador, signal) {
        this.contenedor.addEventListener('click', evento => {
            const control = evento.target.closest('button[data-accion]');
            if (control) controlador.actuar(control.dataset.accion, control.dataset.id);
        }, { signal });
        this.contenedor.addEventListener('submit', evento => {
            evento.preventDefault();
            controlador.guardar(Object.fromEntries(new FormData(evento.target)));
        }, { signal });
    }

    accionRegistrar() {
        return boton('nuevo', `Registrar ${this.modulo.singular}`, 'plus', 'button-primary');
    }

    estructura(titulo, descripcion, accion, enfocar = true) {
        const encabezado = elemento('div', 'section-header');
        const texto = elemento('div');
        const nombre = elemento('h1', '', titulo);
        nombre.tabIndex = -1;
        texto.append(nombre, elemento('p', 'description', descripcion));
        encabezado.append(texto);
        if (accion) encabezado.append(accion);

        this.aviso = elemento('div', 'notice');
        this.aviso.hidden = true;
        this.panel = elemento('div', 'panel');
        this.contenedor.replaceChildren(encabezado, this.aviso, this.panel);
        if (enfocar) nombre.focus();
    }

    mensaje(texto, error = false) {
        this.aviso.hidden = !texto;
        this.aviso.classList.toggle('notice-error', error);
        this.aviso.setAttribute('role', error ? 'alert' : 'status');
        this.aviso.textContent = texto;
    }

    estado(texto, reintento, error = false) {
        const caja = elemento('div', 'panel-message');
        const parrafo = elemento('p', '', texto);
        parrafo.setAttribute('role', error ? 'alert' : 'status');
        caja.append(parrafo);
        if (reintento) caja.append(boton(reintento, 'Reintentar'));
        this.panel.replaceChildren(caja);
    }

    listado(registros, catalogos) {
        if (registros.length === 0) {
            this.estado(`Aún no hay ${this.modulo.nombre.toLowerCase()} ${this.modulo.articulo === 'la' ? 'registradas' : 'registrados'}.`);
            return;
        }

        const tabla = elemento('table');
        tabla.setAttribute('role', 'table');
        tabla.setAttribute('aria-label', this.modulo.nombre);
        const cabecera = tabla.createTHead();
        cabecera.setAttribute('role', 'rowgroup');
        const encabezado = cabecera.insertRow();
        encabezado.setAttribute('role', 'row');
        for (const etiqueta of [...this.modulo.columnas.map(([titulo]) => titulo), 'Acciones']) {
            const columna = elemento('th', '', etiqueta);
            columna.scope = 'col';
            columna.setAttribute('role', 'columnheader');
            encabezado.append(columna);
        }
        const cuerpo = tabla.createTBody();
        cuerpo.setAttribute('role', 'rowgroup');

        for (const registro of registros) {
            const fila = cuerpo.insertRow();
            fila.setAttribute('role', 'row');
            const nombre = this.modulo.etiqueta(registro, catalogos, this.presentacion.describir);
            for (const [, obtenerValor] of this.modulo.columnas) {
                fila.insertCell().textContent = obtenerValor(registro, catalogos, this.presentacion.describir) ?? '';
            }
            const acciones = elemento('div', 'actions');
            for (const [accion, texto, archivo, estilo] of [
                ['consultar', 'Ver', 'eye'],
                ['editar', 'Editar', 'pencil'],
                ['confirmar', 'Eliminar', 'trash-2', 'button-danger'],
            ]) {
                const control = boton(accion, texto, archivo, estilo);
                control.dataset.id = String(registro.id);
                control.setAttribute('aria-label', `${texto} a ${nombre}`);
                acciones.append(control);
            }
            fila.insertCell().append(acciones);
            for (const celda of fila.cells) celda.setAttribute('role', 'cell');
        }

        const desplazable = elemento('div', 'table-wrap');
        desplazable.append(tabla);
        this.panel.replaceChildren(desplazable);
    }

    formulario(datos, configuracion, errorCatalogo) {
        const formulario = elemento('form', 'panel-content');
        formulario.noValidate = true;
        const campos = elemento('div', 'fields');

        for (const campo of configuracion) {
            const { nombre, etiqueta, opciones, multilinea, opcional, numerico, sinOrtografia, deshabilitada } = campo;
            const grupo = elemento('div', this.referencias[nombre] || multilinea ? 'field field-wide' : 'field');
            const label = elemento('label', '', etiqueta);
            label.htmlFor = nombre;
            const control = elemento(opciones ? 'select' : multilinea ? 'textarea' : 'input');
            control.id = nombre;
            control.name = nombre;
            control.required = !opcional;
            control.disabled = Boolean(deshabilitada);

            if (opciones) {
                control.add(new Option('Selecciona una opción', ''));
                for (const opcion of opciones) control.add(new Option(opcion.etiqueta, opcion.valor));
            } else if (multilinea) {
                control.rows = 3;
            } else {
                control.type = 'text';
                if (numerico) control.inputMode = 'numeric';
                if (sinOrtografia) control.spellcheck = false;
            }

            control.value = datos[nombre] ?? '';
            const error = elemento('span', 'field-error');
            error.id = `error-${nombre}`;
            error.hidden = true;
            grupo.append(label, control, error);
            campos.append(grupo);
        }

        this.guardarBoton = boton('', `Guardar ${this.modulo.singular}`, 'save', 'button-primary');
        delete this.guardarBoton.dataset.accion;
        this.guardarBoton.type = 'submit';
        this.guardarBoton.disabled = Boolean(errorCatalogo);
        const acciones = elemento('div', 'form-actions');
        acciones.append(this.guardarBoton, boton('listar', 'Cancelar'));
        if (errorCatalogo) acciones.append(boton('reintentar-catalogo', this.modulo.recargarCatalogo ?? 'Recargar opciones'));
        formulario.append(campos, acciones);
        this.panel.replaceChildren(formulario);
    }

    valoresFormulario() {
        return Object.fromEntries(new FormData(this.panel.querySelector('form')));
    }

    bloquearGuardado(bloquear) {
        this.guardarBoton.disabled = bloquear;
    }

    bloquearEliminacion(bloquear) {
        this.eliminarBoton.disabled = bloquear;
    }

    erroresCampos(errores) {
        let primero;
        for (const { nombre } of this.modulo.campos) {
            const control = this.panel.querySelector(`#${nombre}`);
            const error = this.panel.querySelector(`#error-${nombre}`);
            const mensaje = errores[nombre];
            error.hidden = !mensaje;
            error.textContent = mensaje ?? '';
            if (mensaje) {
                control.setAttribute('aria-invalid', 'true');
                control.setAttribute('aria-describedby', error.id);
                primero ??= control;
            } else {
                control.removeAttribute('aria-invalid');
                control.removeAttribute('aria-describedby');
            }
        }
        primero?.focus();
    }

    detalle(registro, catalogos) {
        const contenido = elemento('div', 'panel-content');
        const datos = elemento('dl', 'detail-list');
        for (const { nombre, etiqueta, opciones } of this.modulo.campos) {
            const grupo = elemento('div');
            const coleccion = this.referencias[nombre];
            const valor = coleccion
                ? this.presentacion.describir(coleccion, registro[nombre], catalogos)
                : opciones?.find(opcion => opcion.valor === registro[nombre])?.etiqueta ?? registro[nombre];
            grupo.append(elemento('dt', '', etiqueta), elemento('dd', '', valor || 'Sin datos'));
            datos.append(grupo);
        }
        const acciones = elemento('div', 'form-actions');
        const editar = boton('editar', `Editar ${this.modulo.singular}`, 'pencil', 'button-primary');
        editar.dataset.id = String(registro.id);
        acciones.append(editar, boton('listar', 'Volver al listado', 'arrow-left'));
        contenido.append(datos, acciones);
        this.panel.replaceChildren(contenido);
    }

    confirmacion(registro, catalogos) {
        const contenido = elemento('div', 'panel-content');
        const acciones = elemento('div', 'form-actions');
        this.eliminarBoton = boton('eliminar', 'Confirmar eliminación', 'trash-2', 'button-danger');
        this.eliminarBoton.dataset.id = String(registro.id);
        acciones.append(boton('listar', 'Cancelar'), this.eliminarBoton);
        contenido.append(
            elemento('p', '', `¿Eliminar ${this.modulo.articulo} ${this.modulo.singular} «${this.modulo.etiqueta(registro, catalogos, this.presentacion.describir)}»?`),
            acciones,
        );
        this.panel.replaceChildren(contenido);
    }
}
