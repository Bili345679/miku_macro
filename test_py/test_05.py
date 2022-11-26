from time import perf_counter
from time import process_time
import time
import common

# time.sleep(2)
# time_1 = perf_counter()
# time.sleep(1)
# time_2 = perf_counter()
# print(time_1)
# print(time_2)
# print(time_2 - time_1)

# time_3 = process_time()
# time_4 = process_time()
# print(time_4 - time_3)

start_time = perf_counter()
last_time = start_time
now_time = start_time
update_count = 0
time_list = []
while now_time - start_time < 0.001:
    if last_time != now_time:
        last_time = now_time
        update_count += 1
        time_list.append(last_time)
    now_time = perf_counter()

common.save_test_json(time_list)