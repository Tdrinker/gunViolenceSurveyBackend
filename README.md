# gunViolenceSurveyBackend
the frontend + backend code for gun violence survey 


### connecting to dynamoDB:
* create an environment file named `.env` and place it in the root directory, fill in the access key and secret key and put region as `'us-east-1'` 

```buildoutcfg
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
REGION_NAME='us-east-1'
```

### Tables
Task_group_1:
there are 10 copies (Task_group_1, ... , Task_group_10).

    - id
    - studentId
    - samples (10 of them)
    - completed

User:

    - id
    - citizenship
    - education
    - isNative
    - task_group (a user will only receive tasks from the same task group to ensure there are no duplicates)

* When a user enters the studentId, first check the **User** table. If the user exists, go the **Task_group_m** table based on his `task_group` m. Count by the column `completed` to show how many more tasks he needs to do. Then pick a task that hasn't been completed and load the samples on the front end. If the user does not exist, add to the **User** table and assign a `task_group` that is the most vacant (the least amount of `completed` in the **Task_group_m** for some m)


* Note that the tables have already been created and this step should never be run unless you deleted the tables and have to
recreate them.

* To create a table, do so with the implemented APIs. 
    * if you want to create the table User: http://127.0.0.1:5000/create-table-user
    * if you want to create the table Task: http://127.0.0.1:5000/create-table-task
    * if you want to populate the table Task: http://127.0.0.1:5000/populate-table-task
* In `read_csv_data()`, we are reading the data from a csv file which is not include on this online repo for data privacy concerns.


