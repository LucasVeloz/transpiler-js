FROM node:20

COPY . .


CMD [ "node", "src", "/var/rinha/source.rinha.json" ]
