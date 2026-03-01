#!/bin/bash
# Start all services for development

echo "🚀 Starting Pet Translator Development Environment"
echo "==================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to start service in new terminal/tab
start_service() {
    local name=$1
    local dir=$2
    local cmd=$3
    local color=$4
    
    echo -e "${color}Starting $name...${NC}"
    
    # For macOS - open new Terminal tab
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript <<EOF
        tell application "Terminal"
            activate
            tell application "System Events" to keystroke "t" using command down
            delay 0.5
            do script "cd $(pwd)/$dir && echo '\[$(echo $color | sed 's/\\033\[/\\\\033\[/g')\]=== $name ===$(echo $NC | sed 's/\\033\[/\\\\033\[/g')' && $cmd" in front window
        end tell
EOF
    # For Linux - use gnome-terminal or xterm
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $(pwd)/$dir && echo -e '${color}=== $name ===${NC}' && $cmd; exec bash"
        else
            xterm -e "cd $(pwd)/$dir && echo -e '${color}=== $name ===${NC}' && $cmd" &
        fi
    else
        echo "Please manually start $name in $dir with: $cmd"
    fi
    
    sleep 2
}

# Start Backend
cd backend
if [ ! -d "node_modules" ]; then
    echo "❌ Backend dependencies not installed. Run ./setup.sh first."
    exit 1
fi
cd ..

start_service "Backend API" "backend" "npm run dev" "$GREEN"
start_service "ML Service" "ml-service" "source venv/bin/activate && uvicorn src.main:app --reload --port 8000" "$BLUE"
start_service "Mobile Metro" "mobile" "npx react-native start" "$YELLOW"

echo ""
echo "✅ All services starting!"
echo ""
echo "Services will be available at:"
echo "  Backend:    http://localhost:3000"
echo "  API Docs:   http://localhost:3000/docs"
echo "  ML Service: http://localhost:8000"
echo "  Metro:      http://localhost:8081"
echo ""
echo "To run on device:"
echo "  iOS:     cd mobile && npx react-native run-ios"
echo "  Android: cd mobile && npx react-native run-android"
echo ""
echo "Press Ctrl+C in each terminal to stop services."
