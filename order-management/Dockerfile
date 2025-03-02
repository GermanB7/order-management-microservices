# Usamos la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package*.json ./

RUN apt-get update && apt-get install -y netcat
# Instalamos dependencias
RUN npm install -g @nestjs/cli && npm install --omit=dev

# Copiar el resto de la aplicación
COPY . .

# Generar Prisma Client dentro del contenedor
RUN npx prisma generate

# Reinstalar bcrypt dentro del contenedor
RUN npm rebuild bcrypt --build-from-source

RUN npm install -g @nestjs/cli && npm install --omit=dev && npm install amqp-connection-manager

# Construir la aplicación con NestJS CLI
RUN nest build

# Exponer el puerto en el que corre NestJS
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
