# js-saude-app
Saude page

docker build -t vinils/myhealth_app .<BR>
docker run -p 3000:3000 -it -d -e DATA_POINT=192.168.15.35:8002/odata/v4 vinils/myhealth_app
