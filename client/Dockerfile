FROM node:alpine

ENV PORT 3000

WORKDIR /src/app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]