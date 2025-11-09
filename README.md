## MiIventarioExpress

## Autor

- Desarrollado por Alan Juiña
- Proyecto académico – Aplicaciones Web
- Universidad Politécnica Salesiana – 2025

Aplicación web desarrollada con **Node.js**, **Express** y **MongoDB** para la gestión básica de productos en inventario.  
Permite registrar, visualizar, editar y eliminar artículos con sus respectivas imágenes. 

## CARACTERISTICAS PRINCIPALES
- **Autenticación de usuarios** con roles (administrador y usuario).
- **CRUD de productos** (crear, listar, editar, eliminar).
- **Subida de imágenes** mediante *Multer*.
- **Vistas dinámicas** con *Handlebars*.
- **Conexión a MongoDB** usando *Mongoose*.
- **Servidor local con Nodemon** para desarrollo ágil.

---

## Requisitos previos

- Node.js (v18 o superior)
- Extensiones proporciondas por el material en la plataforma Avac
- MongoDB instalado y en ejecución local (`mongodb://127.0.0.1:27017/`) https://www.mongodb.com/try/download/community
- Git (opcional, para clonar el repositorio)

---

## Instalación y ejecución

1. Clonar el repositorio

2. Instalar dependencias:

    - npm install

3. Iniciar el servidor:

    - npm run dev

4. Abrir en el navegador:

- http://localhost:3000

5. No olvidar inicializar el servidor mongoDB Compass detectara automaticamente y solo debera dar un clic en conectar

---
## Estructura del Proyecto

MiInventarioExpress/
│
├── controllers/        # Lógica principal de productos y usuarios
├── models/             # Modelos Mongoose (Product, User)
├── public/             # Archivos estáticos (CSS, imágenes subidas)
├── routes/             # Definición de rutas de la app
├── views/              # Vistas Handlebars (.hbs)
│   ├── layouts/        # Plantilla base
│   └── products/       # Páginas de productos
│
├── server.js           # Configuración del servidor
└── package.json        # Dependencias y scripts
