FROM stefanscherer/node-windows:latest

##############
# require for build react exams grid submodule
WORKDIR /usr/exams_app

COPY /react-saude-exams-app/package*.json ./
RUN npm install
	
COPY /react-saude-exams-app/. ./
##############

WORKDIR /usr/app

COPY package*.json ./
RUN npm install
RUN npm install -g bower gulp

COPY . .

EXPOSE 3000

# gulp scripts is required since there is some issues related to build folder when deleted
CMD set REAT_APP_DATA_POINT=%DATA_POINT% && cd ..\exams_app && npm run build && move /Y build\static\js\main.c0b01524.js ..\app\src\js\main.14a5b63f.js && move /Y build\static\js\main.c0b01524.js.map ..\app\src\js\main.14a5b63f.js.map && cd ..\app && gulp scripts && gulp