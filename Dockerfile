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
ENV PORT=8080
EXPOSE 8080
CMD [ "npm", "start" ]
