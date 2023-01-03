import json
import time
from ProgramCheck import ProgramCheck
import common
import os
from pynput.keyboard import Key, Controller

keyboard = Controller()


class PlayBack:
    def __init__(self, main_thread):
        self.main_thread = main_thread

    def do_play_back(self):
        self.pc = False
        if self.load_record():
            self.play_back()

    # 读取记录列表
    def load_dir_file_list(self):
        self.record_list = []
        for dirpath, dirnames, filenames in os.walk(".\\record"):
            for each_file in filenames:
                self.record_list.append(each_file)

    # 选择要回放的录像
    def load_record(self):
        self.load_dir_file_list()

        num = 1
        for each_file in self.record_list:
            print(str(num) + "\t" + each_file)
            num += 1
        print("选择需要回放的录像")
        self.select = ""

        self.select_flag = False
        while not self.select_flag:
            time.sleep(1)

        if self.select_flag == -1:
            return False

        common.pr("选择回放录像: " + self.record_list[int(self.select) - 1])

        with open(".\\record\\" + self.record_list[int(self.select) - 1], "r") as file:
            self.key_time_list = json.load(file)

        return True

    # 监听键盘(用于选择录像)
    def on_press(self, key):
        if not self.select_flag:
            if key == "BACKSPACE":
                self.select = self.select[:-1]
                print("\x1b[K" + self.select, end="\r")
                return True

            if key == "ENTER":
                self.select_flag = True
                return False

            self.select += key
            print("\x1b[K" + self.select, end="\r")

    def on_release(self, key):
        pass

    # 回放
    def play_back(self):
        self.pc = ProgramCheck()
        start_time = self.pc.get_start_time()
        if start_time == True:
            return False
        last_time = 0
        common.pr("开始回放录像: " + self.record_list[int(self.select) - 1])

        holding_key_list = {}
        for each_key in self.main_thread.play_key_list:
            holding_key_list[each_key] = False

        num = 1
        # 偏差值
        difference_start = 0
        difference_end = 0
        for each in self.key_time_list:
            # 提前结束回放
            if self.main_thread.exit_all_flag or not self.main_thread.play_back_flag:
                self.release_holding_key()
                return False

            common.precise_sleep(each["time"], start_time=start_time)

            difference_start += abs(time.perf_counter() - start_time - each["time"])

            if each["press"]:
                keyboard.press(each["key"])
            else:
                keyboard.release(each["key"])

            difference_end += abs(time.perf_counter() - start_time - each["time"])

            # holding_key_list[each["key"]] = each["press"]
            # common.show_key_status(each["time"], num, holding_key_list)

            num += 1

        common.pr("录像: " + self.record_list[int(self.select) - 1] + " 回放完成")
        common.pr("回放按键数 " + str(num))
        common.pr("回放按键执行前偏差和 " + str(difference_start), "red")
        common.pr("回放按键执行后偏差和 " + str(difference_end), "red")
        self.main_thread.play_back_flag = False
        self.release_holding_key()

    def release_holding_key(self):
        for each_key in self.main_thread.play_key_list:
            keyboard.release(each_key)

    def stop_play_back(self):
        common.pr("强制停止录像回放", "red")

        self.select_flag = -1

        if self.pc:
            # 停止监听开始线程
            self.pc.stop()

        common.pr("强制停止录像回放完成", "red")


if __name__ == "__main__":
    playback = PlayBack()
