#!/bin/bash

# iNest Website Deployment Script
echo "Starting iNest deployment..."

# Update system packages
echo "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
echo "Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org

# Start and enable MongoDB
systemctl start mongod
systemctl enable mongod

# Install nginx
echo "Installing nginx..."
apt install -y nginx

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Create necessary directories
echo "Creating directories..."
mkdir -p /var/www/inest
mkdir -p /var/log/inest

# Set proper permissions
chown -R www-data:www-data /var/www/inest
chmod -R 755 /var/www/inest

echo "Server setup complete!"
echo "Now upload your files to /var/www/inest"
