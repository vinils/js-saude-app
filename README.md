# js-saude-app
Saude page

docker build -t vinils/myhealth_app .  
docker run -p 3001:3000 -it -d -e DATA_POINT=192.168.15.139:8002/odata -e REACT_APP_DATA_POINT=192.168.15.139:8002/odata vinils/myhealth_app
