import win32gui
import common
import time
import _thread


class ProgramCheck:
    def __init__(self):
        # 获取窗口句柄
        self.target_window_title = False

        self.target_window_title = "初音ミク Project DIVA Mega39's+"
        self.offset_left = 100
        self.offset_top = 100
        target_color_list = [255, 255, 255]

        # self.target_window_title = "无标题 - 画图"
        # self.offset_left = 300
        # self.offset_top = 300
        # target_color_list = [237, 28, 36]

        self.check_interval = 0.001

        # 格式化目标颜色
        self.target_pixel_color = (
            target_color_list[2] * 16**4
            + target_color_list[1] * 16**2
            + target_color_list[0]
        )

        # 获取句柄
        self.target_window_hwnd = 0
        self.get_target_hwnd()
        if not self.target_window_hwnd:
            common.pr("程序未启动", color="red")
            exit()

        # 是否终结线程
        self.listen_stop = False

        # 监听到开始Flag
        self.start_time = False
        # 设置监听像素位置
        self.pixel_info()

    ###########################################
    # 获取窗口-start
    ###########################################
    # 获取句柄
    def get_target_hwnd(self):
        self.target_window_hwnd = 0
        win32gui.EnumWindows(self.get_all_hwnd, False)
        return self.target_window_hwnd

    # 筛选句柄
    def get_all_hwnd(self, hwnd, extra):
        if (
            win32gui.IsWindow(hwnd)
            and win32gui.IsWindowEnabled(hwnd)
            and win32gui.IsWindowVisible(hwnd)
        ):
            window_title = win32gui.GetWindowText(hwnd)
            if self.target_window_title == False:
                print(window_title)
            elif window_title == self.target_window_title:
                self.target_window_hwnd = hwnd

    ###########################################
    # 获取窗口-end
    ###########################################

    # 获取开始时间
    def get_start_time(self):
        self.check_start_time = time.perf_counter()
        self.check_count = 0

        self.windows_dc = win32gui.GetWindowDC(self.target_window_hwnd)

        common.pr("开始监听")
        while not self.listen_stop and not self.start_time:
            self.check_count += 1

            res = self.pixel_check()
            # if str(res["spend_time"]) == "0.0":
            # 强制0.001秒睡眠，精确时间靠下一帧
            common.sleep(0.001)
            # sleep_res = common.precise_sleep(self.check_interval - res["spend_time"])
            # sleep_record_list.append(sleep_res)

            if res["pixel"] == self.target_pixel_color:
                next_frame_time = self.align_next_frame()

                self.start_time = next_frame_time
                # self.start_time = res["before_time"]

            # 提前终止 防止卡死
            if self.check_count >= 20000:
                common.pr("未获取到开始时间", color="red")
                self.start_time = True
                break
        # common.save_test_json(sleep_record_list, "sleep")
        if self.start_time != False and self.start_time != True:
            common.pr("获取到开始时间\t" + str(self.start_time))
        return self.start_time

    # 对齐下一帧
    def align_next_frame(self):
        start_time = time.perf_counter()
        count = 0
        # windows_dc = win32gui.GetWindowDC(self.target_window_hwnd)
        win32gui.SetPixel(self.windows_dc, 300, 300, 3750201)
        while True:
            count += 1
            pixel_color = win32gui.GetPixel(self.windows_dc, 300, 300)
            if pixel_color != 3750201:
                break
        end_time = time.perf_counter()
        return end_time

    # 停止监听线程
    def stop(self):
        self.listen_stop = True
        common.pr("强制停止监听线程", color="red")

    # 像素信息设置
    def pixel_info(self):
        wr = win32gui.GetWindowRect(self.target_window_hwnd)
        cr = win32gui.GetClientRect(self.target_window_hwnd)
        margin = int(((wr[2] - wr[0]) - cr[2]) / 2)

        self.pixel_left = self.offset_left + int(-margin / 2)
        self.pixel_top = self.offset_top + int(-margin / 2)
        self.window_width = wr[2] - wr[0]
        self.window_height = wr[3] - wr[1]

    # 像素检测
    def pixel_check(self):
        before_time = time.perf_counter()
        pixle = win32gui.GetPixel(
            self.windows_dc,
            # win32gui.GetWindowDC(self.target_window_hwnd),
            self.pixel_left,
            self.pixel_top,
        )
        after_time = time.perf_counter()

        res = {
            "before_time": before_time,
            "after_time": after_time,
            "spend_time": after_time - before_time,
            "pixel": pixle,
        }

        return res


if __name__ == "__main__":
    pc = ProgramCheck()
    print(pc.get_start_time())
    common.sleep(1)
