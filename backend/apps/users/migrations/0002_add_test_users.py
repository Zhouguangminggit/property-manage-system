from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_test_users(apps, schema_editor):
    User = apps.get_model('users', 'User')
    
    # 创建管理员用户
    admin_users = [
        {
            'username': 'admin001',
            'password': make_password('admin123'),
            'first_name': '张三',
            'employee_id': 'EMP001',
            'email': 'zhangsan@example.com',
            'user_type': 'admin',
            'is_staff': True,
            'is_active': True
        },
        {
            'username': 'admin002',
            'password': make_password('admin123'),
            'first_name': '李四',
            'employee_id': 'EMP002',
            'email': 'lisi@example.com',
            'user_type': 'admin',
            'is_staff': True,
            'is_active': True
        }
    ]
    
    # 创建业主用户
    owner_users = [
        {
            'username': 'owner001',
            'password': make_password('owner123'),
            'first_name': '王五',
            'phone': '13800138001',
            'email': 'wangwu@example.com',
            'user_type': 'owner',
            'is_active': True
        },
        {
            'username': 'owner002',
            'password': make_password('owner123'),
            'first_name': '赵六',
            'phone': '13800138002',
            'email': 'zhaoliu@example.com',
            'user_type': 'owner',
            'is_active': True
        }
    ]
    
    # 批量创建用户
    for user_data in admin_users + owner_users:
        User.objects.create(**user_data)

def remove_test_users(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.filter(username__in=[
        'admin001', 'admin002', 'owner001', 'owner002'
    ]).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_test_users, remove_test_users),
    ]