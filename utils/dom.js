export function elemento(etiqueta, clase = '', texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
}

export function icono(archivo, tamano = 20) {
    const imagen = elemento('img');
    imagen.src = `./assets/icons/${archivo}.png`;
    imagen.width = tamano;
    imagen.height = tamano;
    imagen.alt = '';
    return imagen;
}
