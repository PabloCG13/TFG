FROM nginx:1.27.3-alpine3.20

# Copy the nginx default configuration file
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80