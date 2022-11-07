FROM node
WORKDIR /app
COPY . .
RUN npm install
RUN npm install sequelize-cli -g
EXPOSE 80
CMD ["npm", "start"]
