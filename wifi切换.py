import subprocess
import requests
import socket
import sys
import time

class CampusNetworkManager:
    def __init__(self):
        # 获取本机IP地址
        self.ip = self.get_local_ip()

    def get_local_ip(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip

    def logout(self):
        logout_url = f"http://10.200.84.3:801/eportal/?c=Portal&a=logout&callback=dr1004&login_method=1&user_account=drcom&user_password=123&ac_logout=1&register_mode=1&wlan_user_ip={self.ip}&wlan_user_ipv6=&wlan_vlan_id=1&wlan_user_mac=e4aaeaa26b63&wlan_ac_ip=&wlan_ac_name=&jsVersion=3.3.2&v=3959"
        # 发送注销请求
        requests.get(logout_url)
        print("注销请求发送完成.")

    def login(self, user_account, user_password):
        login_url = f"http://10.200.84.3:801/eportal/?c=Portal&a=login&callback=dr1003&login_method=1&user_account={user_account}&user_password={user_password}&wlan_user_ip={self.ip}&wlan_user_ipv6=&wlan_user_mac=000000000000&wlan_ac_ip=&wlan_ac_name=&jsVersion=3.3.2&v=7679"
        
        # 发送登录请求
        print(requests.get(login_url))
        print("登录请求发送完成.")

def connect_to_wifi(ssid, user_account=None, user_password=None):
    # 注销当前连接
    if ssid != "Galaxy\ S21":
        network_manager.logout()

    try:
        # 构建命令
        command = f"networksetup -setairportnetwork en0 {ssid}"

        # 执行命令
        subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"正在连接到Wi-Fi {ssid}...")

        # 等待连接成功
        time.sleep(2)  # 可根据实际情况调整等待时间

        # 登录
        if ssid == "YADX-STU":
            network_manager.login(user_account=user_account, user_password=user_password)

    except subprocess.CalledProcessError as e:
        print(f"Wi-Fi {ssid} 连接失败：{e.stderr}")



# 创建网络管理器实例
network_manager = CampusNetworkManager()

# 获取命令行参数
args = sys.argv

if len(args) > 1:
    # 获取第一个参数，即用户输入的WiFi SSID
    selected_ssid = args[1]

    # 判断用户选择的是哪个WiFi SSID
    if selected_ssid == "1":
        connect_to_wifi("Galaxy\ S21")
    elif selected_ssid == "2":
        connect_to_wifi("YADX-STU", user_account="", user_password="@")
    else:
        print("无效的WiFi SSID选择")
else:
    print("请提供WiFi SSID选择作为命令行参数1")
