import imp


import json


# 是否顺序执行
def order_check():
    with open("./record/2022-09-24_13-52-09.json", "r") as file:
        data = json.load(file)

    new_data = {}
    new_data_order = []


    last = 0
    for each in data:
        new_data[each["time"]] = each
        new_data_order.append(each["time"])

    new_data_order.sort()

    new_new_data = []

    for each in new_data_order:
        new_new_data.append(new_data[each])
        

    with open("./record/改_2022-09-24_13-52-09.json", "w+") as file:
        data = json.dump(new_new_data, file)
        
# 最小延迟检测
def min_difference():
    with open("./record/改_2022-09-24_13-52-09.json", "r") as file:
        data = json.load(file)
        
    last = 0
    min = 0
    for each in data:
        if last == 0:
            last = each["time"]
            continue
        
        if min == 0:
            min = each["time"] - last
            last = each["time"]
            continue
        
        if each["time"] - last < min:
            min = each["time"] - last
            last = each["time"]
            
    print(min)
    
# order_check()
min_difference()