# Next Steps Checklist

Use this checklist to track your progress building and deploying the app.

## Immediate Setup (Do This First)

- [ ] Install AWS SAM CLI
  - Windows: `choco install aws-sam-cli`
  - Or download from: https://aws.amazon.com/serverless/sam/
  - Verify: `sam --version`

- [ ] Verify your setup works
  ```bash
  cd frontend
  npm start
  # Should open http://localhost:3000
  ```

- [ ] Push to Git (if not done)
  ```bash
  git add .
  git commit -m "Initial ranked choice voting app setup"
  git push origin main
  ```

## Backend Development

- [ ] Test backend build locally
  ```bash
  cd backend
  go build cmd/lambda/main.go
  ```

- [ ] Deploy backend to AWS
  ```bash
  cd backend
  make deploy
  ```

- [ ] Save API URL from deployment output
  - Look for: `ApiUrl` in the Outputs section
  - Example: `https://abc123.execute-api.us-east-1.amazonaws.com/prod`
  - Save this URL, you'll need it!

- [ ] Test API endpoints
  ```bash
  # Create a test poll
  curl -X POST YOUR_API_URL/polls \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","description":"Testing","candidates":["A","B","C"]}'
  ```

## Frontend Development

### Phase 1: Core Components

- [ ] Create Poll Form Component
  - Input fields for title, description
  - Dynamic candidate list (add/remove buttons)
  - Form validation
  - Call API to create poll
  - Navigate to poll URL after creation

- [ ] Vote Component
  - Display poll title and description
  - Show candidates to rank
  - Implement ranking UI (drag-drop or up/down buttons)
  - Submit vote to API
  - Show confirmation after voting

- [ ] Results Component
  - Fetch and display results from API
  - Show round-by-round vote counts
  - Highlight winner
  - Show eliminated candidates
  - Consider adding a chart/visualization

### Phase 2: Routing

- [ ] Install React Router
  ```bash
  cd frontend
  npm install react-router-dom
  ```

- [ ] Set up routes
  - `/` - Home page
  - `/create` - Create new poll
  - `/poll/:id` - Vote on poll
  - `/poll/:id/results` - View results

### Phase 3: Polish

- [ ] Add URL sharing
  - Copy to clipboard button
  - Share poll link functionality

- [ ] Improve UX
  - Loading states
  - Error handling
  - Success messages
  - Better styling

- [ ] Optional enhancements
  - Install drag-and-drop: `npm install @dnd-kit/core @dnd-kit/sortable`
  - Install charts: `npm install recharts`
  - Add icons: `npm install react-icons`

## Frontend Deployment

- [ ] Create `.env.local` file in frontend folder
  ```
  REACT_APP_API_URL=YOUR_API_URL_HERE
  ```

- [ ] Test build locally
  ```bash
  cd frontend
  npm run build
  ```

- [ ] Deploy to AWS Amplify
  1. Go to: https://console.aws.amazon.com/amplify/
  2. Click "New app" → "Host web app"
  3. Connect your Git repository
  4. Configure build settings (see DEPLOYMENT.md)
  5. Add environment variable: `REACT_APP_API_URL`
  6. Deploy!

- [ ] Test deployed app
  - Visit your Amplify URL
  - Create a poll
  - Vote on it
  - View results

## Optional Enhancements

- [ ] Add poll expiration dates
- [ ] Add poll privacy settings (public/private)
- [ ] Add QR code generation for poll sharing
- [ ] Add social media sharing buttons
- [ ] Add analytics/tracking
- [ ] Add poll closing functionality
- [ ] Add ability to view all your created polls
- [ ] Add dark mode
- [ ] Add accessibility improvements
- [ ] Add automated tests

## Monitoring & Maintenance

- [ ] Set up CloudWatch alarms
- [ ] Configure AWS billing alerts
- [ ] Monitor Lambda logs
- [ ] Monitor DynamoDB metrics
- [ ] Review and optimize costs after initial usage

## Documentation

- [ ] Add screenshots to README
- [ ] Create demo video
- [ ] Document any custom features you add
- [ ] Update architecture diagram if needed

---

## Quick Reference

### Start Frontend Dev Server
```bash
cd frontend && npm start
```

### Build Frontend
```bash
cd frontend && npm run build
```

### Build Backend
```bash
cd backend && make build
```

### Deploy Backend
```bash
cd backend && make deploy
```

### View Backend Logs
```bash
sam logs -n ApiFunction --stack-name ranked-choice-voting-backend --tail
```

---

## Stuck? Check These Docs

- [README.md](README.md) - Overview
- [QUICKSTART.md](QUICKSTART.md) - Development guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Full summary

---

**Current Status**: ✅ Project structure complete, ready for development!

**Next Action**: Install AWS SAM CLI and deploy the backend to get your API URL.
