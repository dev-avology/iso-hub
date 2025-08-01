# JACC Integration with ISO-Hub

This setup allows you to run both ISO-Hub and JACC simultaneously, with seamless authentication integration.

## 🚀 Quick Start

### 1. Fix Port Conflicts (if needed)
If you get a "port 5000 already in use" error:
```bash
npm run kill-port-5000
```

### 2. Start Both Servers
```bash
npm run start-dev
```

This will start:
- **ISO-Hub** on `http://localhost:5173`
- **JACC** on `http://localhost:5000`
- **JACC via ISO-Hub** at `http://localhost:5173/jacc`

## 🔧 How It Works

### 1. **Seamless Authentication Flow**
- **Login to ISO-Hub**: Automatically logs you into JACC as well
- **Access JACC**: Go to `/jacc` in ISO-Hub sidebar (shows loader, then JACC)
- **Logout from ISO-Hub**: Automatically logs you out from JACC as well

### 2. **Auto-Login System**
When you log into ISO-Hub, the system automatically:
1. Authenticates you in ISO-Hub
2. Uses the same credentials to log you into JACC via `/api/auth/simple-login`
3. Maintains session synchronization between both applications

### 3. **Auto-Logout System**
When you logout from ISO-Hub, the system automatically:
1. Logs you out from ISO-Hub
2. Logs you out from JACC via `/api/logout`
3. Clears all session data from both applications

### 4. **JACC Integration**
- JACC is embedded in ISO-Hub via iframe at `/jacc`
- When users click "JACC" in the sidebar, they see a loader for 2 seconds
- JACC loads directly without login parameters (auto-login handled by AuthProvider)
- JACC runs in a full-screen iframe within ISO-Hub

### 5. **JACC UI Modifications**
- **Removed logout functionality**: JACC no longer has logout buttons or options
- **Added connection status**: Shows "Connected to ISO-Hub" instead of logout options
- **Centralized logout**: All logout functionality is handled through ISO-Hub
- **Loader components**: Added loading indicators for better user experience
- **No login screen**: JACC login screen is bypassed when accessed via ISO-Hub

### 6. **Dynamic Configuration**
- **Environment Variables**: All URLs are configurable via environment variables
- **JACC URL**: `VITE_JACC_URL` (defaults to `http://localhost:5000`)
- **API Base URL**: `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`)
- **Flexible Deployment**: Easy to change URLs for different environments

## 📋 Development Setup

### Ports Used:
- **ISO-Hub**: `localhost:5173` (Vite dev server)
- **JACC**: `localhost:5000` (Express server)

### Environment Variables:
```env
# ISO-Hub Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# JACC Configuration
VITE_JACC_URL=http://localhost:5000
```

### File Structure:
```
iso-hub/
├── src/
│   ├── pages/JaccPage.tsx          # JACC iframe page with loader
│   ├── components/Sidebar.tsx       # Navigation with JACC link
│   ├── providers/AuthProvider.tsx   # Handles auto-login/logout
│   └── App.tsx                     # Routes including /jacc
├── jacc7/                          # JACC application
│   ├── client/src/
│   │   ├── components/
│   │   │   ├── sidebar.tsx         # Modified to remove logout
│   │   │   ├── loader.tsx          # New loader component
│   │   │   └── connection-status.tsx # New connection status
│   │   └── pages/login.tsx         # Modified to prevent login screen
│   └── server/                     # JACC backend
├── start-dev-servers.js            # Script to run both servers
└── kill-port-5000.js              # Script to fix port conflicts
```

## 🛠️ Configuration

### Environment Variables
Make sure these are set in your `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_JACC_URL=http://localhost:5000
```

### JACC Server Configuration
The JACC server runs on port 5000 by default. If you need to change this:

1. Update `jacc7/server/index.ts` to use a different port
2. Update `src/pages/JaccPage.tsx` with the new port
3. Update `src/providers/AuthProvider.tsx` with the new port
4. Update `start-dev-servers.js` with the new port
5. Update your `.env` file with the new URLs

## 🔍 Troubleshooting

### Port 5000 Already in Use
```bash
# Kill processes on port 5000
npm run kill-port-5000

# Or manually:
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti:5000
```

### JACC Not Loading
1. Check if JACC server is running on port 5000
2. Check browser console for CORS errors
3. Verify that you're logged into ISO-Hub first
4. Check that JACC auto-login was successful (check console logs)
5. Verify environment variables are set correctly

### Auto-Login Not Working
1. Check that both servers are running
2. Verify login endpoints in both applications
3. Check browser console for errors
4. Ensure CORS is properly configured
5. Verify the `/api/auth/simple-login` endpoint is working

## 📝 Usage Examples

### Starting Development
```bash
# Kill any existing processes on port 5000
npm run kill-port-5000

# Start both servers
npm run start-dev
```

### User Flow
1. **Login to ISO-Hub**: `http://localhost:5173/login`
   - Automatically logs you into JACC as well
2. **Access JACC**: Click "JACC" in sidebar or go to `http://localhost:5173/jacc`
   - Shows loader for 2 seconds, then loads JACC
   - No additional login needed
3. **Logout**: Click logout in ISO-Hub
   - Automatically logs you out from JACC as well

### Testing Auto-Login
```
http://localhost:5173/login?username=client_admin&password=Admin123!
```
This will log you into both ISO-Hub and JACC simultaneously.

## 🔒 Security Notes

- Auto-login with URL parameters is for development/testing only
- In production, implement proper SSO or token-based authentication
- Consider using environment variables for credentials instead of hardcoding
- The auto-login system maintains session consistency between applications
- JACC logout is disabled to prevent session conflicts
- JACC login screen is bypassed when accessed via ISO-Hub

## 🚀 Production Deployment

For production deployment:
1. Update URLs to use your domain instead of localhost
2. Implement proper authentication between ISO-Hub and JACC
3. Consider using a reverse proxy to handle both applications
4. Set up proper CORS configuration
5. Use secure session management
6. Ensure JACC logout functionality remains disabled
7. Configure environment variables for your production URLs

## 📞 Support

If you encounter issues:
1. Check the console logs for both servers
2. Verify all dependencies are installed
3. Ensure no other services are using the required ports
4. Check that both applications can start independently
5. Verify that auto-login/logout is working in the browser console
6. Check that JACC shows "Connected to ISO-Hub" status
7. Verify environment variables are set correctly 