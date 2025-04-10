asset_update
{"asset": "Villa CUMT", "fuel": 0 , "type": "property", "revenue": "40000", "maintenance": "10.07.2025", "location": "104 30", "availability": "no"}

curl -X POST http://localhost:3000/api/particle-webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "asset_update", "data": "{\"asset\": \"Villa DEN\", \"fuel\": 0 , \"type\": \"property\", \"revenue\": \"40000\", \"maintenance\": \"10.07.2025\", \"location\": \"104 30\", \"availability\": \"no\"}"}'
