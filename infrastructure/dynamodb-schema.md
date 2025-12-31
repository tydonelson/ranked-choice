# DynamoDB Schema Design

## Table: ranked-choice-polls

**Access Pattern**: Single-table design using generic partition and sort keys

### Attributes

- **PK** (Partition Key): String - Primary partition key
- **SK** (Sort Key): String - Primary sort key
- Additional attributes stored as maps based on entity type

### Entity Patterns

#### Poll Entity
- **PK**: `POLL#{pollId}`
- **SK**: `METADATA`
- **Attributes**:
  - `id`: Poll UUID
  - `title`: Poll title
  - `description`: Poll description
  - `candidates`: List of candidate names
  - `createdAt`: ISO timestamp
  - `expiresAt`: ISO timestamp (optional)

**Example**:
```
PK: POLL#123e4567-e89b-12d3-a456-426614174000
SK: METADATA
id: 123e4567-e89b-12d3-a456-426614174000
title: "Best Programming Language 2024"
description: "Vote for your favorite programming language"
candidates: ["JavaScript", "Python", "Go", "Rust"]
createdAt: 2024-01-15T10:30:00Z
```

#### Vote Entity
- **PK**: `POLL#{pollId}`
- **SK**: `VOTE#{voteId}`
- **Attributes**:
  - `id`: Vote UUID
  - `pollId`: Reference to poll
  - `rankings`: Ordered list of candidate names (first choice to last)
  - `votedAt`: ISO timestamp

**Example**:
```
PK: POLL#123e4567-e89b-12d3-a456-426614174000
SK: VOTE#987fcdeb-51a2-43d1-b234-567890abcdef
id: 987fcdeb-51a2-43d1-b234-567890abcdef
pollId: 123e4567-e89b-12d3-a456-426614174000
rankings: ["Go", "Rust", "Python", "JavaScript"]
votedAt: 2024-01-15T14:22:00Z
```

### Query Patterns

1. **Get Poll by ID**
   - Query: `PK = POLL#{pollId} AND SK = METADATA`

2. **Get All Votes for a Poll**
   - Query: `PK = POLL#{pollId} AND begins_with(SK, "VOTE#")`

3. **Calculate Results**
   - Get poll metadata + all votes
   - Process in memory using ranked-choice algorithm

### Billing

- **Billing Mode**: PAY_PER_REQUEST (on-demand)
- No need to provision read/write capacity
- Ideal for unpredictable voting patterns

### Indexes

No GSI/LSI needed for initial version. All access patterns can be satisfied with base table queries.
