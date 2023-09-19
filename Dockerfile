# Base image
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy your files
COPY src/* ./
COPY files/* ./

# Start the app
CMD [ "node", "src/index.js" ]
