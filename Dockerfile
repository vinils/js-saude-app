FROM stefanscherer/node-windows:latest
WORKDIR /usr/app

COPY package*.json ./
RUN npm install
RUN npm install -g bower gulp

COPY . .

EXPOSE 3000

CMD gulp