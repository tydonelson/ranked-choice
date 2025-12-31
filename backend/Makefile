.PHONY: build deploy clean

build:
	GOOS=linux GOARCH=amd64 go build -tags lambda.norpc -o bootstrap cmd/lambda/main.go
	zip function.zip bootstrap

deploy: build
	sam deploy --guided

deploy-no-confirm: build
	sam deploy --no-confirm-changeset

clean:
	rm -f bootstrap function.zip
