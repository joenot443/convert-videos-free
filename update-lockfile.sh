#!/bin/bash
# Script to regenerate package-lock.json
# Run this locally, then commit the updated package-lock.json

echo "Removing old package-lock.json..."
rm -f package-lock.json

echo "Installing dependencies to regenerate package-lock.json..."
npm install

echo "Done! Please commit the updated package-lock.json file."
