export function crearPresentacion(vistas) {
    function describir(coleccion, id, catalogos) {
        const registro = catalogos[coleccion]?.get(String(id));
        return registro ? vistas[coleccion].etiqueta(registro, catalogos, describir) : 'Referencia no disponible';
    }

    function opcionesRelacion(coleccion, catalogos) {
        const vista = vistas[coleccion];
        const registros = [...(catalogos[coleccion]?.values() ?? [])];
        return registros
            .filter(registro => vista.seleccionable?.(registro, catalogos) ?? true)
            .map(registro => {
                const etiqueta = describir(coleccion, registro.id, catalogos);
                return {
                    valor: String(registro.id),
                    etiqueta: vista.opcion?.(registro, etiqueta, catalogos, describir) ?? etiqueta,
                };
            });
    }

    return { describir, opcionesRelacion, nombre: coleccion => vistas[coleccion].nombre };
}
