run:
	python3 app.py

dev:
	python3 app.py --debug True

dynamo_create_task:
	python3 utils/dynamodb_handler.py --task create_task

dynamo_populate_task:
	python3 utils/dynamodb_handler.py --task populate_task