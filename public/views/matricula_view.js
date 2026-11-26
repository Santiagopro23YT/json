export const matriculaVista = {
    nombre: 'Matrículas', singular: 'matrícula', articulo: 'la', icono: 'user-round', descripcion: 'Inscripciones a cursos',
    campos: [
        { nombre: 'aprendizId', etiqueta: 'Aprendiz' },
        { nombre: 'cursoId', etiqueta: 'Curso' },
    ],
    etiqueta: (registro, catalogos, describir) => `${describir('aprendices', registro.aprendizId, catalogos)} — ${describir('cursos', registro.cursoId, catalogos)}`,
    columnas: [
        ['Aprendiz', (registro, catalogos, describir) => describir('aprendices', registro.aprendizId, catalogos)],
        ['Curso', (registro, catalogos, describir) => describir('cursos', registro.cursoId, catalogos)],
    ],
};
