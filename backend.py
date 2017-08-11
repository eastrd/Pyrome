from flask import Flask, request, render_template
from os import getcwd, system, remove
import subprocess
#from html import escape


def GeneratePythonCode(UserCode):
    # Generate Python code with appropriate Error handling from User uploaded code
    PythonCodeBase = """
from os import system as command
nprint = print
from pprint import pprint as print
try:
***CODE GOES HERE***
except Exception as e:
    nprint("An error occurred:\\n\\t" + str(e))
    """
    # print(UserCode.split("\n"))
    UserCode = "\n".join(["\t" + line for line in UserCode.split("\n")])
    return PythonCodeBase.replace("***CODE GOES HERE***", UserCode)


app = Flask(__name__)


@app.route("/run", methods=["POST"])
def run():
    code = request.form["Python"]
    with open("test.py", "w+") as fTemp:
        fTemp.write(GeneratePythonCode(code))
    currentDir = getcwd() + "/"
    try:
        CodeOutput = subprocess.check_output("python " + currentDir +
                                         "test.py").decode("utf-8")
    except subprocess.CalledProcessError as e:
        # In the case where the given code results in error,
        #  this catches that error and outputs it back to user.
        CodeOutput = str(e.output)
    # Clean up the script file and output log
    remove(currentDir + "test.py")
    return CodeOutput


@app.route("/load", methods=["POST"])
def load():
    ans = request.form["Script"]
    return ans


app.run(port=12345)
