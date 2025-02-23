# Django REST Framework 通用后端框架

这是一个基于Django和Django REST framework的通用后端框架，可用于快速构建各类Web应用的API服务。本框架集成了常用的功能组件和最佳实践，帮助开发者快速搭建高质量的后端服务。

## 核心特性

### 认证与授权
- JWT认证支持，包含访问令牌和刷新令牌
- Session认证支持
- 基于权限的访问控制
- 社交账号登录支持（通过django-allauth）

### API功能
- 统一的API响应格式
- 自动API文档生成（Swagger/ReDoc）
- API版本控制
- 请求节流和限速
- 灵活的过滤、搜索和排序
- 分页支持

### 数据处理
- MySQL数据库支持
- Redis缓存集成
- Celery异步任务队列
- 文件上传处理
- 软删除支持

### 开发支持
- 完整的日志系统
- 开发和生产环境分离
- 代码规范工具（black, flake8, isort）
- 单元测试和集成测试支持
- 调试工具栏

### 安全特性
- CORS跨域支持
- XSS防护
- CSRF防护
- SQL注入防护
- 安全的密码存储

## 技术栈

- Python 3.8+
- Django 4.2
- Django REST framework 3.14.0
- MySQL 8.0+
- Redis 6.0+
- Celery 5.3.1

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. 创建虚拟环境
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\\Scripts\\activate  # Windows
```

### 3. 安装依赖
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 4. 环境配置
复制环境变量示例文件并修改：
```bash
cp .env.example .env
```

环境变量说明：
```ini
# 环境选择
DJANGO_ENV=development  # 可选值: development, production, testing

# 其他配置...
```

根据不同环境，系统会自动加载对应的配置文件：
- development: config/settings/dev.py
- production: config/settings/prod.py
- testing: config/settings/test.py

您可以通过修改 .env 文件中的 DJANGO_ENV 值来切换不同的运行环境：
```bash
# 开发环境
DJANGO_ENV=development

# 生产环境
DJANGO_ENV=production

# 测试环境
DJANGO_ENV=testing
```

必要的环境变量包括：
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# 数据库配置
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306

# Redis配置
REDIS_URL=redis://localhost:6379/1
REDIS_PASSWORD=

# 邮件配置
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
```

### 5. 数据库迁移
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. 创建超级用户
```bash
python manage.py createsuperuser
```

### 7. 运行开发服务器
```bash
python manage.py runserver
```

## 项目结构说明

```
backend/
├── apps/                   # 应用目录
│   ├── common/            # 通用功能
│   │   ├── models.py     # 基础模型类
│   │   ├── views.py      # 基础视图类
│   │   ├── serializers.py # 基础序列化器
│   │   └── utils.py      # 工具函数
│   ├── authentication/    # 认证相关
│   └── users/            # 用户相关
├── config/                # 配置目录
│   └── settings/         # Django配置
│       ├── base.py      # 基础配置
│       ├── dev.py       # 开发环境配置
│       └── prod.py      # 生产环境配置
├── core/                  # 项目核心目录
├── static/                # 静态文件
├── media/                 # 上传文件
├── templates/             # 模板文件
├── tests/                 # 测试目录
│   ├── unit/            # 单元测试
│   └── integration/     # 集成测试
```

## 开发指南

### 1. 创建新应用

```bash
python manage.py startapp your_app apps/your_app
```

将新应用添加到 `config/settings/base.py` 的 `LOCAL_APPS` 中：
```python
LOCAL_APPS = [
    'apps.common',
    'apps.authentication',
    'apps.users',
    'apps.your_app',  # 添加新应用
]
```

### 2. 模型开发
继承基础模型类：
```python
from apps.common.models import BaseModel

class YourModel(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField()
    
    class Meta:
        db_table = 'your_table_name'
```

### 3. 序列化器开发
继承基础序列化器：
```python
from apps.common.serializers import BaseModelSerializer

class YourModelSerializer(BaseModelSerializer):
    class Meta:
        model = YourModel
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
```

### 4. 视图开发
使用预定义的视图集：
```python
from apps.common.views import ModelViewSet

class YourModelViewSet(ModelViewSet):
    queryset = YourModel.objects.all()
    serializer_class = YourModelSerializer
```

### 5. URL配置
在应用的urls.py中：
```python
from rest_framework.routers import DefaultRouter
from .views import YourModelViewSet

router = DefaultRouter()
router.register('your-models', YourModelViewSet)

urlpatterns = router.urls
```

## API响应格式

### 成功响应
```json
{
    "success": true,
    "message": "操作成功",
    "data": {
        "id": 1,
        "name": "示例"
    }
}
```

### 错误响应
```json
{
    "success": false,
    "message": "操作失败",
    "errors": {
        "field": ["错误信息"]
    }
}
```

## 测试

### 运行测试
```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_your_app.py

# 生成测试覆盖率报告
coverage run -m pytest
coverage report
```

### 编写测试
```python
import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
class TestYourAPI:
    def test_create_item(self, api_client):
        response = api_client.post('/api/v1/your-endpoint/', {
            'name': 'test',
            'description': 'test description'
        })
        assert response.status_code == 201
```

## 代码规范

### 格式化代码
```bash
# 使用black格式化代码
black .

# 使用isort排序导入
isort .

# 使用flake8检查代码质量
flake8
```

## 部署

### 1. 生产环境配置
- 修改 `.env` 文件中的配置
- 确保 `DEBUG=False`
- 设置安全的 `SECRET_KEY`
- 配置允许的 `ALLOWED_HOSTS`

### 2. 收集静态文件
```bash
python manage.py collectstatic
```

### 3. 使用Gunicorn
```bash
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### 4. Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /static/ {
        alias /path/to/your/static/;
    }

    location /media/ {
        alias /path/to/your/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题

### 1. 数据库迁移
如果遇到迁移问题，可以尝试：
```bash
python manage.py makemigrations --merge
python manage.py migrate --run-syncdb
```

### 2. 静态文件
开发环境中如果静态文件无法访问：
```bash
python manage.py collectstatic --no-input
```

### 3. Redis连接
确保Redis服务已启动：
```bash
redis-cli ping
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE) 