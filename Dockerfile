
FROM node:10-alpine

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package.json /src/app/package.json

RUN npm install


RUN mkdir -p  /src/app/scripts
RUN mkdir -p  /src/app/images
RUN mkdir -p  /src/app/css
RUN mkdir -p  /src/app/js

COPY html/.      /src/app/html/.
COPY scripts/.   /src/app/scripts/.
COPY images/.    /src/app/images/.
COPY css/.       /src/app/css/.
COPY js/.        /src/app/js/.
COPY app.js      /src/app/.

EXPOSE 80

CMD [ "npm", "start" ]
