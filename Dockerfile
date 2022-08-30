FROM node:14 as base
WORKDIR /queue
COPY /src ./src
COPY tsconfig* package.json ./
RUN npm install

FROM base as build
RUN npm run build