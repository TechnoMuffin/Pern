# Documentacion

## Base de Datos(Models)

### Class Course

En esta tabla se muestran los cursos con sus respectivas divisiones.
Tiene:  -idCourse (identifica el curso).
	-yearCourse (dice a que año pertenece el curso ej. 2010).
	-courseType (es la combinacion del año con la division ej. 1C).

### Class Pupil

En esta tabla  van a estar los alumnos propiamente dichos.
Tiene:	-namePupil (nombre de cada alumno).
	-surnamePupil (apellido de cada alumno).
	-idPupil (id que identifica a cada alumno).
	-idCourse (union con la tabla Course).

### Class Fulfillment

En esta tabla van a estar los objetos que se ven en el cumplimiento ej. lima bastarda.
Tiene:	-nameFF (el nombre del objeto).

### Class Subject

En esta tabla van a estar las materias o las rotaciones ej. Ajuste.
Tiene:	-idSubject (id para identificar cda materia).
	-nameSubject (nombre de cada materia).
	-idFF (relacion con la tabla Fulfillment).
	-idCourse (relacion con la tabla Course).

### Class PupilFollowing
- idSubject (relacion con la tabla Subject).
- idPupil (relacion con la tabla Pupil).
- commentPF (cuadro de texto donde el profesor pone las observaciones).

### Class Projects

En esta tabla estan los proyectos de cada materia ej. el martillo de Ajuste.

Tiene:
- nameProject (nombre del proyecto).
- idSubject (relacion con la tabla Subject).

### Class ProjectStages

en esta tabla se van a guardar las etapas de ada proyecto ej. pulido del martillo

Tiene:
- namePS (nombre de cada etapa).
- idPS (id para identificar cada etapa).
- idProject (relacion con la tabla Projects).



