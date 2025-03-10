# Order Management Microservices

Este proyecto implementa un sistema de microservicios para gestionar órdenes y notificaciones utilizando **NestJS, RabbitMQ y PostgreSQL**.

## 🚀 Tecnologías utilizadas
- **Node.js** (NestJS)
- **RabbitMQ** (Mensajería entre servicios)
- **PostgreSQL** (Base de datos)
- **Docker & Docker Compose** (Orquestación de contenedores)
- **Prisma** (ORM para la base de datos)
- **Jest** (Para pruebas unitarias y de integración)

---
## 📥 Instalación y configuración
### 1️⃣ **Clonar el repositorio**
```sh
 git clone https://github.com/tu-usuario/order-management-microservices.git
 cd order-management-microservices
```

### 2️⃣ **Configurar las variables de entorno**
Crea un archivo `.env` en la raíz del proyecto y agrega:
```ini
DATABASE_URL=postgresql://user:password@db:5432/order_management
JWT_SECRET=secreto_super_seguro
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
```

### 3️⃣ **Levantar los contenedores con Docker**
```sh
docker-compose up --build -d
```
Esto iniciará:
- **PostgreSQL** en `localhost:5432`
- **RabbitMQ** en `localhost:5672` (Dashboard en `localhost:15672` usuario: `user`, contraseña: `password`)
- **order-management** en `localhost:3003`
- **notification-service** en `localhost:3001`

---
## 🔍 Uso y pruebas
### 📌 **Verificar que los servicios están corriendo**
```sh
docker ps
```

### 📌 **Swagger (Documentación de API)**
Abre en el navegador:
```
http://localhost:3003/api
```

### 📌 **Pruebas en Postman**
1. **Crear usuario**
   - `POST http://localhost:3003/users`
   - Body:
   ```json
   {"name": "Juan Pérez", "email": "juan@example.com", "password": "123456"}
   ```
   - 📌 Respuesta esperada:
   ```json
   {"id": "12345", "name": "Juan Pérez", "email": "juan@example.com"}
   ```

2. **Crear orden**
   - `POST http://localhost:3003/orders`
   - Body:
   ```json
   {"userId": "12345"}
   ```
   - 📌 En `docker logs notification-service -f`, deberías ver:
   ```
   📩 Notificación enviada: Se creó una nueva orden (Order: 67890, User: 12345)
   ```

3. **Actualizar estado de orden**
   - `PATCH http://localhost:3003/orders/67890`
   - Body:
   ```json
   {"status": "completed"}
   ```
   - 📌 En `docker logs notification-service -f`, deberías ver:
   ```
   📩 Notificación enviada: Estado de orden actualizado a 'completed' (Order: 67890, User: 12345)
   ```

---
## 🐞 Problemas conocidos y soluciones
### ❌ `Error: PRECONDITION_FAILED - inequivalent arg 'durable'`
💡 **Solución:**
```sh
docker exec -it rabbitmq rabbitmqctl delete_queue notifications_queue
```
Luego, reinicia los servicios:
```sh
docker-compose restart
```

### ❌ `ECONNREFUSED` al conectar a RabbitMQ
💡 **Solución:**
- Asegúrate de que RabbitMQ esté corriendo (`docker ps`)
- Verifica las credenciales en `.env`
- Reinicia RabbitMQ:
```sh
docker-compose restart rabbitmq
```

---
## ✅ Pruebas unitarias
Ejecuta las pruebas con Jest:
```sh
docker exec -it order-management npm run test
```

---
## 📌 Notas finales
Si experimentas problemas, revisa los logs:
```sh
docker logs order-management -f
docker logs notification-service -f
docker logs rabbitmq -f
```
Si el problema persiste, intenta reconstruir los contenedores:
```sh
docker-compose down --volumes
docker-compose up --build -d
```
¡Gracias por revisar este proyecto! 🚀

