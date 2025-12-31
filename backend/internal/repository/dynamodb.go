package repository

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"ranked-choice-voting/internal/models"
)

type PollRepository struct {
	client    *dynamodb.Client
	tableName string
}

func NewPollRepository(client *dynamodb.Client, tableName string) *PollRepository {
	return &PollRepository{
		client:    client,
		tableName: tableName,
	}
}

func (r *PollRepository) CreatePoll(ctx context.Context, poll *models.Poll) error {
	item, err := attributevalue.MarshalMap(poll)
	if err != nil {
		return fmt.Errorf("failed to marshal poll: %w", err)
	}

	item["PK"] = &types.AttributeValueMemberS{Value: fmt.Sprintf("POLL#%s", poll.ID)}
	item["SK"] = &types.AttributeValueMemberS{Value: "METADATA"}

	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      item,
	})
	return err
}

func (r *PollRepository) GetPoll(ctx context.Context, pollID string) (*models.Poll, error) {
	result, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: fmt.Sprintf("POLL#%s", pollID)},
			"SK": &types.AttributeValueMemberS{Value: "METADATA"},
		},
	})
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, fmt.Errorf("poll not found")
	}

	var poll models.Poll
	err = attributevalue.UnmarshalMap(result.Item, &poll)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal poll: %w", err)
	}

	return &poll, nil
}

func (r *PollRepository) CreateVote(ctx context.Context, vote *models.Vote) error {
	item, err := attributevalue.MarshalMap(vote)
	if err != nil {
		return fmt.Errorf("failed to marshal vote: %w", err)
	}

	item["PK"] = &types.AttributeValueMemberS{Value: fmt.Sprintf("POLL#%s", vote.PollID)}
	item["SK"] = &types.AttributeValueMemberS{Value: fmt.Sprintf("VOTE#%s", vote.ID)}

	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      item,
	})
	return err
}

func (r *PollRepository) GetVotes(ctx context.Context, pollID string) ([]models.Vote, error) {
	result, err := r.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(r.tableName),
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: fmt.Sprintf("POLL#%s", pollID)},
			":sk": &types.AttributeValueMemberS{Value: "VOTE#"},
		},
	})
	if err != nil {
		return nil, err
	}

	var votes []models.Vote
	err = attributevalue.UnmarshalListOfMaps(result.Items, &votes)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal votes: %w", err)
	}

	return votes, nil
}
