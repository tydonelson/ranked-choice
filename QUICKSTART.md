# Quick Start Guide

Get your ranked choice voting app running locally in minutes.

## Project Status

Fully functional ranked choice voting application:

- ✅ React + TypeScript frontend (deployed on AWS Amplify)
- ✅ Go backend with Lambda handlers (deployed on AWS)
- ✅ DynamoDB database
- ✅ Complete UI with drag-and-drop voting
- ✅ Two voting methods: IRV and Borda Count
- ✅ Results visualization with charts
- ✅ URL routing and poll sharing

## Run Locally

### Frontend

```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

You'll see:
- Home page with feature overview
- Navigation to create polls (placeholder for now)
- Basic styling

### Making Changes

To modify the application:

1. Make your changes to the frontend code
2. Test locally with `npm start`
3. Push to Git - Amplify will automatically rebuild and deploy
4. For backend changes, use `make deploy` from the backend directory

## Deploy to AWS

Once you're ready to deploy:

1. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions
2. Deploy backend first (creates API endpoint)
3. Deploy frontend to Amplify with API URL

## File Structure Overview

```
frontend/src/
├── types/index.ts       # TypeScript interfaces
├── services/api.ts      # API client
├── App.tsx              # Main app component
└── App.css              # Styles

backend/
├── cmd/lambda/main.go            # Lambda entry point
├── internal/
│   ├── handlers/poll.go          # API handlers
│   ├── models/poll.go            # Data models
│   └── repository/dynamodb.go    # DynamoDB access
└── template.yaml                  # AWS SAM template
```

## Testing the API

Once backend is deployed, test with curl:

```bash
# Set your API URL
export API_URL="https://your-api.execute-api.us-east-1.amazonaws.com/prod"

# Create a poll
curl -X POST $API_URL/polls \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Favorite Color",
    "description": "Vote for your favorite",
    "candidates": ["Red", "Blue", "Green", "Yellow"]
  }'

# Save the poll ID from response, then get poll
curl $API_URL/polls/{POLL_ID}

# Submit a vote
curl -X POST $API_URL/polls/{POLL_ID}/vote \
  -H "Content-Type: application/json" \
  -d '{
    "rankings": ["Blue", "Green", "Red", "Yellow"]
  }'

# Get results
curl $API_URL/polls/{POLL_ID}/results
```

## Installed Libraries

The application uses:

- `@dnd-kit/core` and `@dnd-kit/sortable` - Drag and drop voting
- `react-router-dom` - URL routing
- `recharts` - Results visualization
- `react-icons` - UI icons

## Environment Variables

Create [frontend/.env.local](frontend/.env.local):
```
REACT_APP_API_URL=https://your-api.execute-api.us-east-1.amazonaws.com/prod
```

This URL will be available after you deploy the backend.

## Need Help?

- Backend API issues: Check Lambda logs in CloudWatch
- Frontend issues: Check browser console
- Deployment issues: See [DEPLOYMENT.md](DEPLOYMENT.md)

## What's Next?

1. Start the frontend locally: `cd frontend && npm start`
2. Build out the components (Create Poll, Vote, Results)
3. Test locally with mock data
4. Deploy backend to AWS
5. Update frontend with API URL
6. Deploy frontend to Amplify
7. Share your voting app!
