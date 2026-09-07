Coco Boutique — Backend (API REST)

API REST construida con Node.js + Express. Maneja autenticación con JWT y guarda los datos (usuarios, productos, ventas) en un archivo JSON (src/db/database.json), sin necesidad de instalar una base de datos aparte.

Configuración

Crea un archivo .env en esta carpeta (no viene incluido en el repositorio) con este contenido:

PORT=4000
JWT_SECRET=coco_boutique_clave_secreta_cambiar_en_produccion
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173
Instalación y ejecución
bash
npm install
npm run dev

Debe mostrar: API de Coco Boutique corriendo en http://localhost:4000. Déjalo corriendo — el frontend depende de que esta terminal siga abierta.

Verificación rápida: abrir http://localhost:4000/api en el navegador debe responder {"mensaje":"API de Coco Boutique funcionando correctamente."}.

Endpoints principales

Método	            Ruta	            Protegida	Descripción
POST	            /api/auth/login	    No	        Login, devuelve token JWT
GET	                /api/productos	    No	        Lista productos (catálogo público)
POST/PUT/DELETE	    /api/productos	    Sí	        Crear / editar / eliminar producto
GET	                /api/ventas	        Sí	        Lista ventas
POST/PUT/DELETE	    /api/ventas	        Sí	        Crear / editar / eliminar venta
GET	                /api/estadisticas	Sí	        Resumen para el dashboard

Las rutas protegidas requieren el header Authorization: Bearer <token>.

Notas
Credenciales de demostración: usuario admin, contraseña coco2026.
El límite de tamaño de las peticiones está en 5 MB (server.js), para permitir imágenes de producto enviadas en base64.