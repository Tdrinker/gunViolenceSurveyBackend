# gunViolenceSurveyBackend
the frontend + backend code for gun violence survey 


### connecting to dynamoDB:
* create an environment file named `.env` and place it in the root directory, fill in the access key and secret key and put region as `'us-east-1'` 

```buildoutcfg
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
REGION_NAME='us-east-1'
```

### creating a table
* Note that the tables have already been created and this step should never be run unless you deleted the tables and have to
recreate them.
* To create a table, do so with the implemented APIs. For example, if you want to create the table User:
http://127.0.0.1:5000/create-table-user
* In `create_table_task()`, we are reading the data from a csv file which did not include on the github repo for data privacy concerns.
