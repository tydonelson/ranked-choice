# URL Routing Structure

Your app now supports proper URL routing! You can share links and bookmark polls.

## Routes

### Home Page
```
http://localhost:3000/
```
- Welcome page with feature overview
- Call to action to create a poll

### Create Poll
```
http://localhost:3000/create
```
- Form to create a new poll
- After creation, automatically redirects to `/poll/{id}`

### Poll Page (Vote)
```
http://localhost:3000/poll/{poll-id}
```
- Vote on a specific poll
- Shows poll title, description, and candidates
- Drag-and-drop ranking interface
- After voting, redirects to `/poll/{poll-id}/results`

### Results Page
```
http://localhost:3000/poll/{poll-id}/results
```
- View results for a specific poll
- Round-by-round breakdown
- Winner announcement
- **Copy Poll Link** button to share with others

## How It Works

### Creating and Sharing a Poll

1. User goes to `/create`
2. Fills out the form (title, description, candidates)
3. Clicks "Create Poll"
4. Automatically redirected to `/poll/{new-poll-id}`
5. User can vote or click "Results" tab
6. On Results page, click "📋 Copy Poll Link" button
7. Share that link with others!

### Voting on a Shared Poll

1. Recipient receives link: `https://your-site.com/poll/abc-123`
2. Opens link
3. Sees poll details and votes
4. Can switch between "Vote" and "Results" tabs

### Viewing Past Results

Just bookmark or save the results URL:
```
https://your-site.com/poll/{poll-id}/results
```

## Tab Navigation

The poll page has two tabs:
- **Vote** - `/poll/{id}` - Cast your vote
- **Results** - `/poll/{id}/results` - View results

You can switch between them anytime, and the URL updates accordingly.

## URL Examples

```
Local development:
http://localhost:3000/
http://localhost:3000/create
http://localhost:3000/poll/e8d045f1-e7c7-46c0-b5a1-d63abd084a57
http://localhost:3000/poll/e8d045f1-e7c7-46c0-b5a1-d63abd084a57/results

Production (after Amplify deployment):
https://main.xxxxx.amplifyapp.com/
https://main.xxxxx.amplifyapp.com/create
https://main.xxxxx.amplifyapp.com/poll/e8d045f1-e7c7-46c0-b5a1-d63abd084a57
https://main.xxxxx.amplifyapp.com/poll/e8d045f1-e7c7-46c0-b5a1-d63abd084a57/results
```

## Browser History

All routing uses React Router's `BrowserRouter`, which means:
- ✅ Clean URLs (no `#` hash)
- ✅ Browser back/forward buttons work
- ✅ Bookmarkable URLs
- ✅ Can refresh on any page

## Sharing Workflow

1. Create a poll
2. Vote (or skip to results)
3. Click "📋 Copy Poll Link"
4. Share via:
   - Email
   - Slack/Discord
   - Text message
   - Social media
5. Recipients can vote and see results

## Technical Details

- Uses `react-router-dom` v6
- `BrowserRouter` for clean URLs
- `useParams()` to extract poll ID from URL
- `useNavigate()` for programmatic navigation
- `Link` components for navigation buttons
