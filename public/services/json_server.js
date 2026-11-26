import { API_URL } from '../config/aplicacion.js';

export async function solicitar(path, metodo = 'GET', datos, noEncontrado) {
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
