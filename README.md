# Ranked Choice Voting Application

A full-stack ranked choice voting application with a React TypeScript frontend and Go backend deployed on AWS.

## Features

- Create polls with multiple candidates
- Cast ranked votes with drag-and-drop interface
- View real-time results with round-by-round breakdown
- Share poll links
- Anonymous voting (no authentication required)

## Tech Stack

### Frontend
- React with TypeScript
- Hosted on AWS Amplify

### Backend
- Go (Lambda functions)
- API Gateway
- DynamoDB

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│  AWS Amplify │         │   Lambda    │
│  (React)    │         │  (Frontend)  │         │  (Go API)   │
└─────────────┘         └──────────────┘         └─────────────┘
                               │                        │
                               │                        │
                               ▼                        ▼
                        ┌──────────────┐         ┌─────────────┐
                        │ CloudFront   │         │ API Gateway │
                        │     CDN      │         └─────────────┘
                        └──────────────┘                │
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │  DynamoDB   │
                                                 └─────────────┘
```

## Project Structure

```
ranked-choice/
├── frontend/              # React TypeScript application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/              # Go Lambda backend
│   ├── cmd/lambda/       # Lambda entry point
│   ├── internal/
│   │   ├── handlers/     # API handlers
│   │   ├── models/       # Data models
│   │   └── repository/   # DynamoDB repository
│   ├── template.yaml     # SAM template
│   ├── Makefile
│   └── go.mod
└── infrastructure/       # Documentation
    └── dynamodb-schema.md
```

## Local Development

### Prerequisites

- Node.js 20+ and npm
- Go 1.23+
- AWS CLI configured
- AWS SAM CLI (for backend deployment)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
cd backend
go mod download

# Build for local testing
go build -o main cmd/lambda/main.go
```

## Deployment

### Backend Deployment (Lambda + API Gateway + DynamoDB)

1. Install AWS SAM CLI if you haven't:
```bash
# On Windows (using Chocolatey)
choco install aws-sam-cli

# Or download from: https://aws.amazon.com/serverless/sam/
```

2. Deploy the backend:
```bash
cd backend
make deploy
```

This will:
- Build the Go binary for Lambda
- Create a CloudFormation stack
- Deploy Lambda function, API Gateway, and DynamoDB table
- Output your API endpoint URL

3. Save the API URL from the output (you'll need it for frontend configuration)

### Frontend Deployment (Amplify)

#### Option 1: Amplify Console (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)

3. Click "New app" → "Host web app"

4. Connect your Git repository

5. Configure build settings:
   - App name: `ranked-choice-voting`
   - Branch: `main` (or your default branch)
   - Build settings (should auto-detect):
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - cd frontend
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: frontend/build
         files:
           - '**/*'
       cache:
         paths:
           - frontend/node_modules/**/*
     ```

6. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your API Gateway URL from backend deployment

7. Click "Save and deploy"

#### Option 2: Manual S3 + CloudFront

```bash
cd frontend

# Build the app
npm run build

# Deploy to S3 (you'll need to create a bucket first)
aws s3 sync build/ s3://your-bucket-name --delete

# Configure CloudFront distribution pointing to the S3 bucket
```

## API Endpoints

- `POST /polls` - Create a new poll
- `GET /polls/{id}` - Get poll details
- `POST /polls/{id}/vote` - Submit a vote
- `GET /polls/{id}/results` - Get poll results

### Example API Usage

**Create a Poll**:
```bash
curl -X POST https://your-api-url/polls \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Programming Language 2024",
    "description": "Vote for your favorite",
    "candidates": ["JavaScript", "Python", "Go", "Rust"]
  }'
```

**Submit a Vote**:
```bash
curl -X POST https://your-api-url/polls/{pollId}/vote \
  -H "Content-Type: application/json" \
  -d '{
    "rankings": ["Go", "Rust", "Python", "JavaScript"]
  }'
```

## Database Schema

See [infrastructure/dynamodb-schema.md](infrastructure/dynamodb-schema.md) for detailed DynamoDB schema design.

## How Ranked Choice Voting Works

1. Voters rank candidates in order of preference (1st choice, 2nd choice, etc.)
2. First round: Count all first-choice votes
3. If a candidate has >50% of votes, they win
4. If not: Eliminate the candidate with fewest votes
5. Redistribute those votes to voters' next choices
6. Repeat until someone has majority

## Cost Estimates

### AWS Services (Pay-as-you-go)
- **DynamoDB**: ~$0.25 per million reads/writes (on-demand)
- **Lambda**: Free tier includes 1M requests/month
- **API Gateway**: $3.50 per million requests
- **Amplify Hosting**: ~$0.15/GB served + $0.01/build minute

**Estimated cost for small-scale usage**: $1-5/month

## Live Application

- **Frontend**: Deployed on AWS Amplify
- **Backend API**: `https://vepv8420vl.execute-api.us-east-1.amazonaws.com/prod`
- **Features**:
  - ✅ Drag-and-drop vote ranking
  - ✅ Two voting methods (IRV and Borda Count)
  - ✅ Real-time results with charts
  - ✅ Poll sharing via URL
  - ✅ Anonymous voting

## License

MIT
