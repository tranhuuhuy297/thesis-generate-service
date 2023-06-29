FROM node:18.16.1-alpine

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . ./

CMD ["ts-node", "src/run.ts"]