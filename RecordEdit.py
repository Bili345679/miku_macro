import json
import time
from flask import Flask, render_template, send_from_directory, request
import common
import os

app = Flask(__name__)
# app.config["MAX_CONTENT_LENGTH"] = 16 * 1000 * 1000


@app.route("/")
def index():
    return send_from_directory("./web/", "record_edit.html")


@app.route("/<path:path>")
def static_file(path):
    app.logger.info(os.path.basename(path))
    media_info_module_file_list = [
        "cli.js",
        "mediainfo.d.ts",
        "mediainfo.js",
        "mediainfo.js.map",
        "mediainfo.min.js",
        "MediaInfoModule.wasm",
        "types.d.ts",
    ]
    if os.path.basename(path) in media_info_module_file_list:
        return send_from_directory(
            "./web/static/lib/mediainfo/", os.path.basename(path)
        )
    return send_from_directory("./", path)


# 记录列表
@app.route("/ajax/load_record_list", methods=["GET", "POST"])
def ajax__load_record_list():
    try:
        record_list = common.scaner_folder("./record")[0]
    except Exception:
        os.mkdir("./record")
        record_list = []
    return record_list


# 编辑记录列表
@app.route("/ajax/load_record_edit_list", methods=["GET", "POST"])
def ajax__load_record_edit_list():
    try:
        record_list = common.scaner_folder(
            "./record_edit", son_scan=True, path_length="only_filename"
        )[0]
    except Exception:
        os.mkdir("./record_edit")
        record_list = []

    return record_list


# 保存编辑记录
@app.route("/ajax/save_record_edit", methods=["POST"])
def ajax__save_record_edit():
    with open("./record_edit/" + request.form["file_name"] + ".json", "w+") as file:
        file.write(request.form["beat_key_time_list"])

    return {"code": 200}


# 读取编辑记录
@app.route("/ajax/load_record_edit", methods=["POST"])
def ajax__load_record_edit():
    record_edit_file_name = "./record_edit/" + request.form["file_name"] + ".json"
    if not os.path.exists(record_edit_file_name):
        return []

    with open(record_edit_file_name, "r") as file:
        record_edit_data = json.load(file)

    return record_edit_data


if __name__ == "__main__":
    app.run(debug=True)
