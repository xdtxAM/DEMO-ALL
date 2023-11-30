import requests

def count_glzt(url):
    response = requests.get(url)
    data = response.json()
    position = (data[0].get("mc"))
    glzt_zero_count = 0
    glzt_one_count = 0
    key_four_values = []  # 保存满足条件的key[4:]的值

    for key, value in data[0].items():
        if key.startswith("glzt") and isinstance(value, str):
            if value == '0':
                glzt_zero_count += 1
                # print("glzt为0的接口对应的glzt编号:", key[4:])
            elif value == '1':
                glzt_one_count += 1

            key_four_values.append(key[4:])  # 保存满足条件的key[4:]的值

    # print("glzt为0的个数:", glzt_zero_count)
    # print("glzt为1的个数:", glzt_one_count)

    return position, glzt_zero_count, key_four_values

# 调用函数并获取返回值
result = count_glzt("http://cdz.gpsserver.cn/ChargeCarSys?gtel=18560002140")


# 调用函数并获取返回值
result = count_glzt("http://cdz.gpsserver.cn/ChargeCarSys?gtel=18560002140")


print(result[0])
print(result[1])
print(result[2])




url_message = "http://bj-2-api.iot-api.com/device/v1/zvvpwktj9u2z09b9/attributes"

headers = {
    "Content-Type": "application/json",
    "Project-Key": "cKqv7Z7Ypc"
}

number = result[2]

if result[1] == 0:
    number = "无空闲"

data = {
    "position": "{}".format(result[0]),
    "free_num": "{}".format(result[1]),
    "number": "{}".format(str(number))
}



response = requests.post(url_message, json=data, headers=headers)
print(response.text)
if response.status_code == 200:
    print("请求成功")
else:
    print("请求失败，错误码:", response.status_code)

