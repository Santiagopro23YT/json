import { RESULTADOS, TIPOS_DOCUMENTO } from '../models/academico_model.js';

const seleccionDocumento = TIPOS_DOCUMENTO.map(tipo => ({ valor: tipo, etiqueta: tipo }));
const identificacion = [
    { nombre: 'tipoDocumento', etiqueta: 'Tipo de documento', opciones: seleccionDocumento },
    { nombre: 'numeroDocumento', etiqueta: 'Número de documento', mayusculas: true, sinOrtografia: true },
    { nombre: 'nombres', etiqueta: 'Nombres' },
    { nombre: 'apellidos', etiqueta: 'Apellidos' },
];
const nombrePersona = ({ nombres, apellidos }) => [nombres, apellidos].filter(Boolean).join(' ');
const documento = ({ tipoDocumento, numeroDocumento }) => [tipoDocumento, numeroDocumento].filter(Boolean).join(' ');
const resultado = valor => RESULTADOS.find(opcion => opcion.valor === valor)?.etiqueta ?? '';

export const modulos = {
    programas: {
        nombre: 'Programas', singular: 'programa', articulo: 'el', icono: 'graduation-cap', descripcion: 'Programas de formación',
        campos: [
            { nombre: 'codigo', etiqueta: 'Código', mayusculas: true, sinOrtografia: true },
            { nombre: 'nombre', etiqueta: 'Nombre' },
        ],
        etiqueta: registro => registro.nombre,
        columnas: [['Programa', registro => registro.nombre], ['Código', registro => registro.codigo]],
    },
    fichas: {
        nombre: 'Fichas', singular: 'ficha', articulo: 'la', icono: 'clipboard-list', descripcion: 'Fichas de formación',
        campos: [
            { nombre: 'numero', etiqueta: 'Número de ficha', numerico: true },
            { nombre: 'programaId', etiqueta: 'Programa de formación' },
        ],
        etiqueta: (registro, catalogos) => `${registro.numero} — ${describir('programas', registro.programaId, catalogos)}`,
        columnas: [['Ficha', registro => registro.numero], ['Programa', (registro, catalogos) => describir('programas', registro.programaId, catalogos)]],
    },
    aprendices: {
        nombre: 'Aprendices', singular: 'aprendiz', articulo: 'el', icono: 'users-round', descripcion: 'Registros de aprendices y fichas',
        campos: [...identificacion, { nombre: 'fichaId', etiqueta: 'Ficha de formación' }],
        etiqueta: nombrePersona,
        columnas: [
            ['Aprendiz', nombrePersona], ['Documento', documento],
            ['Ficha de formación', (registro, catalogos) => describir('fichas', registro.fichaId, catalogos)],
        ],
        catalogoVacio: 'No hay fichas de formación disponibles para seleccionar. Registra una en Fichas.',
        recargarCatalogo: 'Recargar fichas',
    },
    instructores: {
        nombre: 'Instructores', singular: 'instructor', articulo: 'el', icono: 'presentation', descripcion: 'Equipo de formación',
        campos: identificacion,
        etiqueta: nombrePersona,
        columnas: [['Instructor', nombrePersona], ['Documento', documento]],
    },
    cursos: {
        nombre: 'Cursos', singular: 'curso', articulo: 'el', icono: 'book-open', descripcion: 'Oferta de cursos',
        campos: [
            { nombre: 'nombre', etiqueta: 'Nombre del curso' },
            { nombre: 'fichaId', etiqueta: 'Ficha de formación' },
            { nombre: 'instructorId', etiqueta: 'Instructor' },
        ],
        etiqueta: registro => registro.nombre,
        columnas: [
            ['Curso', registro => registro.nombre],
            ['Ficha', (registro, catalogos) => describir('fichas', registro.fichaId, catalogos)],
            ['Instructor', (registro, catalogos) => describir('instructores', registro.instructorId, catalogos)],
        ],
    },
    matriculas: {
        nombre: 'Matrículas', singular: 'matrícula', articulo: 'la', icono: 'user-round', descripcion: 'Inscripciones a cursos',
        campos: [
            { nombre: 'aprendizId', etiqueta: 'Aprendiz' },
            { nombre: 'cursoId', etiqueta: 'Curso' },
        ],
        etiqueta: (registro, catalogos) => `${describir('aprendices', registro.aprendizId, catalogos)} — ${describir('cursos', registro.cursoId, catalogos)}`,
        columnas: [
            ['Aprendiz', (registro, catalogos) => describir('aprendices', registro.aprendizId, catalogos)],
            ['Curso', (registro, catalogos) => describir('cursos', registro.cursoId, catalogos)],
        ],
    },
    calificaciones: {
        nombre: 'Calificaciones', singular: 'calificación', articulo: 'la', icono: 'clipboard-check', descripcion: 'Resultados académicos',
        campos: [
            { nombre: 'matriculaId', etiqueta: 'Matrícula', fija: true },
            { nombre: 'resultado', etiqueta: 'Resultado', opciones: RESULTADOS },
            { nombre: 'observacion', etiqueta: 'Observación', opcional: true, multilinea: true },
        ],
        etiqueta: (registro, catalogos) => describir('matriculas', registro.matriculaId, catalogos),
        columnas: [
            ['Matrícula', (registro, catalogos) => describir('matriculas', registro.matriculaId, catalogos)],
            ['Resultado', registro => resultado(registro.resultado)],
        ],
    },
};

export function describir(coleccion, id, catalogos) {
    const registro = catalogos[coleccion]?.get(String(id));
    return registro ? modulos[coleccion].etiqueta(registro, catalogos) : 'Referencia no disponible';
}

export function opcionesRelacion(coleccion, catalogos) {
    const registros = [...(catalogos[coleccion]?.values() ?? [])];
    return registros
        .filter(registro => coleccion !== 'fichas' || catalogos.programas.has(String(registro.programaId)))
        .map(registro => {
            let etiqueta = describir(coleccion, registro.id, catalogos);
            if (coleccion === 'programas' && registro.codigo) {
                etiqueta = `${registro.codigo} — ${etiqueta}`;
            } else if (coleccion === 'instructores') {
                etiqueta += ` · ${documento(registro)}`;
            } else if (coleccion === 'cursos' && catalogos.fichas) {
                etiqueta += ` · ${describir('fichas', registro.fichaId, catalogos)}`;
            } else if (coleccion === 'aprendices' && catalogos.fichas) {
                etiqueta += ` · ${documento(registro)} · ${describir('fichas', registro.fichaId, catalogos)}`;
            }
            return { valor: String(registro.id), etiqueta };
        });
}
