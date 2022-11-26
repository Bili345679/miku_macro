import random
import common
import win32gui
import time

target_hwnd = 0


def e_w_call_back(hwnd, extra):
    global target_hwnd
    if (
        win32gui.IsWindow(hwnd)
        and win32gui.IsWindowEnabled(hwnd)
        and win32gui.IsWindowVisible(hwnd)
    ):
        window_title = win32gui.GetWindowText(hwnd)
        # print(window_title, hwnd)
        if window_title == "无标题 - 画图":
        # if window_title == "初音ミク Project DIVA Mega39's+":
            target_hwnd = hwnd


win32gui.EnumWindows(e_w_call_back, False)

print("------------")
# color = random.randint(0, 16777215)
# start_time = time.time()
# for x in range(10):
#     for y in range(10):
#         win32gui.SetPixel(win32gui.GetWindowDC(target_hwnd), 300 + x, 300 + y, 16711680)
##########################################################
# # dc有效时间
# count = 0
# dc = win32gui.GetWindowDC(target_hwnd)
# while True:
#     count += 1
#     common.tiny_sleep()
#     try:
#         pixel_color = win32gui.GetPixel(dc, 300, 300)
#     except:
#         break
# end_time = time.time()
# print(end_time - start_time)
# print((end_time - start_time) / count)
# exit()
##########################################################
# # 对齐下一帧
# count = 0
# dc = win32gui.GetWindowDC(target_hwnd)
# for num in range(100):
#     count += 1
#     win32gui.SetPixel(dc, 300, 300, 0)
#     pixel_color = win32gui.GetPixel(dc, 300, 300)
#     print(pixel_color)
#     if pixel_color != 0:
#         print("color")
#         break
# end_time = time.time()
# print(end_time - start_time)
# print((end_time - start_time) / count)
# exit()
##########################################################
# start_time = time.time()
# while time.time() == start_time:
#     pass
# end_time = time.time()

# print(end_time - start_time)
# exit()
##########################################################
# start_time = time.time()
# time.sleep(0.1)
# end_time = time.time()
# print(end_time - start_time)
# exit()
##########################################################
start_time = time.perf_counter()
check_totla = 1000
dc = win32gui.GetWindowDC(target_hwnd)
count = 0
while count < check_totla:
    count += 1
    win32gui.GetPixel(dc, 300, 300)
end_time = time.perf_counter()
print(end_time - start_time)
print((end_time - start_time) / check_totla)
exit()
##########################################################

target_color = hex(color).replace("0x", "")
pixel = hex(win32gui.GetPixel(win32gui.GetWindowDC(target_hwnd), 300, 300)).replace(
    "0x", ""
)
print(target_color[4:6], target_color[2:4], target_color[0:2])
print(pixel[4:6], pixel[2:4], pixel[0:2])

print(end_time - start_time)

exit()

start_time = time.time()
color = win32gui.GetPixel(win32gui.GetDC(win32gui.GetActiveWindow()), 1, 1)
end_time = time.time()

print(color)
print(start_time)
print(end_time)
print(end_time - start_time)

print(win32gui.GetActiveWindow())
print(win32gui.GetDC(win32gui.GetActiveWindow()))
