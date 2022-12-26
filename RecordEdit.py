from flask import Flask, render_template, send_from_directory, request
import common
import os

app = Flask(__name__)


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
    record_list = common.scaner_folder("./record")
    return record_list

# 编辑记录列表
@app.route("/ajax/load_record_edit_list", methods=["GET", "POST"])
def ajax__load_record_edit_list():
    record_list = common.scaner_folder("./record_edit_save_data")
    return record_list


if __name__ == "__main__":
    app.run(debug=True)
