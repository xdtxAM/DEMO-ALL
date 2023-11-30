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

print(result)
print(result[0])
print(result[1])

