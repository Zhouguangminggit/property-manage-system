from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', '管理员'),
        ('owner', '业主'),
    )
    
    user_type = models.CharField(
        max_length=10, 
        choices=USER_TYPE_CHOICES, 
        default='owner',
        verbose_name='用户类型'
    )
    
    # 管理员特有字段
    employee_id = models.CharField(
        max_length=50, 
        null=True, 
        blank=True, 
        verbose_name='工号',
        db_index=True  # 添加索引以提高查询性能
    )
    
    # 业主特有字段
    phone = models.CharField(
        max_length=11, 
        null=True, 
        blank=True, 
        verbose_name='手机号'
    )
    
    # 添加related_name来解决冲突
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    
    class Meta:
        verbose_name = '用户'
        verbose_name_plural = verbose_name
        
    def __str__(self):
        return self.username 