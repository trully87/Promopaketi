#!/bin/bash

# First login and save session info
SESSION=$(curl -s -i -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -i "set-cookie" | cut -d':' -f2- | tr -d '\r\n' | cut -d';' -f1)

echo "Session: $SESSION"

# Create packages using the session
for i in 1 2 3 4; do
  echo "Creating package $i..."
  curl -s -X POST http://localhost:5000/api/packages \
    -H "Content-Type: application/json" \
    -H "Cookie: $SESSION" \
    -d @- << DATA
{
  "nameME": "Test Paket $i",
  "nameEN": "Test Package $i",
  "price": 100,
  "minOrder": 30,
  "category": "newyear",
  "image": "/uploads/luxury_new_year_corp_81b9e67d.jpg"
}
DATA
  echo ""
done
