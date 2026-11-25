# Mini proyecto Json
## Introduccion:
Aplicativo académico con JavaScript nativo, MVC y JSON Server.
## Desarrollado:
- Nombre: Samuel Santiago Ramirez Fierro
- Programa: Analisis y Desarrollo de Software
- Ficha: 3407799
## Ejecutar el aplicativo

Requiere Node.js 22.12.0 o superior y npm. Desde la raíz del proyecto, ejecuta:

```powershell
cd server
npm ci
npm start
```

Ejecuta `npm ci` al instalar las dependencias por primera vez. Para iniciar el
aplicativo después, usa `npm start` desde `server/`.

Abre [el aplicativo](http://localhost:3000/). JSON Server sirve la interfaz de
`public/` y la API REST en el mismo puerto. Los datos se guardan en `server/db.json`.


## Primer registro

Si la base está vacía, registra primero un **programa** y una **ficha** asociada.
Después registra aprendices en la ficha y crea un instructor para asignarlo a un
curso. Matricula a los aprendices en cursos de su ficha y registra una
calificación de **Aprobado** o **No aprobado** por matrícula.

Usa datos ficticios al probar. Las reglas de integridad se aplican desde la interfaz.
