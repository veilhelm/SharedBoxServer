FROM node:latest

WORKDIR /usr/src/

COPY . .

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "dev"]

