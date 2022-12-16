from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)


@app.route("/")
def index():
    return send_from_directory("./web/", "record_edit.html")


@app.route("/<path:path>")
def index2(path):
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
        app.logger.info("fuck")
        return send_from_directory(
            "./web/static/lib/mediainfo/", os.path.basename(path)
        )
    return send_from_directory("./", path)


if __name__ == "__main__":
    app.run(debug=True)
