import sys
import uuid

from flask import Flask, render_template, request, session
from werkzeug.exceptions import BadRequest
from argparse import ArgumentParser

from utils.form_helpers import validate_sona_form
from utils.const import STUDENT_ID, FIRST_NAME, LAST_NAME

app = Flask(__name__)
app.secret_key = str(uuid.uuid5(uuid.NAMESPACE_DNS, "aiem.bu.edu"))

parser = ArgumentParser()
parser.add_argument("--debug", help="Run the app in debug mode.", type=bool, default=False)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/sona")
def sona():
    return render_template("sona.html")


@app.route("/sona/login", methods=["POST"])
def sona_login():
    is_request_valid, msg = validate_sona_form(request.form)
    if not is_request_valid:
        return BadRequest(msg)

    session[STUDENT_ID] = request.form["studentId"]
    session[FIRST_NAME] = request.form["firstName"]
    session[LAST_NAME] = request.form["lastName"]

    return "hello world"


if __name__ == "__main__":
    args = parser.parse_args(sys.argv[1:])

    app.run(port=5000, debug=args.debug)
