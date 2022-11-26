from KeyListen import KeyListen
from Record import Record
from PlayBack import PlayBack
import common
import time
import _thread


class MikuMacro:
    def __init__(self):
        self.exit_all_flag = False

        # 需要监听的按键
        self.play_key_list = [
            "q",
            "w",
            "e",
            "a",
            "s",
            "d",
            "u",
            "i",
            "o",
            "j",
            "k",
            "l",
        ]

        # 键盘监听
        self.key_listen = KeyListen(self)

        # 录像
        self.record_flag = False
        self.record = Record(self)

        # 回放
        self.play_back_flag = False
        self.play_back = PlayBack(self)

        common.pr("初始化完成")

        while not self.exit_all_flag:
            time.sleep(1)

    # 键盘事件
    def keyboard_event(self, key, press, key_time):
        if self.record_flag and "record" in self.key_for(key):
            self.record.record_key(key, press, key_time)
            return True

        if press:
            if self.play_back_flag and "play_back" in self.key_for(key):
                self.play_back.on_press(key)
                return True
        else:
            if self.play_back_flag and "play_back" in self.key_for(key):
                self.play_back.on_release(key)
                return True

    def key_for(self, key):
        if key.isdigit() or key in ["ENTER", "BACKSPACE"]:
            return ["play_back"]

        if key in self.play_key_list:
            return ["record"]

    # 执行录像
    def do_record(self):
        if self.play_back_flag:
            common.pr("正在执行回放，无法切换录像状态", "red")
            return False

        if self.record_flag:
            common.pr("停止录像线程", color="red")
            self.record_flag = False
            # self.record.stop_record()
            _thread.start_new_thread(self.record.stop_record, ())
        else:
            common.pr("开始录像线程")
            self.record_flag = True
            # self.record.do_record()
            _thread.start_new_thread(self.record.do_record, ())

    # 执行回放
    def do_playback(self):
        if self.record_flag:
            common.pr("正在执行录像，无法切换回放状态", "red")
            return False

        if self.play_back_flag:
            common.pr("停止回放线程", color="red")
            self.play_back_flag = False
            _thread.start_new_thread(self.play_back.stop_play_back, ())
        else:
            common.pr("开始回放线程")
            self.play_back_flag = True
            _thread.start_new_thread(self.play_back.do_play_back, ())

    # 退出所有线程
    def exit_all(self):
        common.pr("正在关闭", "red")
        self.key_listen.stop_listen()
        common.pr("已关闭键盘监听", "red")

        if self.record_flag:
            common.pr("停止录像线程", color="red")
            self.record_flag = False
            # self.record.stop_record()
            _thread.start_new_thread(self.record.stop_record, ())

        if self.play_back_flag:
            common.pr("停止回放线程", color="red")
            self.play_back_flag = False
            _thread.start_new_thread(self.play_back.stop_play_back, ())

        self.exit_all_flag = True
        common.pr("正在退出主线程", "red")
        exit()


if __name__ == "__main__":
    miku_macro = MikuMacro()
