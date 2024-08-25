FROM node:18-alpine

# Set working directory
WORKDIR /app
# ENV PATH=/usr/local/openfitness/node_modules/.bin:$PATH
# WORKDIR /usr/local/apps/openfitness

EXPOSE 3001

COPY package.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "dev"]
