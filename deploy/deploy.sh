#!/bin/bash
set -e

# Deploy backend
cd backend
git add .
git commit -m "feat: Add qualities field for registrations"
git push

# Deploy frontend
cd ../frontend
npm install
npm run build
git add .
git commit -m "feat: Add qualities field for registrations"
git push

echo "Deployment completed!"
