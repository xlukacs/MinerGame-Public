# Use nginx as base image
FROM nginx:alpine

# Copy the game files to nginx's default serving directory
COPY . /usr/share/nginx/html/

# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the new port
EXPOSE 3001