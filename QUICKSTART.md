# Quick Start Guide

Get your ranked choice voting app running locally in minutes.

## Project Status

Your project structure is ready! Here's what's been set up:

- ✅ React + TypeScript frontend
- ✅ Go backend with Lambda handlers
- ✅ DynamoDB repository layer
- ✅ API service layer
- ✅ Basic UI components
- ✅ AWS deployment configuration

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

### Next Steps for Development

The foundation is ready. Here's what to build next:

#### 1. Create Poll Component
- Form to input poll title, description
- Dynamic candidate list (add/remove)
- Form validation
- Call `api.createPoll()` and navigate to results

#### 2. Vote Component
- Display poll details
- Drag-and-drop ranking interface (or up/down buttons)
- Submit rankings via `api.submitVote()`

#### 3. Results Component
- Fetch results with `api.getResults()`
- Display round-by-round vote counts
- Visualize winner
- Show eliminated candidates per round

#### 4. Routing
Install React Router:
```bash
cd frontend
npm install react-router-dom
```

Then set up routes:
- `/` - Home
- `/create` - Create poll
- `/poll/:id` - Vote on poll
- `/poll/:id/results` - View results

#### 5. URL Sharing
- Copy poll URL to clipboard
- QR code generation
- Social sharing buttons

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

## Recommended Libraries

For enhanced functionality:

```bash
cd frontend

# Drag and drop
npm install @dnd-kit/core @dnd-kit/sortable

# Routing
npm install react-router-dom

# Charts for results
npm install recharts

# Copy to clipboard
npm install react-copy-to-clipboard

# Icons
npm install react-icons
```

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
