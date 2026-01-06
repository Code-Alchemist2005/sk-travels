# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port (Render uses this)
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
