import sys

from flask import Flask, render_template, request
from argparse import ArgumentParser

app = Flask(__name__)

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
    return "hello world"


if __name__ == "__main__":
    args = parser.parse_args(sys.argv[1:])

    app.run(port=5000, debug=args.debug)
