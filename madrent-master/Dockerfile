# Use nginx as base image
FROM nginx:alpine

# Copy the game files to nginx's default serving directory
COPY . /usr/share/nginx/html/

# Create custom nginx config
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 3001;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Expose the new port
EXPOSE 3001