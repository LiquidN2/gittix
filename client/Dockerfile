FROM node:alpine

WORKDIR /src/app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./ ./

CMD ["npm", "run", "dev"]