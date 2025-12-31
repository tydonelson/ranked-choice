package models

import "time"

type Poll struct {
	ID          string    `json:"id" dynamodbav:"id"`
	Title       string    `json:"title" dynamodbav:"title"`
	Description string    `json:"description" dynamodbav:"description"`
	Candidates  []string  `json:"candidates" dynamodbav:"candidates"`
	CreatedAt   time.Time `json:"createdAt" dynamodbav:"createdAt"`
	ExpiresAt   time.Time `json:"expiresAt,omitempty" dynamodbav:"expiresAt,omitempty"`
}

type Vote struct {
	ID        string   `json:"id" dynamodbav:"id"`
	PollID    string   `json:"pollId" dynamodbav:"pollId"`
	Rankings  []string `json:"rankings" dynamodbav:"rankings"` // Ordered list of candidate IDs
	VotedAt   time.Time `json:"votedAt" dynamodbav:"votedAt"`
}

type PollResults struct {
	PollID              string         `json:"pollId"`
	TotalVotes          int            `json:"totalVotes"`
	Rounds              []Round        `json:"rounds"`
	Winner              string         `json:"winner,omitempty"`
	BordaCount          map[string]int `json:"bordaCount"`
	BordaWinner         string         `json:"bordaWinner,omitempty"`
}

type Round struct {
	RoundNumber int                `json:"roundNumber"`
	Votes       map[string]int     `json:"votes"` // candidate -> vote count
	Eliminated  string             `json:"eliminated,omitempty"`
}
