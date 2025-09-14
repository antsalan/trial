#!/bin/bash

# Bus Passenger Counter - Live Webcam Script
# This script runs the passenger counter with live webcam feed

echo "Starting Bus Passenger Counter with live webcam..."
echo "Make sure your web server is running at http://localhost:5000"
echo "Press 'q' in the video window to stop"
echo ""

python3 people_counter_client.py \
  --bus_id BUS-247 \
  --model MobileNetSSD_deploy.caffemodel \
  --server_url http://localhost:5000 \
  --confidence 0.4 \
  --update_interval 5

echo ""
echo "Passenger counter stopped."