package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"ranked-choice-voting/internal/handlers"
	"ranked-choice-voting/internal/repository"
)

var pollHandler *handlers.PollHandler

func init() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		panic(err)
	}

	tableName := os.Getenv("TABLE_NAME")
	if tableName == "" {
		tableName = "ranked-choice-polls"
	}

	dynamoClient := dynamodb.NewFromConfig(cfg)
	repo := repository.NewPollRepository(dynamoClient, tableName)
	pollHandler = handlers.NewPollHandler(repo)
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	switch request.HTTPMethod {
	case "POST":
		if request.Resource == "/polls" {
			return pollHandler.CreatePoll(ctx, request)
		} else if request.Resource == "/polls/{id}/vote" {
			return pollHandler.CreateVote(ctx, request)
		}
	case "GET":
		if request.Resource == "/polls/{id}" {
			return pollHandler.GetPoll(ctx, request)
		} else if request.Resource == "/polls/{id}/results" {
			return pollHandler.GetResults(ctx, request)
		}
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 404,
		Body:       `{"error": "Not found"}`,
	}, nil
}

func main() {
	lambda.Start(handler)
}
