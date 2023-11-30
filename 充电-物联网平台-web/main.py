

import requests

def count_glzt(url):
    response = requests.get(url)
    data = response.json()
    position = data[0].get("mc")
    glzt_zero_count = 0
    key_four_values = []  # 保存满足条件的key[4:]的值

    for key, value in data[0].items():
        if key.startswith("glzt") and isinstance(value, str):
            if value == '0':
                glzt_zero_count += 1
            key_four_values.append(key[4:])  # 保存满足条件的key[4:]的值

    return position, glzt_zero_count, key_four_values

# 调用函数并获取返回值
result1 = count_glzt("http://cdz.gpsserver.cn/ChargeCarSys?gtel=18560001037")
result2 = count_glzt("http://cdz.gpsserver.cn/ChargeCarSys?gtel=18560001038")
result3 = count_glzt("http://cdz.gpsserver.cn/ChargeCarSys?gtel=18560002140")

position1, glzt_zero_count1, key_four_values1 = result1
position2, glzt_zero_count2, key_four_values2 = result2
position3, glzt_zero_count3, key_four_values3 = result3

headers = {
    "Content-Type": "application/json",
    "Project-Key": "cKqv7Z7Ypc"
}

number1 = key_four_values1 if glzt_zero_count1 > 0 else "无空闲"
number2 = key_four_values2 if glzt_zero_count2 > 0 else "无空闲"
number3 = key_four_values3 if glzt_zero_count3 > 0 else "无空闲"

data = {
    "position1": position1,
    "free_num1": glzt_zero_count1,
    "number1": number1,
    "position2": position2,
    "free_num2": glzt_zero_count2,
    "number2": number2,
    "position3": position3,
    "free_num3": glzt_zero_count3,
    "number3": number3
}

url_message = "http://bj-2-api.iot-api.com/device/v1/zvvpwktj9u2z09b9/attributes"

response = requests.post(url_message, json=data, headers=headers)
print(response.text)
if response.status_code == 200:
    print("请求成功")
else:
    print("请求失败，错误码:", response.status_code)
