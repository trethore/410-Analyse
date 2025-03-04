docker build -t my-image:latest .
docker rm 410-test
docker run --name 410-test -it my-image:latest
docker start 410-test
docker attach 410-test