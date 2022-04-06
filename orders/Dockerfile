FROM node:alpine

WORKDIR /src/app

COPY ./package.json ./package-lock.json ./

RUN npm ci --only=prod

COPY ./ ./

CMD ["npm", "start"]