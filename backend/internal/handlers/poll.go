package handlers

import (
	"context"
	"encoding/json"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/uuid"
	"ranked-choice-voting/internal/models"
	"ranked-choice-voting/internal/repository"
)

type PollHandler struct {
	repo *repository.PollRepository
}

func NewPollHandler(repo *repository.PollRepository) *PollHandler {
	return &PollHandler{repo: repo}
}

type CreatePollRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Candidates  []string `json:"candidates"`
}

func (h *PollHandler) CreatePoll(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var req CreatePollRequest
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return errorResponse(400, "Invalid request body"), nil
	}

	if req.Title == "" || len(req.Candidates) < 2 {
		return errorResponse(400, "Title is required and at least 2 candidates are needed"), nil
	}

	poll := &models.Poll{
		ID:          uuid.New().String(),
		Title:       req.Title,
		Description: req.Description,
		Candidates:  req.Candidates,
		CreatedAt:   time.Now(),
	}

	if err := h.repo.CreatePoll(ctx, poll); err != nil {
		return errorResponse(500, "Failed to create poll"), nil
	}

	return jsonResponse(201, poll), nil
}

func (h *PollHandler) GetPoll(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	pollID := request.PathParameters["id"]
	if pollID == "" {
		return errorResponse(400, "Poll ID is required"), nil
	}

	poll, err := h.repo.GetPoll(ctx, pollID)
	if err != nil {
		return errorResponse(404, "Poll not found"), nil
	}

	return jsonResponse(200, poll), nil
}

type CreateVoteRequest struct {
	Rankings []string `json:"rankings"`
}

func (h *PollHandler) CreateVote(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	pollID := request.PathParameters["id"]
	if pollID == "" {
		return errorResponse(400, "Poll ID is required"), nil
	}

	var req CreateVoteRequest
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return errorResponse(400, "Invalid request body"), nil
	}

	if len(req.Rankings) == 0 {
		return errorResponse(400, "Rankings are required"), nil
	}

	vote := &models.Vote{
		ID:       uuid.New().String(),
		PollID:   pollID,
		Rankings: req.Rankings,
		VotedAt:  time.Now(),
	}

	if err := h.repo.CreateVote(ctx, vote); err != nil {
		return errorResponse(500, "Failed to create vote"), nil
	}

	return jsonResponse(201, vote), nil
}

func (h *PollHandler) GetResults(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	pollID := request.PathParameters["id"]
	if pollID == "" {
		return errorResponse(400, "Poll ID is required"), nil
	}

	poll, err := h.repo.GetPoll(ctx, pollID)
	if err != nil {
		return errorResponse(404, "Poll not found"), nil
	}

	votes, err := h.repo.GetVotes(ctx, pollID)
	if err != nil {
		return errorResponse(500, "Failed to get votes"), nil
	}

	results := calculateResults(poll, votes)
	return jsonResponse(200, results), nil
}

func calculateResults(poll *models.Poll, votes []models.Vote) *models.PollResults {
	results := &models.PollResults{
		PollID:     poll.ID,
		TotalVotes: len(votes),
		Rounds:     []models.Round{},
	}

	if len(votes) == 0 {
		return results
	}

	// Create a map of active votes (votes that haven't been eliminated)
	activeVotes := make([][]string, len(votes))
	for i, vote := range votes {
		activeVotes[i] = make([]string, len(vote.Rankings))
		copy(activeVotes[i], vote.Rankings)
	}

	eliminated := make(map[string]bool)
	roundNum := 1

	for {
		// Count first-choice votes for remaining candidates
		voteCounts := make(map[string]int)
		for _, candidate := range poll.Candidates {
			if !eliminated[candidate] {
				voteCounts[candidate] = 0
			}
		}

		for _, rankings := range activeVotes {
			// Find the first non-eliminated candidate
			for _, candidate := range rankings {
				if !eliminated[candidate] {
					voteCounts[candidate]++
					break
				}
			}
		}

		round := models.Round{
			RoundNumber: roundNum,
			Votes:       voteCounts,
		}

		// Check if anyone has majority
		totalActive := len(activeVotes)
		for candidate, count := range voteCounts {
			if count > totalActive/2 {
				results.Winner = candidate
				results.Rounds = append(results.Rounds, round)
				return results
			}
		}

		// Find candidate with fewest votes to eliminate
		minVotes := totalActive + 1
		var toEliminate string
		for candidate, count := range voteCounts {
			if count < minVotes {
				minVotes = count
				toEliminate = candidate
			}
		}

		// If only one candidate left, they win
		if len(voteCounts) == 1 {
			for candidate := range voteCounts {
				results.Winner = candidate
			}
			results.Rounds = append(results.Rounds, round)
			return results
		}

		round.Eliminated = toEliminate
		results.Rounds = append(results.Rounds, round)
		eliminated[toEliminate] = true
		roundNum++
	}
}

func jsonResponse(statusCode int, body interface{}) events.APIGatewayProxyResponse {
	jsonBody, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(jsonBody),
	}
}

func errorResponse(statusCode int, message string) events.APIGatewayProxyResponse {
	return jsonResponse(statusCode, map[string]string{"error": message})
}
