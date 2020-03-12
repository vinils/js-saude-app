# js-saude-app
Saude page

[![Docker Pulls](https://img.shields.io/docker/pulls/vinils/js-saude-app.svg)](https://hub.docker.com/r/vinils/js-saude-app)
[![Docker Stars](https://img.shields.io/docker/stars/vinils/js-saude-app.svg)](https://hub.docker.com/r/vinils/js-saude-app)
<a href="https://hub.docker.com/r/vinils/js-saude-app/builds" target="_blank">Docker Builds</a>

docker build -t vinils/myhealth_app .  
docker run -p 3001:3000 -it -d -e DATA_POINT=192.168.15.139:8002/odata -e REACT_APP_DATA_POINT=192.168.15.139:8002/odata vinils/myhealth_app
