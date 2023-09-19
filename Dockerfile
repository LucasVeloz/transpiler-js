FROM node:20

COPY . .


CMD [ "node", "src/index.js", "/var/rinha/source.rinha.json" ]
