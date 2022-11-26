import common
import time

last_time = False
while 1:
    now = time.perf_counter()
    if not last_time == now:
        last_time = now
        print(time.perf_counter())
