const API_URL = 'http://localhost:3000';

const entidades = {
    programas: {
        unico: ['codigo'],
        duplicado: 'Ya existe un programa con este código.',
        dependencias: [['fichas', 'programaId', 'El programa tiene fichas asociadas.']],
    },
    fichas: {
        referencias: { programaId: 'programas' },
        unico: ['numero'],
        duplicado: 'Ya existe una ficha con este número.',
        dependencias: [
            ['aprendices', 'fichaId', 'La ficha tiene aprendices asociados.'],
            ['cursos', 'fichaId', 'La ficha tiene cursos asociados.'],
        ],
    },
    aprendices: {
        referencias: { fichaId: 'fichas' },
        unico: ['tipoDocumento', 'numeroDocumento'],
        duplicado: 'Ya existe un aprendiz con este tipo y número de documento.',
        dependencias: [['matriculas', 'aprendizId', 'No se puede eliminar el aprendiz porque tiene una matrícula asociada.']],
        async validar({ datos, anterior, api }) {
            if (anterior && !mismoId(datos.fichaId, anterior.fichaId)) {
                await impedirSiHayRelacion(api, 'matriculas', 'aprendizId', anterior.id,
                    'No se puede cambiar la ficha del aprendiz porque tiene una matrícula asociada.');
            }
        },
    },
    instructores: {
        unico: ['tipoDocumento', 'numeroDocumento'],
        duplicado: 'Ya existe un instructor con este tipo y número de documento.',
        dependencias: [['cursos', 'instructorId', 'El instructor está asignado a un curso.']],
    },
    cursos: {
        referencias: { fichaId: 'fichas', instructorId: 'instructores' },
        dependencias: [['matriculas', 'cursoId', 'El curso tiene matrículas asociadas.']],
        async validar({ datos, anterior, api }) {
            if (anterior && !mismoId(datos.fichaId, anterior.fichaId)) {
                await impedirSiHayRelacion(api, 'matriculas', 'cursoId', anterior.id,
                    'No se puede cambiar la ficha del curso porque tiene matrículas asociadas.');
            }
        },
    },
    matriculas: {
        referencias: { aprendizId: 'aprendices', cursoId: 'cursos' },
        unico: ['aprendizId', 'cursoId'],
        duplicado: 'El aprendiz ya está matriculado en este curso.',
        dependencias: [['calificaciones', 'matriculaId', 'La matrícula tiene una calificación asociada.']],
        async validar({ datos, anterior, referencias, api }) {
            const { aprendizId: aprendiz, cursoId: curso } = referencias;
            if (!mismoId(aprendiz.fichaId, curso.fichaId)) {
                throw new Error('El aprendiz y el curso deben pertenecer a la misma ficha.');
            }
            if (anterior && (!mismoId(datos.aprendizId, anterior.aprendizId) || !mismoId(datos.cursoId, anterior.cursoId))) {
                await impedirSiHayRelacion(api, 'calificaciones', 'matriculaId', anterior.id,
                    'No se puede reasignar la matrícula porque ya tiene una calificación.');
            }
        },
    },
    calificaciones: {
        referencias: { matriculaId: 'matriculas' },
        unico: ['matriculaId'],
        duplicado: 'Esta matrícula ya tiene una calificación.',
        validar({ datos, anterior }) {
            if (anterior && !mismoId(anterior.matriculaId, datos.matriculaId)) {
                throw new Error('La matrícula de una calificación no se puede cambiar.');
            }
        },
    },
};

export const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'Pasaporte'];
export const RESULTADOS = [
    { valor: 'aprobado', etiqueta: 'Aprobado' },
    { valor: 'no_aprobado', etiqueta: 'No aprobado' },
];

function mismoId(a, b) {
    return a != null && b != null && String(a) === String(b);
}

function normalizar(valor) {
    return String(valor ?? '').trim().toUpperCase();
}

function ruta(coleccion, id) {
    return id == null ? `/${coleccion}` : `/${coleccion}/${encodeURIComponent(id)}`;
}

async function solicitar(path, metodo = 'GET', datos, noEncontrado) {
    let respuesta;
    try {
        respuesta = await fetch(API_URL + path, {
            method: metodo,
            signal: AbortSignal.timeout(5000),
            ...(datos === undefined ? {} : {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            }),
        });
    } catch {
        throw new Error('No se pudo conectar con JSON Server en el puerto 3000.');
    }
    if (respuesta.status === 404 && noEncontrado) throw new Error(noEncontrado);
    if (!respuesta.ok) throw new Error('El servicio de datos no pudo completar la operación.');
    if (metodo === 'DELETE') return;
    try {
        return await respuesta.json();
    } catch {
        throw new Error('El servicio de datos devolvió una respuesta inválida.');
    }
}

async function impedirSiHayRelacion(api, coleccion, campo, id, mensaje) {
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
    constructor(coleccion, api = solicitar) {
        this.coleccion = coleccion;
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

        function agregar(coleccion) {
            if (pendientes.has(coleccion)) return;
            pendientes.add(coleccion);
            for (const referencia of Object.values(entidades[coleccion].referencias ?? {})) agregar(referencia);
        }

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
            const nombre = { programaId: 'programa', fichaId: 'ficha', instructorId: 'instructor', aprendizId: 'aprendiz', cursoId: 'curso', matriculaId: 'matrícula' }[campo];
            const mensaje = campo === 'fichaId'
                ? 'La ficha seleccionada ya no está disponible.'
                : `La referencia a ${nombre} ya no está disponible.`;
            if (id == null || id === '') throw new Error(mensaje);
            const path = ruta(coleccion, id);
            if (!cache.has(path)) {
                cache.set(path, this.api(path, 'GET', undefined, mensaje));
            }
            const relacionado = await cache.get(path);
            await this.verificarReferencias(relacionado, entidades[coleccion].referencias ?? {}, cache);
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
