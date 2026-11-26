# Instalación y ejecución

## Requisitos

- Node.js **22.12.0 o superior**, según la versión de JSON Server fijada en el
  archivo de bloqueo.
- npm y un navegador compatible con módulos JavaScript.

Comprueba las versiones con `node --version` y `npm --version`.

## Instalación inicial

Desde la raíz del repositorio, instala las dependencias y arranca el servidor:

```text
cd server
npm ci
npm start
```

Abre `http://localhost:3000/`. En los siguientes arranques basta con ejecutar
`npm start` desde `server/`. Mantén abierta la terminal mientras uses el
aplicativo y pulsa `Ctrl+C` para detenerlo. JSON Server sirve la interfaz y la
API en el mismo puerto.

## Primer registro

Con una base vacía, crea un **programa** y una **ficha** asociada. Registra un
aprendiz en esa ficha y crea un instructor. Después crea un curso para la misma
ficha, asígnale el instructor, matricula al aprendiz y registra la calificación.

Para consultar las dependencias entre registros, revisa la
[descripción de la arquitectura](ARCHITECTURE.md).

## Solución de problemas

| Síntoma | Qué revisar |
|---|---|
| La terminal indica que `node` o `npm` no se reconoce | Comprueba la instalación de Node.js, abre una nueva terminal y verifica las versiones. |
| `npm start` no encuentra el manifiesto o el script | Ejecuta el comando desde `server/`, donde está [`package.json`](../server/package.json). |
| No se encuentra el comando `json-server` | Ejecuta `npm ci` desde `server/` antes de iniciar el aplicativo. |
| El puerto 3000 está ocupado | Si el aplicativo ya está funcionando, usa la instancia existente. Si el puerto lo ocupa otro proceso, ciérralo antes de volver a iniciar. |
| La interfaz se abrió como archivo local | Abre `http://localhost:3000/` con el servidor en ejecución. Los módulos y la API se cargan por HTTP. |
| El selector de fichas aparece vacío | Registra primero un programa y una ficha asociada. |

Para comprobar el arranque, abre el Dashboard y entra a un módulo. Si la base
está vacía, el listado correspondiente mostrará su estado vacío.
