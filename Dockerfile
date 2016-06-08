FROM node:6.2.1

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install

# Bundle app source
COPY . /app/

ENV NODE_ENV=production

RUN ./node_modules/.bin/webpack

ENV PORT=80
EXPOSE 80
CMD [ "npm", "start" ]
