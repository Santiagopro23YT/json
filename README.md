# Mini proyecto Json
## Introduccion:
Aplicativo académico con JavaScript nativo, MVC y JSON Server.
## Desarrollado:
- Nombre: Samuel Santiago Ramirez Fierro
- Programa: Analisis y Desarrollo de Software
- Ficha: 3407799
## Ejecutar el aplicativo

En una terminal, desde la raíz del proyecto, instala las dependencias e inicia la API:

```powershell
cd server
npm ci
npx json-server db.json --port 3000
```



En otra terminal, sirve la raíz con Live Server u otro servidor HTTP y abre
`index.html` desde su URL local. Si tienes Python 3, por ejemplo, ejecuta
`python -m http.server 5500 --bind localhost` desde la raíz y abre
[el aplicativo](http://localhost:5500/). Los módulos JavaScript requieren HTTP.

## Primer registro

Si la base está vacía, registra primero un **programa** y una **ficha** asociada.
Después registra aprendices en la ficha y crea un instructor para asignarlo a un
curso. Matricula a los aprendices en cursos de su ficha y registra una
calificación de **Aprobado** o **No aprobado** por matrícula.

Usa datos ficticios al probar. Las reglas de integridad se aplican desde la interfaz.
