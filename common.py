import random
import time
from termcolor import colored
import os
import threading
import _thread
import json

os.system("color")

# 记录测试json
def save_test_json(data, name=""):
    with open("./test_json/" + get_data_time() + "_" + name + ".json", "w+") as file:
        json.dump(data, file)


# 仿php array_column
def dict_column(dict, colum):
    return list(map(lambda each: each[colum], dict))


# 大约一毫秒小睡
def tiny_sleep():
    start_time = time.time()
    while time.time() == start_time:
        pass


def sleep(sleep_time=False, sleep_to=False, start_time=False, early_wake=False):
    if not start_time:
        start_time = time.time()

    if sleep_time:
        # 从睡眠时间算醒来时间
        sleep_to = sleep_time + start_time
    elif not sleep_to:
        # 既没有睡眠时间，也没有醒来时间，直接退出
        return False

    # 当前时间
    now_time = time.time()

    # 是否允许提前醒来
    if early_wake:
        # 间隔和
        interval_sum = 0
        # 间隔次数
        interval_count = 0
        # 最后更新时间
        last_time = now_time
        avg_interval = False

    # 苏醒方式
    wake_type = 1
    time_list = [now_time]
    # 在当前时间小于目标时间时循环
    while now_time < sleep_to:
        # 如果时间更新
        if early_wake and not last_time == now_time:
            time_list.append(now_time)
            # 增加间隔和
            interval_sum += now_time - last_time
            # 增加间隔次数
            interval_count += 1
            # 平均间隔
            avg_interval = interval_sum / interval_count
            # 预测下一次更新是否会超过目标时间
            if avg_interval + now_time > sleep_to:
                wake_type = 2
                break
            last_time = now_time
        # 再次获取当前时间
        now_time = time.time()

    res = {
        "sleep_time": sleep_time,
        "sleep_to": sleep_to,
        "start_time": start_time,
        "real_sleep_time": time.time() - start_time,
        "wake_time": time.time(),
        "wake_type": wake_type,
    }
    if early_wake:
        res["avg_interval"] = avg_interval
        res["interval_sum"] = interval_sum
        res["interval_count"] = interval_count
    return res


def precise_sleep(sleep_time=False, sleep_to=False, start_time=False):
    if not start_time:
        start_time = time.perf_counter()

    if sleep_time:
        # 从睡眠时间算醒来时间
        sleep_to = sleep_time + start_time
    elif not sleep_to:
        # 既没有睡眠时间，也没有醒来时间，直接退出
        return False

    # 在当前时间小于目标时间时循环
    while time.perf_counter() < sleep_to:
        pass

    res = {
        "sleep_time": sleep_time,
        "sleep_to": sleep_to,
        "start_time": start_time,
        "real_sleep_time": time.perf_counter() - start_time,
        "wake_time": time.perf_counter(),
    }
    return res


# 数组中补为False的元素
def not_false(list):
    new_list = []
    for each in list:
        if each:
            new_list.append(each)
    return new_list


# 数组中最接近目标的数
def list_near_by(list, by, length=1):
    list.sort()
    with open("./test.json", "w+") as file:
        json.dump(list, file)
    # 列表中最大的数依然小于要搜索的数
    no_big_than_by = True
    for num in range(len(list)):
        if list[num] > by:
            no_big_than_by = False
            nearest_big_num = num
            nearest_small_num = num - 1
            break

    if no_big_than_by:
        # 没有比by更大的值
        return [list[-1], False]
    if nearest_big_num == 0:
        # 第一个值就比by大
        return [False, list[0]]

    print(list[nearest_small_num])
    print(list[nearest_big_num])
    result = list[nearest_small_num + 1 - length : nearest_big_num + length]
    print(result)
    return result


# 输出
print_thread_lock = threading.Lock()


def pr(string, color="green"):
    data_time = get_data_time()
    pr_thread(colored("[" + data_time + "]", color) + " " + str(string))


def pr_thread(string):
    print_thread_lock.acquire()
    print(string)
    print_thread_lock.release()


# 获取格式化时间
def get_data_time(timestamp=False):
    if not timestamp:
        timestamp = time.time()
    timestamp = time.localtime(timestamp)
    return time.strftime("%Y-%m-%d_%H-%M-%S", timestamp)


# 判断是不是字符串格式
def is_string(obj):
    try:
        obj + ""
    except:
        return False
    else:
        return True


# 颜色格式转换
def color_change(color, reverse=False):
    if is_string(color):
        # 十六进制转十进制
        R = int(color[0:2], 16)
        G = int(color[2:4], 16)
        B = int(color[4:6], 16)
        res = [R, G, B]

    if reverse:
        res.reverse()
    return res


# 数字转位状态
def get_bit_state(byte):
    bits_length = (byte // 256 + 1) * 8
    bits = bin(byte).replace("0b", "").rjust(bits_length, "0")
    bits_list = []
    for each_bit in bits:
        bits_list.append(True if int(each_bit) else False)
    bits_list.reverse()
    return bits_list


# 位状态转数字
def set_bit_state(bits):
    if type(bits) == type({}):
        bits = list(bits.values())
    bits.reverse()
    bits_string = ""
    for each_bit in bits:
        bits_string += "1" if bool(each_bit) else "0"
    num = int(bits_string, base=2)
    return num


# 展示按键状态
def show_key_status(time, num, holding_key_list):
    _thread.start_new_thread(show_key_status_thread, (time, num, holding_key_list))


def show_key_status_thread(time, num, holding_key_list):
    print(num, end="\t")
    for each_key in holding_key_list:
        print("[" + (each_key if holding_key_list[each_key] else " ") + "]", end=" ")

    print("\t" + str(time))


def waste_time():
    num = 0
    while num < 100000:
        num += random.random()


def scaner_folder(url, son_scan=True):
    file_list = []
    file = os.listdir(url)
    for f in file:
        file_path = os.path.join(url, f)
        if os.path.isfile(file_path):
            file_list.append(os.path.abspath(file_path))
        elif os.path.isdir(file_path):
            if son_scan:
                file_list += scaner_folder(file_path)
        else:
            print(file_path)
    return file_list


if __name__ == "__main__":
    res = sleep(1, early_wake=True)
    print(res)
