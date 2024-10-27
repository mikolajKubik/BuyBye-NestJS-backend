#!/bin/bash

# Define the URL and payload for the POST requests
URL="http://localhost:3000/orders"
PAYLOAD='{
  "orderDate": "2010-12-27T10:30:00Z",
  "products": [
    { "id": "8455974a-0e12-4db6-8a62-b5a3701b7f99", "quantity": 1 }
  ]
}'

# Temporary latch file for synchronization
LATCH_FILE="./latch.lock"

# Ensure the latch file exists and is empty
: > "$LATCH_FILE"

# Function for the task (background job)
task() {
  echo "Waiting for latch release in task $1..."
  # Wait until the latch file is removed
  while [[ -e "$LATCH_FILE" ]]; do
    sleep 0.1
  done

  # Perform the curl request
  echo "Starting task $1..."
  curl -i -v -X POST "$URL" -H "Content-Type: application/json" -d "$PAYLOAD"
}

# Start two tasks in the background
task 1 &
task 2 &

# Sleep briefly to ensure tasks are waiting
sleep 1

# Main thread releases the latch
echo "Releasing latch..."
rm "$LATCH_FILE"

# Wait for all background tasks to complete
wait

echo "All tasks completed."