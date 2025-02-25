# Use nginx as base image
FROM nginx:alpine

# Copy the game files to nginx's default serving directory
COPY . /usr/share/nginx/html/

# Create custom nginx config
RUN echo 'server {\n\
    listen 3001;\n\
    server_name localhost;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Expose the new port
EXPOSE 3001