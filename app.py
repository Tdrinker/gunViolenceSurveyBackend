import sys
import uuid
import json

from flask import Flask, render_template, request, session, redirect, url_for
from werkzeug.exceptions import BadRequest
from argparse import ArgumentParser

from utils.form_helpers import validate_sona_form, validate_sona_consent_form
from utils.const import (
    STUDENT_ID,
    CONSENT_AGREED,
    COUNTRY,
    IS_NATIVE,
    EDUCATION,
    US_DURATION,
    POLITICS,
    MEDIA_TIME,
    TASK_GROUP,
    SAMPLE_ID,
    NUM_TASKS_COMPLETED,
)
from utils.html_texts import FORM_ERROR

from utils.dynamodb_handler import (
    add_user,
    get_user,
    assign_task_group,
    get_task,
    write_response,
    get_student_responses_ids,
)

app = Flask(__name__)
app.secret_key = str(uuid.uuid5(uuid.NAMESPACE_DNS, "aiem.bu.edu"))

parser = ArgumentParser()
parser.add_argument("--debug", help="Run the app in debug mode.", type=bool, default=False)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/sona")
def sona():
    return redirect(url_for("sona_informed_consent"))


@app.route("/sona/consent", methods=["POST", "GET"])
def sona_informed_consent():
    if request.method == "GET":
        return render_template("sona_informed_consent.html")

    is_request_valid, error_msg = validate_sona_consent_form(request.form)
    if not is_request_valid:
        return render_template("sona_informed_consent.html", error=FORM_ERROR.format(error_msg=error_msg))

    session[CONSENT_AGREED] = True
    return redirect(url_for("sona_login"))


def user_login(request_form):
    user = get_user(request_form)
    is_new_user = True

    if not "Item" in user:
        user = add_user(request_form)
    else:
        is_new_user = False

    return is_new_user, user


@app.route("/sona/login", methods=["GET", "POST"])
def sona_login():
    if session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))

    if request.method == "GET":
        return render_template("sona_login.html")

    is_request_valid, msg = validate_sona_form(request.form)
    if not is_request_valid:
        return BadRequest(msg)

    is_new_user, user = user_login(request.form)
    studentId = int(user["Item"]["id"])
    _, newPreviousIds = get_student_responses_ids(studentId)
    if len(newPreviousIds) >= 4:
        return render_template("all_tasks_completed.html")

    session[STUDENT_ID] = request.form["studentId"]
    session[COUNTRY] = request.form["country"]
    session[IS_NATIVE] = request.form["isNative"]
    session[EDUCATION] = request.form["education"]
    session[US_DURATION] = request.form["usDuration"]
    session[POLITICS] = request.form["politics"]
    session[MEDIA_TIME] = request.form["mediaTime"]
    session[NUM_TASKS_COMPLETED] = len(newPreviousIds)

    return render_template("sona_instructions.html", numTasksCompleted=len(newPreviousIds))


@app.route("/sona/instructions", methods=["GET"])
def sona_instructions():
    if session.get(STUDENT_ID) is None or session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))

    return render_template("sona_instructions.html")


@app.route("/sona/survey", methods=["POST", "GET"])
def sona_survey():
    if session.get(STUDENT_ID) is None or session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))

    task_group, data = get_task(session[STUDENT_ID])
    session[SAMPLE_ID] = data["id"]
    session[TASK_GROUP] = task_group

    return render_template("sona_task.html", data=data)


@app.route("/sona/survey/submit", methods=["POST"])
def sona_survey_submit():
    if session.get(STUDENT_ID) is None or session.get(TASK_GROUP) is None or session.get(SAMPLE_ID) is None:
        return redirect(url_for("sona_informed_consent"))

    sampleId = session[SAMPLE_ID]
    taskGroup = session[TASK_GROUP]
    studentId = session[STUDENT_ID]
    numTasksCompleted = session[NUM_TASKS_COMPLETED]
    numTasksCompleted += 1

    res = write_response(studentId, sampleId, taskGroup, request.form)

    if res["ResponseMetadata"]["HTTPStatusCode"] == 200:
        return render_template("submission_successful.html", numTasksCompleted=numTasksCompleted)
    else:
        return (
            "There is an error in your submission, please copy this text and email it to sejin@bu.edu for completing survey: "
            + json.dumps(
                {
                    "studentId": int(studentId),
                    "sampleId": int(sampleId),
                    "taskGroup": int(taskGroup),
                    "response": dict(form),
                }
            )
        )


@app.route("/sona/next", methods=["GET"])
def sona_next_task():
    if session.get(STUDENT_ID) is None or session.get(CONSENT_AGREED) is None or session[TASK_GROUP] is None:
        return redirect(url_for("sona_informed_consent"))

    studentId = session[STUDENT_ID]
    _, newPreviousIds = get_student_responses_ids(studentId)
    if len(newPreviousIds) >= 4:
        return render_template("all_tasks_completed.html")
    session[NUM_TASKS_COMPLETED] = len(newPreviousIds)

    previous_task_group = session[TASK_GROUP]
    task_group = assign_task_group(previous_task_group)
    session[TASK_GROUP] = task_group

    return redirect(url_for("sona_survey"))


if __name__ == "__main__":
    args = parser.parse_args(sys.argv[1:])

    app.run(port=5000, debug=args.debug)
