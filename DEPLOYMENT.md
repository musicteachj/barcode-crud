# Deployment Guide for Railway

This guide will help you deploy your Barcode CRUD application to Railway with CI/CD integration.

## Prerequisites

1. A Railway account (https://railway.app)
2. A GitHub repository with your code
3. A MongoDB database (you mentioned you already have this)

## Environment Variables

Make sure your server `.env` file contains:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# CORS Configuration (optional)
CORS_ORIGIN=https://your-app-name.railway.app
```

## Railway Deployment Steps

### 1. Create a New Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Configure Environment Variables

In your Railway project dashboard:

1. Go to the "Variables" tab
2. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: `3000` (Railway will override this automatically)
   - `CORS_ORIGIN`: Your Railway app URL (optional)

### 3. Configure Build Settings

Railway should automatically detect the configuration from `railway.json`, but verify:

- **Build Command**: `npm run railway:build`
- **Start Command**: `npm run railway:start`
- **Root Directory**: `/` (root of your repo)

### 4. Set Up CI/CD with GitHub Actions

1. In your Railway project, go to Settings > Tokens
2. Generate a new token and copy it
3. In your GitHub repository, go to Settings > Secrets and variables > Actions
4. Add these secrets:
   - `RAILWAY_TOKEN`: The token you generated
   - `RAILWAY_SERVICE_ID`: Your Railway service ID (found in project settings)

### 5. Deploy

1. Push your changes to the `main` branch
2. GitHub Actions will automatically run tests and deploy to Railway
3. Railway will build and deploy your application

## Project Structure

The application is now configured as a monorepo:

- `/client/` - Vue.js frontend
- `/server/` - Express.js backend
- `/package.json` - Root package.json with monorepo scripts
- `/railway.json` - Railway configuration
- `/Dockerfile` - Docker configuration (backup deployment method)
- `/.github/workflows/deploy.yml` - CI/CD pipeline

## Build Process

1. Install dependencies for both client and server
2. Build Vue.js frontend to `client/dist/`
3. Build TypeScript server to `server/dist/`
4. Server serves the built Vue app as static files in production

## Local Development

```bash
# Install all dependencies
npm run install:all

# Run both client and server in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are properly listed in package.json files
2. **Database connection fails**: Verify your MongoDB URI is correct and accessible
3. **CORS errors**: Make sure CORS_ORIGIN is set to your Railway app URL
4. **Static files not served**: Ensure the build process completed successfully

### Logs

Check Railway logs in your project dashboard to debug deployment issues.

## Production Considerations

1. **Environment Variables**: Never commit sensitive data like database URIs
2. **Error Handling**: The server includes comprehensive error handling
3. **Security**: Helmet.js is configured for security headers
4. **Logging**: Morgan is configured for production logging
5. **Health Check**: Available at `/health` endpoint

## Monitoring

Your app includes a health check endpoint at `/health` that returns:

- Server status
- Uptime
- Environment
- Timestamp

Use this for monitoring and health checks in Railway.
