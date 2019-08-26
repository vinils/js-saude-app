FROM stefanscherer/node-windows:latest
WORKDIR /usr/app

COPY package*.json ./
RUN npm install
RUN npm install -g bower gulp

COPY . .

EXPOSE 3000

# gulp scripts is required since there is some issues related to build folder when deleted
CMD gulp scripts && gulp