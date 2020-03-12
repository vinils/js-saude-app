FROM vinils/react-saude-exams-app:latest as exams_app

FROM node:10.19.0

WORKDIR /app

COPY --from=exams_app /app/build/static/js ./src/js
#rename main.*.js* main.14a5b63f.js* #windows version
RUN mv ./src/js/main.????????.js main.14a5b63f.js
RUN mv ./src/js/main.????????.js.map main.14a5b63f.js.map

COPY package*.json ./
RUN npm install
RUN npm install -g bower gulp

COPY . .

EXPOSE 3000

# gulp scripts is required since there is some issues related to build folder when deleted
CMD gulp scripts; gulp