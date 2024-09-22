# Imagem compacta do Node.js slim
FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src

# Porta que o Express vai usar
EXPOSE 3000

CMD ["npm", "start"]
