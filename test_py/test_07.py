import win32api, win32con
from pynput.keyboard import Key, Controller
import time

keyboard = Controller()

key_count = 1000
val = 65

start_time = time.perf_counter()
# Press and release space
for num in range(key_count):
    if num % 2:
        # win32api.keybd_event(val, 0, win32con.KEYEVENTF_KEYUP, 0)
        keyboard.press("a")
    else:
        # win32api.keybd_event(val, 0, 0, 0)
        keyboard.release("a")
end_time = time.perf_counter()

print(end_time - start_time)
print((end_time - start_time) / key_count)