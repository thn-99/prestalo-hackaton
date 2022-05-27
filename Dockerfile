# BUILD ENVIROMENT
FROM node:16 as builder
#Set the working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
# Installs all node packages
RUN npm install

# There must be and .dockerignore file in the root of the project for node_modules and build to be ignored
COPY . ./

RUN npm run build

# PRODUCTION ENVIROMENT
FROM nginx:1.20

# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static resources
RUN rm -rf ./*
# Copies static resources from builder stage
COPY --from=builder /app/build .

#Copies the nginx configuration file to redirect all traffic to the build directory
COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]