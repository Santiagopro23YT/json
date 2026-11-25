import { opcionesRelacion, modulos } from '../views/modulos.js';

export class CrudController {
    constructor(modelo, vista, signal) {
        this.modelo = modelo;
        this.vista = vista;
        this.signal = signal;
        this.modulo = vista.modulo;
        this.ocupado = true;
        this.vista.conectar(this, signal);
        this.listar('', false).finally(() => { this.ocupado = false; });
    }

    get activo() {
        return !this.signal.aborted;
    }

    async actuar(accion, id) {
        if (this.ocupado || !this.activo) return;
        this.ocupado = true;
        try {
            switch (accion) {
                case 'listar': await this.listar(); break;
                case 'nuevo': await this.abrirFormulario(); break;
                case 'reintentar-catalogo':
                    await this.abrirFormulario(this.edicion?.id, this.vista.valoresFormulario());
                    break;
                case 'editar': await this.abrirFormulario(id); break;
                case 'consultar': await this.consultar(id); break;
                case 'confirmar': await this.confirmar(id); break;
                case 'eliminar': await this.eliminar(id); break;
            }
        } finally {
            this.ocupado = false;
        }
    }

    async listar(mensaje = '', enfocar = true) {
        const { nombre, descripcion } = this.modulo;
        const nuevo = this.vista.accionRegistrar();
        nuevo.disabled = true;
        this.vista.estructura(nombre, descripcion, nuevo, enfocar);
        this.vista.mensaje(mensaje);
        this.vista.estado('Cargando registros…');
        try {
            const [registros, catalogos] = await Promise.all([this.modelo.listar(), this.modelo.catalogos()]);
            if (this.activo) this.vista.listado(registros, catalogos);
        } catch (error) {
            if (this.activo) this.vista.estado(error.message, 'listar', true);
        } finally {
            nuevo.disabled = false;
        }
    }

    async abrirFormulario(id, valores) {
        const { singular, campos, catalogoVacio } = this.modulo;
        this.vista.estructura(`${id ? 'Editar' : 'Registrar'} ${singular}`, 'Completa la información del registro.');
        this.vista.estado('Cargando formulario…');

        if (!valores) {
            try {
                this.edicion = id ? await this.modelo.consultar(id) : undefined;
            } catch (error) {
                if (this.activo) this.vista.estado(error.message, 'listar', true);
                return;
            }
        }

        const datos = { ...this.edicion, ...valores };
        let catalogos = {};
        let errorCatalogo;
        try {
            catalogos = await this.modelo.catalogos();
        } catch (error) {
            errorCatalogo = error.message;
        }
        if (!this.activo) return;

        const camposFormulario = campos.map(campo => {
            const coleccion = this.modelo.referencias[campo.nombre];
            if (!coleccion) return campo;
            const opciones = opcionesRelacion(coleccion, catalogos);
            const fija = Boolean(id && campo.fija);
            if (opciones.length === 0) {
                errorCatalogo ??= catalogoVacio ?? `Faltan registros en ${modulos[coleccion].nombre}. Agrégalos para continuar.`;
            } else if (fija && !opciones.some(opcion => opcion.valor === String(datos[campo.nombre]))) {
                errorCatalogo ??= 'La referencia guardada ya no está disponible.';
            }
            return { ...campo, opciones, fija, deshabilitada: opciones.length === 0 || fija };
        });
        const seleccionInvalida = camposFormulario.some(campo =>
            campo.opciones && datos[campo.nombre] &&
            !campo.opciones.some(opcion => opcion.valor === String(datos[campo.nombre]))
        );

        this.camposFormulario = camposFormulario;
        this.catalogoDisponible = !errorCatalogo;
        this.vista.formulario(datos, camposFormulario, errorCatalogo);
        if (errorCatalogo) this.vista.mensaje(errorCatalogo, true);
        else if (seleccionInvalida) this.vista.mensaje('La opción anterior ya no está disponible. Selecciona otra.', true);
    }

    async guardar(valores) {
        if (this.ocupado || !this.activo || !this.catalogoDisponible) return;

        const datos = {};
        const errores = {};
        for (const campo of this.camposFormulario) {
            const { nombre, etiqueta, opciones, opcional, numerico, fija, mayusculas } = campo;
            let valor = String((fija ? this.edicion?.[nombre] : valores[nombre]) ?? '').trim();
            if (mayusculas) valor = valor.toUpperCase();
            datos[nombre] = valor;

            if (opciones && !opciones.some(opcion => opcion.valor === valor)) {
                errores[nombre] = `Selecciona ${etiqueta.toLowerCase()}.`;
            } else if (!valor && !opcional) {
                errores[nombre] = etiqueta === 'Número de documento' ? 'Ingresa el número de documento.' : 'Completa este campo.';
            } else if (numerico && !/^\d+$/.test(valor)) {
                errores[nombre] = 'Ingresa un número de ficha con solo dígitos.';
            }
        }

        this.vista.mensaje('');
        this.vista.erroresCampos(errores);
        if (Object.keys(errores).length) return;

        this.ocupado = true;
        this.vista.bloquearGuardado(true);
        try {
            await this.modelo.guardar(datos, this.edicion?.id);
            if (this.activo) await this.listar(this.mensajeExito(this.edicion ? 'actualizado' : 'registrado'));
        } catch (error) {
            if (this.activo) this.vista.mensaje(error.message, true);
        } finally {
            this.vista.bloquearGuardado(false);
            this.ocupado = false;
        }
    }

    mensajeExito(accion) {
        const { singular, articulo } = this.modulo;
        const nombre = singular[0].toUpperCase() + singular.slice(1);
        return `${nombre} ${articulo === 'la' ? accion.slice(0, -1) + 'a' : accion}.`;
    }

    async consultar(id) {
        const { singular, articulo } = this.modulo;
        this.vista.estructura(`Detalle ${articulo === 'la' ? 'de la' : 'del'} ${singular}`, 'Información del registro.');
        this.vista.estado('Cargando datos…');
        try {
            const [registro, catalogos] = await Promise.all([this.modelo.consultar(id), this.modelo.catalogos()]);
            if (this.activo) this.vista.detalle(registro, catalogos);
        } catch (error) {
            if (this.activo) this.vista.estado(error.message, 'listar', true);
        }
    }

    async confirmar(id) {
        this.vista.estructura(`Eliminar ${this.modulo.singular}`, 'Confirma la acción antes de eliminar el registro.');
        this.vista.estado('Cargando datos…');
        try {
            const [registro, catalogos] = await Promise.all([this.modelo.consultar(id), this.modelo.catalogos()]);
            if (this.activo) this.vista.confirmacion(registro, catalogos);
        } catch (error) {
            if (this.activo) this.vista.estado(error.message, 'listar', true);
        }
    }

    async eliminar(id) {
        this.vista.bloquearEliminacion(true);
        this.vista.mensaje('');
        try {
            await this.modelo.eliminar(id);
            if (this.activo) await this.listar(this.mensajeExito('eliminado'));
        } catch (error) {
            if (this.activo) this.vista.mensaje(error.message, true);
        } finally {
            this.vista.bloquearEliminacion(false);
        }
    }
}
