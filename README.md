# PokeAPI-Web-Page
# Proyecto de Angular utilizando una API pública como ejercicio

Este es un proyecto de Angular que incluye una serie de componentes y servicios relacionados con un sistema de manejo de movimientos Pokémon. El proyecto utiliza Angular Material para la interfaz de usuario y realiza llamadas a una API para obtener datos.
La aplicación web consiste en una especie de Pokédex utilizando PokéAPI v2.

## Componentes Principales

- **HeaderComponent**: Muestra el encabezado de la aplicación con una imagen de banner.
- **SidebarComponent**: Proporciona una barra lateral con enlaces de navegación.
- **MovesComponent**: Muestra una tabla de movimientos de Pokémon que se puede filtrar por tipo.

## Servicios

- **PokemonService**: Maneja las solicitudes HTTP para obtener información de Pokémon, movimientos, habilidades, y más.


## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Alanxkiller/PokeAPI-Web-Page.git

2. Navega al directorio del proyecto:
   cd PokeAPI-Web-Page

3. Instala las dependencias:
   npm install

# Ejecucion del proyecto

Para iniciar la aplicación, utiliza el siguiente comando:
ng serve

Accede a la aplicación en http://localhost:4200.

# Pruebas Unitarias

Este proyecto incluye pruebas unitarias para los componentes y servicios. Para ejecutar las pruebas, utiliza:
ng test

# Estructura del Proyecto
src/app: Contiene todos los componentes y servicios de la aplicación.
header: Contiene el HeaderComponent.
sidebar: Contiene el SidebarComponent.
moves: Contiene el MovesComponent.
services: Contiene el PokemonService.
directives: Contiene la directiva DragScrollDirective.

# Ejemplos de Pruebas Unitarias
HeaderComponent
Pruebas que verifican la creación del componente, la presencia de la imagen y su tamaño.

SidebarComponent
Pruebas que verifican la creación del componente, la presencia del enlace routerLink, el texto del enlace y la clase active-link.

PokemonService
Pruebas que verifican la correcta configuración y respuesta de los métodos del servicio.







