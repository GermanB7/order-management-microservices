# Usamos la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install -g @nestjs/cli && npm install --omit=dev

RUN npm install -g @nestjs/cli && npm install --omit=dev && npm install amqplib


# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que corre el servicio
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
