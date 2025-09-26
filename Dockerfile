# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder

# Set the container's working directory
WORKDIR /app

# Copy dependency manifest files for efficient caching
# This ensures 'npm install' only runs when package.json changes
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all application source files, including build-time environment configurations
COPY index.html ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./
COPY src/ src/
COPY public/ public/
COPY .env.production .env.production 

# Execute the production build
# This step bundles the application and embeds environment variables from .env.production
RUN npm run build

# --- Stage 2: Production/Serving Stage ---
FROM nginx:stable-alpine

# Copy the custom Nginx configuration. 
# The configuration ensures correct routing for Single Page Applications (SPAs).
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static application files from the 'builder' stage into the Nginx serving root
COPY --from=builder /app/dist /usr/share/nginx/html

# Document the port Nginx is configured to listen on
EXPOSE 80

# Command to start Nginx in the foreground, required for Docker containers
CMD ["nginx", "-g", "daemon off;"]