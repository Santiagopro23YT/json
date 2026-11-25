export const cursoVista = {
    nombre: 'Cursos', singular: 'curso', articulo: 'el', icono: 'book-open', descripcion: 'Oferta de cursos',
    campos: [
        { nombre: 'nombre', etiqueta: 'Nombre del curso' },
        { nombre: 'fichaId', etiqueta: 'Ficha de formación' },
        { nombre: 'instructorId', etiqueta: 'Instructor' },
    ],
    etiqueta: registro => registro.nombre,
    columnas: [
        ['Curso', registro => registro.nombre],
        ['Ficha', (registro, catalogos, describir) => describir('fichas', registro.fichaId, catalogos)],
        ['Instructor', (registro, catalogos, describir) => describir('instructores', registro.instructorId, catalogos)],
    ],
    opcion(registro, etiqueta, catalogos, describir) {
        return catalogos.fichas
            ? etiqueta + ' · ' + describir('fichas', registro.fichaId, catalogos)
            : etiqueta;
    },
};
