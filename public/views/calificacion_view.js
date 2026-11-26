const RESULTADOS = [
    { valor: 'aprobado', etiqueta: 'Aprobado' },
    { valor: 'no_aprobado', etiqueta: 'No aprobado' },
];

const resultado = valor => RESULTADOS.find(opcion => opcion.valor === valor)?.etiqueta ?? '';

export const calificacionVista = {
    nombre: 'Calificaciones', singular: 'calificación', articulo: 'la', icono: 'clipboard-check', descripcion: 'Resultados académicos',
    campos: [
        { nombre: 'matriculaId', etiqueta: 'Matrícula', fija: true },
        { nombre: 'resultado', etiqueta: 'Resultado', opciones: RESULTADOS },
        { nombre: 'observacion', etiqueta: 'Observación', opcional: true, multilinea: true },
    ],
    etiqueta: (registro, catalogos, describir) => describir('matriculas', registro.matriculaId, catalogos),
    columnas: [
        ['Matrícula', (registro, catalogos, describir) => describir('matriculas', registro.matriculaId, catalogos)],
        ['Resultado', registro => resultado(registro.resultado)],
    ],
};
