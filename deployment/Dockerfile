FROM registry.cn-shenzhen.aliyuncs.com/flyele-public/nginx:stable-alpine

RUN echo -e 'server { \
	listen 8080; \n\
	# server_name _; \n\
	\n\
	root /usr/share/nginx/web; \
	index index.html index.htm index.php; \
	\n\
	location / { \n\
	try_files $uri $uri/ /index.html last; \n\
	} \n\
	}\
	' > /etc/nginx/conf.d/default.conf


COPY ./dist/apps/h5 /usr/share/nginx/web

EXPOSE 8080
