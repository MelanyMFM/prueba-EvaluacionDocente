*Requerimientos Funcionales* 

1. Roles de usuario

RF1.1 El sistema debe permitir el ingreso como Estudiante, Administrador o Docente.

RF1.2 El sistema debe distinguir claramente los permisos y vistas según el rol.


2. Funcionalidades para Estudiantes

RF2.1 El estudiante debe poder ingresar con una autenticación básica (puede ser mock o simplificada).

RF2.2 El estudiante debe poder ver y responder una encuesta de 3 preguntas.

RF2.3 El estudiante no debe poder volver a responder una encuesta ya enviada.


3. Funcionalidades para Administradores

RF3.1 El administrador debe poder:

Activar o desactivar la encuesta.

Modificar las preguntas de la encuesta.

Modificar el valor que tiene la encuesta en la nota final.


RF3.2 El administrador debe poder darle al botón: calcular los resultados de la encuesta (se hace solo una vez por encuesta).

RF3.3 Una vez calculados los resultados y cerrada la encuesta, los resultados deben quedar visibles para los docentes.


4. Funcionalidades para Docentes

RF4.1 El docente debe poder ver la nota correspondiente a su evaluación cuando esta se haya liberado por el administrador.


 *Requerimientos No Funcionales* 

RNF1: La interfaz debe ser simple y coincidir con el estilo visual actual.

RNF2: La arquitectura debe ser monolitica pero se debe trabajar en react con componentes reutilizables.

RNF3: El sistema debe poder ser desplegado fácilmente en local.

RNF4: Se debe contar con una estructura mínima de autenticación o mock de autenticación por rol (lo más simple posible, puede ser con rutas).

RNF5: El sistema debe tener persistencia temporal de datos (puede ser una base de datos simple o almacenamiento en archivos locales para la prueba).

RNF6: El sistema debe permitir una fácil extensión futura (por ejemplo, agregar nuevas preguntas).