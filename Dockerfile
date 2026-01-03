# Use Node 18 image
FROM node:18

# Install nmap
RUN apt-get update && apt-get install -y nmap

# Set working directory
WORKDIR /app

# Copy package.json first to install dependencies
COPY package.json package-lock.json* ./

RUN npm install

# Copy rest of the code
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "index.js"]
