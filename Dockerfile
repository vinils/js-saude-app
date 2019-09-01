FROM stefanscherer/node-windows:latest

##############
# require for build react exams grid submodule

##problem to se a variable
#ENV REAT_APP_DATA_POINT=%DATA_POINT%

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
CMD cd ..\exams_app && npm run build && del ..\app\src\js\main.*.js* && cd build\static\js && rename main.*.js* main.14a5b63f.js* && move /Y main.*.js* C:\usr\app\src\js && cd C:\usr\app && gulp scripts && gulp