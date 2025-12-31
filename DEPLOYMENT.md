# Deployment Guide

Step-by-step instructions to deploy your Ranked Choice Voting application to AWS.

## Prerequisites Checklist

- [x] AWS account created
- [x] AWS CLI installed and configured
- [x] Node.js and npm installed
- [x] Go installed
- [ ] AWS SAM CLI installed
- [ ] Git repository pushed to GitHub/GitLab/Bitbucket

## Step 1: Install AWS SAM CLI

AWS SAM (Serverless Application Model) makes it easy to deploy Lambda functions.

### Windows (using Chocolatey)
```bash
choco install aws-sam-cli
```

### Windows (Manual)
Download the MSI installer from: https://aws.amazon.com/serverless/sam/

### Verify Installation
```bash
sam --version
```

## Step 2: Deploy Backend

Navigate to the backend directory and deploy:

```bash
cd backend
make deploy
```

This will:
1. Prompt you for configuration (first time only):
   - Stack Name: `ranked-choice-voting-backend`
   - AWS Region: Choose your preferred region (e.g., `us-east-1`)
   - Confirm changes before deploy: `Y`
   - Allow SAM CLI IAM role creation: `Y`
   - Disable rollback: `N`
   - Save arguments to configuration file: `Y`

2. Build the Go binary for Lambda (Linux ARM64)
3. Create a CloudFormation stack
4. Deploy all resources

### Important: Save Your API URL

After deployment completes, you'll see output like:
```
Outputs
--------
Key                 ApiUrl
Description         API Gateway endpoint URL
Value               https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

**Copy this API URL** - you'll need it for the frontend configuration.

### Subsequent Deployments

After the first deployment, you can use:
```bash
cd backend
make deploy-no-confirm
```

## Step 3: Test Backend API

Test that your API is working:

```bash
# Replace with your actual API URL
API_URL="https://your-api-url.execute-api.us-east-1.amazonaws.com/prod"

# Create a test poll
curl -X POST $API_URL/polls \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Poll",
    "description": "Testing the API",
    "candidates": ["Option A", "Option B", "Option C"]
  }'
```

You should get a JSON response with a poll ID.

## Step 4: Push Code to Git

If you haven't already:

```bash
git add .
git commit -m "Initial ranked choice voting app"
git push origin main
```

## Step 5: Deploy Frontend to Amplify

### 5.1 Open Amplify Console

Go to: https://console.aws.amazon.com/amplify/

### 5.2 Create New App

1. Click "New app" → "Host web app"
2. Select your Git provider (GitHub, GitLab, Bitbucket, etc.)
3. Authorize AWS Amplify to access your repositories
4. Select your repository: `ranked-choice`
5. Select branch: `main` (or your default branch)

### 5.3 Configure Build Settings

Amplify should auto-detect React. Update the build settings:

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

### 5.4 Add Environment Variables

Before deploying, add environment variable:

1. Click "Advanced settings"
2. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your API Gateway URL from Step 2 (without trailing slash)
   - Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`

### 5.5 Deploy

1. Click "Next" → "Save and deploy"
2. Wait for build to complete (3-5 minutes)
3. Your app will be available at: `https://main.xxxxx.amplifyapp.com`

## Step 6: Configure Custom Domain (Optional)

### In Amplify Console:

1. Go to your app
2. Click "Domain management"
3. Click "Add domain"
4. Enter your domain (e.g., `votingapp.com`)
5. Follow DNS configuration instructions
6. Wait for SSL certificate provisioning (up to 24 hours)

## Step 7: Verify Deployment

Test the full application:

1. Open your Amplify URL
2. Create a poll
3. Submit some votes
4. View results

## Updating Your Application

### Update Backend
```bash
cd backend
# Make your code changes
make deploy-no-confirm
```

### Update Frontend
Simply push to your Git repository:
```bash
git add .
git commit -m "Update frontend"
git push
```

Amplify will automatically build and deploy your changes.

## Monitoring and Logs

### Backend Logs (Lambda)
```bash
# View logs
sam logs -n ApiFunction --stack-name ranked-choice-voting-backend --tail

# Or in AWS Console
# Go to CloudWatch → Log Groups → /aws/lambda/ranked-choice-voting-backend-ApiFunction-xxx
```

### Frontend Logs
In Amplify Console → Your App → Build history

### DynamoDB Metrics
Go to DynamoDB Console → Tables → ranked-choice-polls → Metrics

## Troubleshooting

### Backend deployment fails
- Ensure AWS CLI is configured: `aws sts get-caller-identity`
- Check you have necessary IAM permissions
- Try: `sam validate` to check template syntax

### Frontend build fails
- Check environment variable is set correctly
- Verify build command in amplify.yml
- Check build logs in Amplify Console

### CORS errors
- Verify API URL in frontend environment variable
- Check API Gateway CORS configuration in template.yaml

## Cost Management

Monitor your AWS costs:
- Set up billing alerts in AWS Billing Console
- Expected costs for low traffic: $1-5/month
- DynamoDB on-demand pricing: Only pay for what you use

## Clean Up Resources

To avoid ongoing charges, delete resources when done testing:

```bash
# Delete backend stack
aws cloudformation delete-stack --stack-name ranked-choice-voting-backend

# Delete Amplify app
# Go to Amplify Console → Your App → Actions → Delete app
```
