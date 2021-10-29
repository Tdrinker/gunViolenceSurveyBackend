import boto3
import os
from dotenv import load_dotenv
from utils.const import STUDENT_ID, CONSENT_AGREED, COUNTRY, IS_NATIVE, EDUCATION
from typing import Dict, Tuple, Any

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
REGION_NAME = os.getenv("REGION_NAME")

client = boto3.client(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME,
)
resource = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME,
)


def create_table_user():
    client.create_table(
        AttributeDefinitions=[  # Name and type of the attributes
            {
                'AttributeName': 'id',  # Name of the attribute
                'AttributeType': 'N'  # N -> Number (S -> String, B-> Binary)
            }
        ],
        TableName='User',  # Name of the table
        KeySchema=[  # Partition key/sort key attribute
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'
                # 'HASH' -> partition key, 'RANGE' -> sort key
            }
        ],
        BillingMode='PAY_PER_REQUEST',
        Tags=[  # OPTIONAL
            {
                'Key': 'test-resource',
                'Value': 'dynamodb-test'
            }
        ]
    )


def add_user(form: Dict[str, Any]):
    user_table = resource.Table('User')

    response = user_table.put_item(
        Item={
            'id': int(form[STUDENT_ID]),
            'citizenship': form[COUNTRY],
            'isNative': form[IS_NATIVE] == "native",
            'education': form[EDUCATION]
        }
    )
    return response


def get_user(form: Dict[str, Any]):
    user_table = resource.Table('User')
    id = int(form[STUDENT_ID])

    response = user_table.get_item(
        Key={
            'id': id
        }
    )
    return response
