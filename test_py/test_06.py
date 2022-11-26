from pynput.keyboard import Key, Controller
import time

keyboard = Controller()
key_count = 1000

start_time = time.perf_counter()
# Press and release space
for num in range(key_count):
    if num % 2:
        keyboard.release(Key.space)
    else:
        keyboard.press(Key.space)
end_time = time.perf_counter()

print(end_time - start_time)
print((end_time - start_time) / key_count)