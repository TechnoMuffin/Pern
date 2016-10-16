#Guía de Instalación
##Paso 1: Clonar
Primero se debe clonar el proyecto pern en un directorio local. Para eso debemos ir al directorio donde queremos guardar el proyecto y ejecutar en terminal la siguiente linea
```
git clone https://github.com/TechnoMuffin/Pern
```
##Paso 2: Seleccionar la rama correcta
Para ejecutar el proyecto debemos ir a una rama funcional. En una etapa avanzada del proyecto ésta rama debería ser "master"(la cual viene por seleccionada por default), pero como todavia el proyecto no cuenta con una version estable la rama principal es "develop"
```
git checkout develop
```
##Paso 3: Ir al ejecutable
Debido a la cantidad de cambios que realizamos desde la version original, la nueva version funcional se encuentra en una subcarpeta del proyecto. Ejecutamos desde el directorio raiz del proyecto.
```
cd Pern2/
```
##Paso 4: Crear databases
Al ejecutar el comando "migrate" debemos añadir el parametro "--run-syncdb" porque la base de datos fue creada en una version anterior de django
```
python manage.py migrate --run-syncdb
```
##Paso 5: Correr el proyecto
Una vez realizados estos pasos podremos correr el proyecto con el comando
```
python manage.py runserver
```
Para acceder en el navegador, solo hay que ir a la URL que django le asignó y añadir /seguimientoAlumno/
