# Coco Boutique — Frontend (React)

Aplicación construida con **React + Vite**, **Tailwind CSS**, **React
Router** y **Axios**. Consume la API REST del proyecto `backend/`.

## Configuración

Crea un archivo `.env` en esta carpeta (no viene incluido en el
repositorio) con este contenido:

```
VITE_API_URL=http://localhost:4000/api
```

## Instalación y ejecución

> El **backend debe estar corriendo primero** (ver `backend/README.md`),
> ya que esta app depende de él para el login y para traer los datos.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Rutas de la aplicación

| Ruta               | Acceso            | Descripción                                                    |
|--------------------|-------------------|----------------------------------------------------------------|
| `/catalogo`        | Público           | Catálogo de productos + contacto por WhatsApp/Instagram/TikTok |
| `/login`           | Público           | Inicio de sesión administrativo                                |
| `/dashboard`       | Requiere sesión   | Estadísticas y últimas ventas                                  |
| `/productos`       | Requiere sesión   | Listado de productos (editar/eliminar)                         |
| `/productos/nuevo` | Requiere sesión   | Registrar producto                                             |
| `/ventas`          | Requiere sesión   | Listado de ventas (editar/eliminar)                            |
| `/ventas/nueva`    | Requiere sesión   | Registrar venta                                                |

Credenciales de demostración: usuario `admin`, contraseña `coco2026`.

## Notas

- El número de WhatsApp y usuarios de Instagram/TikTok de la tienda se
  configuran al inicio de `src/pages/CatalogoPage.jsx`.
- La sesión se guarda en `localStorage`; si el token expira o es
  inválido, la app redirige automáticamente al login.