
# Use the official Node.js image to build the React app
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Enable hot reloading inside Docker
ENV CHOKIDAR_USEPOLLING=true

# Expose port 3000
EXPOSE 3000

# Start the React development server with hot reloading
CMD ["npm", "start"]
