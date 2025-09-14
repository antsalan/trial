@echo off
REM Bus Passenger Counter - Test Video Script (Windows)
REM This script runs the passenger counter with the test video

echo Starting Bus Passenger Counter with test video...
echo Make sure your web server is running at http://localhost:5000
echo.

python people_counter_client.py ^
  --bus_id BUS-247 ^
  --input attached_assets/test_1_1757778577870.mp4 ^
  --model MobileNetSSD_deploy.caffemodel ^
  --server_url http://localhost:5000 ^
  --confidence 0.4 ^
  --update_interval 5

echo.
echo Passenger counter stopped.
pause