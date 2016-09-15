# ada_resco

##Clonar el repositorio, hacer commit con cambios y realizar pull

1. Descargar [GIT Downloads](https://git-scm.com/downloads) e instalar
2. Abrir terminal y clonar repositorio 'git clone https://github.com/cizaquita1/ada_resco.git'
3. Ingresar datos de Github y acceder a la carpeta cd "ada_resco"

#Hacer commit despues de realizar cambios

1. El archivo principal está en core/main.js editar una o dos lineas y guardar.
2. En la terminal dentro de la carpeta "ada_resco" hacer 'git commit -am "Comentarios de los cambios"'
3. Realizar push para subir los cambios 'git push'

#Bajar los cambios que alguien haya hecho

1. En la carpeta del repositorio "ada_resco" abrir la terminal y escribir 'git pull'
2. Ingresar datos de github y esperar a que se descarguen los cambios.

##Descripción
ADA es un bot creado para tomar pantallazos de ingress.com/intel además de otras funcionalidades varias para uso de la Resistencia y de términos de Ingress.
ADA funciona como una extensión de Google Chrome que permíte tomar el pantallazo con funciones nativas de Google Chrome.

## Como instalar el bot
1. Clonar o descargar el repositorio, luego descomprimir en una carpeta.
2. Descargar los pliguns necesarios desde el IITC (core/iitc.module.js este archivo contiene la lista de los plugins requeridos).
2. Crear un nuevo Bot en [@BotFather](http://telegram.me/botfather). Guardar el TOKEN
3. Editar (core/telegram.js) y reemplazar el TOKEN que te ha dado @BotFather
4. Abrir Google Chrome ir a chrome://extensions/ - o Configuración - Más Herramientas - Extensiones
5. Activar casilla "Modo Programador", seleccionar en "Cargar Extensión sin empaquetar" y seleccionar la carpeta donde se descomprimieron los archios.
6. No cerrar Google Chrome


## Lista de comandos:

* help - Información
* screenshot - Pantallazo de INTEL
* plugins - Plugins de IITC para INTEL
* distance - Calcula el rango de un portal
* level - Información sobre NIVELES y como subir
* trivia - Trivia para aprender (no agregado al menú de comandos aún...)
* cancel - Cancelar cualquier tarea
