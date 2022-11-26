from ProgramCheck import ProgramCheck
import common
import json
import time


class Record:
    def __init__(self, main_thread):
        self.main_thread = main_thread
        self.key_time_list = []
        self.holding_key_list = {}
        for each_key in self.main_thread.play_key_list:
            self.holding_key_list[each_key] = False

    def do_record(self):
        self.first_key_time = False
        self.start_time_string = common.get_data_time()

        self.pc = ProgramCheck()
        self.first_key_time = self.pc.get_start_time()
        if self.first_key_time == True:
            return False
        # self.first_key_time = 1

    def record_key(self, key, press, key_time):
        # 是需要监听的按键
        if (self.first_key_time and
            key in self.main_thread.play_key_list
            # 按键当前状态先前状态是否不同于当前状态
                and not press == self.holding_key_list[key]):
            self.holding_key_list[key] = press
            spend_time = key_time - self.first_key_time
            self.key_time_list.append({
                "num": len(self.key_time_list) - 1,
                "time": spend_time,
                "key": key,
                "press": press
            })
            # common.show_key_status(spend_time, len(
            #     self.key_time_list) - 1, self.holding_key_list)

    def stop_record(self):
        self.pc.stop()
        self.first_key_time = False
        self.main_thread.record_flag = False

        if self.key_time_list:
            common.pr("正在保存录像")
            json_file_name = self.start_time_string + ".json"
            with open("./record/" + json_file_name, "w+") as file:
                json.dump(self.key_time_list, file)
            common.pr("保存成功")
