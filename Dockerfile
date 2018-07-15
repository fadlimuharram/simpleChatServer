FROM node:9.11.1

WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8087
RUN pwd
RUN ls -a
RUN cat package.json
CMD [ "npm","start" ]