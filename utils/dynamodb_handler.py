import boto3
import os
from dotenv import load_dotenv
from typing import Dict, Tuple, Any
import pandas as pd
from os.path import abspath
import uuid
import random

from argparse import ArgumentParser
import sys
from utils.const import STUDENT_ID, CONSENT_AGREED, COUNTRY, IS_NATIVE, EDUCATION

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
REGION_NAME = os.getenv("REGION_NAME")


parser = ArgumentParser()
parser.add_argument("--task", help="Task to be ran, options: create_task, populate_task", type=str, default="")

client = boto3.client(
    "dynamodb",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME,
)
resource = boto3.resource(
    "dynamodb",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME,
)


def read_csv_data():
    path1 = abspath(".") + "/data/aiem_gv_data_sheet_testing.csv"

    df = pd.read_csv(path1)
    return df


def create_table_task_group(group_num):
    client.create_table(
        AttributeDefinitions=[  # Name and type of the attributes
            {
                "AttributeName": "id",  # Name of the attribute
                "AttributeType": "N",  # N -> Number (S -> String, B-> Binary)
            }
        ],
        TableName="Task_group_" + str(group_num),  # Name of the table
        KeySchema=[  # Partition key/sort key attribute
            {
                "AttributeName": "id",
                "KeyType": "HASH"
                # 'HASH' -> partition key, 'RANGE' -> sort key
            }
        ],
        BillingMode="PAY_PER_REQUEST",
    )


def populate_table_task_group(df, group_num):
    task_table = resource.Table("Task_group_" + str(group_num))
    count = 1
    # iterate through all tasks
    for index, task in df.iterrows():
        all_samples_in_task = []
        # 10 samples of each task
        for i in range(1, 11):
            img_url = "img_url_" + str(i)
            question_url = "question_" + str(i)
            all_samples_in_task.append({img_url: task[img_url], question_url: task[question_url]})
        task_table.put_item(Item={"id": count, "studentId": 0, "samples": all_samples_in_task, "completed": "False"})
        count += 1


def create_table_task():
    for i in range(21, 31):
        create_table_task_group(i)


def populate_table_task():
    df = read_csv_data()
    for i in range(21, 31):
        populate_table_task_group(df, i)


def create_table_user():
    client.create_table(
        AttributeDefinitions=[  # Name and type of the attributes
            {
                "AttributeName": "id",  # Name of the attribute
                "AttributeType": "N",  # N -> Number (S -> String, B-> Binary)
            }
        ],
        TableName="User",  # Name of the table
        KeySchema=[  # Partition key/sort key attribute
            {
                "AttributeName": "id",
                "KeyType": "HASH"
                # 'HASH' -> partition key, 'RANGE' -> sort key
            }
        ],
        BillingMode="PAY_PER_REQUEST",
        Tags=[{"Key": "test-resource", "Value": "dynamodb-test"}],  # OPTIONAL
    )


def add_user(form: Dict[str, Any], previous_task_group=0):
    user_table = resource.Table("User")

    response = user_table.put_item(
        Item={
            "id": int(form[STUDENT_ID]),
            "citizenship": form[COUNTRY],
            "isNative": form[IS_NATIVE] == "native",
            "education": form[EDUCATION],
            "previous_task_group": 0,
        }
    )

    return get_user(form)


def assign_task_group(previous_task_group=0):
    task_group = 0

    if previous_task_group == 0:
        task_group = get_group_count()
    elif previous_task_group >= 1 and previous_task_group <= 10:
        task_group = get_group_count(min_group=1, max_group=10)
    elif previous_task_group >= 11 and previous_task_group <= 20:
        task_group = get_group_count(min_group=11, max_group=20)
    elif previous_task_group >= 21 and previous_task_group <= 30:
        task_group = get_group_count(min_group=21, max_group=30)

    return task_group


def get_task(task_group, student_id):
    ts = resource.Table("Task_group_" + str(task_group))
    res = ts.scan()

    for item in res["Items"]:
        if item["completed"] == "False":
            return item

    return None


def get_group_count(min_group=1, max_group=30):
    minimal_task_group = 0
    minimal_task_group_count = 200
    for i in range(min_group, max_group + 1):
        ts = resource.Table("Task_group_" + str(i))
        res = ts.scan(
            Select="COUNT", ScanFilter={"completed": {"AttributeValueList": [True], "ComparisonOperator": "EQ"}}
        )
        if res["Count"] < minimal_task_group_count:
            minimal_task_group = i
            minimal_task_group_count = res["Count"]
        elif res["Count"] == minimal_task_group_count:
            minimal_task_group = random.choice([minimal_task_group, i])

    return minimal_task_group


def get_user(form: Dict[str, Any]):
    user_table = resource.Table("User")
    id = int(form[STUDENT_ID])

    response = user_table.get_item(Key={"id": id})

    return response


if __name__ == "__main__":
    args = parser.parse_args(sys.argv[1:])

    if args.task == "":
        print("please provide a task to be ran, with --task option.")
    elif args.task == "create_task":
        create_table_task()
    elif args.task == "populate_task":
        populate_table_task()
