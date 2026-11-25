import { solicitar } from '../services/json_server.js';

export function mismoId(a, b) {
    return a != null && b != null && String(a) === String(b);
}

function normalizar(valor) {
    return String(valor ?? '').trim().toUpperCase();
}

function ruta(coleccion, id) {
    return id == null ? `/${coleccion}` : `/${coleccion}/${encodeURIComponent(id)}`;
}

export async function impedirSiHayRelacion(api, coleccion, campo, id, mensaje) {
    const registros = await api(ruta(coleccion));
    if (registros.some(registro => mismoId(registro[campo], id))) throw new Error(mensaje);
}

function serializarEscritura(operacion) {
    // Las comprobaciones y escrituras comparten el bloqueo entre pestañas del mismo origen.
    return globalThis.navigator?.locks
        ? navigator.locks.request('gestion-academica-escritura', operacion)
        : operacion();
}

export class AcademicoModel {
    constructor(coleccion, entidades, api = solicitar) {
        this.coleccion = coleccion;
        this.entidades = entidades;
        this.reglas = entidades[coleccion];
        this.referencias = this.reglas.referencias ?? {};
        this.api = api;
    }

    listar() {
        return this.api(ruta(this.coleccion));
    }

    consultar(id) {
        return this.api(ruta(this.coleccion, id), 'GET', undefined, 'El registro ya no está disponible.');
    }

    async catalogos() {
        const pendientes = new Set();

        const agregar = coleccion => {
            if (pendientes.has(coleccion)) return;
            pendientes.add(coleccion);
            for (const referencia of Object.values(this.entidades[coleccion].referencias ?? {})) agregar(referencia);
        };

        for (const referencia of Object.values(this.referencias)) agregar(referencia);
        const entradas = await Promise.all([...pendientes].map(async coleccion => {
            const registros = await this.api(ruta(coleccion));
            return [coleccion, new Map(registros.map(registro => [String(registro.id), registro]))];
        }));
        return Object.fromEntries(entradas);
    }

    async verificarReferencias(registro, referencias, cache = new Map()) {
        const entradas = await Promise.all(Object.entries(referencias).map(async ([campo, coleccion]) => {
            const id = registro[campo];
            const entidad = this.entidades[coleccion];
            const mensaje = entidad.mensajeReferencia ?? `La referencia a ${entidad.singular} ya no está disponible.`;
            if (id == null || id === '') throw new Error(mensaje);
            const path = ruta(coleccion, id);
            if (!cache.has(path)) {
                cache.set(path, this.api(path, 'GET', undefined, mensaje));
            }
            const relacionado = await cache.get(path);
            await this.verificarReferencias(relacionado, entidad.referencias ?? {}, cache);
            return [campo, relacionado];
        }));
        return Object.fromEntries(entradas);
    }

    guardar(datos, id) {
        return serializarEscritura(async () => {
            const anterior = id == null ? undefined : await this.consultar(id);
            const referencias = await this.verificarReferencias(datos, this.referencias);
            await this.reglas.validar?.({ datos, anterior, referencias, api: this.api });

            const { unico, duplicado } = this.reglas;
            if (unico) {
                const registros = await this.listar();
                const repetido = registros.some(registro =>
                    !mismoId(registro.id, id) && unico.every(campo =>
                        this.referencias[campo]
                            ? mismoId(registro[campo], datos[campo])
                            : normalizar(registro[campo]) === normalizar(datos[campo])
                    )
                );
                if (repetido) throw new Error(duplicado);
            }

            return this.api(ruta(this.coleccion, id), id == null ? 'POST' : 'PATCH', datos, 'El registro ya no está disponible.');
        });
    }

    eliminar(id) {
        return serializarEscritura(async () => {
            for (const [coleccion, campo, mensaje] of this.reglas.dependencias ?? []) {
                await impedirSiHayRelacion(this.api, coleccion, campo, id, mensaje);
            }
            await this.api(ruta(this.coleccion, id), 'DELETE', undefined, 'El registro ya no está disponible.');
        });
    }
}
