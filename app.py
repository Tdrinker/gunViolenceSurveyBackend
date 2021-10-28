import sys
import uuid

from flask import Flask, render_template, request, session, redirect, url_for
from werkzeug.exceptions import BadRequest
from argparse import ArgumentParser

from utils.form_helpers import validate_sona_form, validate_sona_consent_form
from utils.const import STUDENT_ID, CONSENT_AGREED, COUNTRY, IS_NATIVE, EDUCATION
from utils.html_texts import FORM_ERROR

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


@app.route("/sona/login", methods=["GET", "POST"])
def sona_login():
    if session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))

    if request.method == "GET":
        return render_template("sona_login.html")

    is_request_valid, msg = validate_sona_form(request.form)
    print("request.form: ", request.form)
    if not is_request_valid:
        print("bad request")
        return BadRequest(msg)

    print("before session storage")

    session[STUDENT_ID] = request.form["studentId"]
    session[COUNTRY] = request.form["country"]
    session[IS_NATIVE] = request.form["isNative"]
    session[EDUCATION] = request.form["education"]

    print("redirecting to sona_instructions")

    return redirect(url_for("sona_instructions"))


@app.route("/sona/instructions", methods=["GET", "POST"])
def sona_instructions():
    if session.get(STUDENT_ID) is None or session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))
    if request.method == "GET":
        return render_template("sona_instructions.html")

    print("redirecting to survey")
    return redirect(url_for("sona_survey"))


@app.route("/sona/survey")
def sona_survey():
    if session.get(STUDENT_ID) is None or session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))

    return render_template("sona_task_03_information.html")


@app.route("/sona/task/headline")
def sona_task_headline():
    if session.get(STUDENT_ID) is None or session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))

    return "hello world"


@app.route("/sona/task/image")
def sona_task_image():
    if session.get(STUDENT_ID) is None or session.get(CONSENT_AGREED) is None:
        return redirect(url_for("sona_informed_consent"))

    return "hello world"


if __name__ == "__main__":
    args = parser.parse_args(sys.argv[1:])

    app.run(port=5000, debug=args.debug)
