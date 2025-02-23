import uuid
import hashlib
from datetime import datetime
import random
import string


def generate_unique_id():
    """
    生成唯一ID
    """
    return str(uuid.uuid4())


def generate_random_string(length=8):
    """
    生成指定长度的随机字符串
    """
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))


def hash_password(password):
    """
    密码加密
    """
    return hashlib.sha256(password.encode()).hexdigest()


def format_datetime(dt, format_str="%Y-%m-%d %H:%M:%S"):
    """
    格式化日期时间
    """
    if isinstance(dt, str):
        dt = datetime.strptime(dt, format_str)
    return dt.strftime(format_str)


def get_client_ip(request):
    """
    获取客户端IP地址
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip 