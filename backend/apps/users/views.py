from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from apps.common.views import ModelViewSet
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer, 
    ChangePasswordSerializer, AdminLoginSerializer, OwnerLoginSerializer
)
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        login_type = request.data.get('loginType')
        logger.info(f"Login attempt - type: {login_type}, data: {request.data}")
        
        if login_type == 'admin':
            serializer = AdminLoginSerializer(data={
                'employee_id': request.data.get('employeeId', ''),
                'name': request.data.get('name', ''),
                'password': request.data.get('password', '')
            })
            
            if serializer.is_valid():
                employee_id = serializer.validated_data['employee_id']
                name = serializer.validated_data['name']
                password = serializer.validated_data['password']
                
                try:
                    user = User.objects.get(
                        employee_id=employee_id,
                        first_name=name,
                        user_type='admin'
                    )
                    if user.check_password(password):
                        refresh = RefreshToken.for_user(user)
                        return Response({
                            'refresh': str(refresh),
                            'access': str(refresh.access_token),
                            'user': UserSerializer(user).data
                        })
                except User.DoesNotExist:
                    pass
                    
                return Response(
                    {'error': '工号、姓名或密码错误'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            else:
                return Response(
                    {'error': '请求数据无效', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif login_type == 'owner':
            serializer = OwnerLoginSerializer(data={
                'username': request.data.get('username', ''),
                'password': request.data.get('password', '')
            })
            
            if serializer.is_valid():
                username = serializer.validated_data['username']
                password = serializer.validated_data['password']
                
                try:
                    user = User.objects.get(
                        username=username,
                        user_type='owner'
                    )
                    if user.check_password(password):
                        refresh = RefreshToken.for_user(user)
                        return Response({
                            'refresh': str(refresh),
                            'access': str(refresh.access_token),
                            'user': UserSerializer(user).data
                        })
                except User.DoesNotExist:
                    pass
                    
                return Response(
                    {'error': '用户名或密码错误'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            else:
                return Response(
                    {'error': '请求数据无效', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {'error': '不支持的登录类型'},
                status=status.HTTP_400_BAD_REQUEST
            )

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "登出成功"})
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return self.serializer_class

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'list']:
            return [IsAdminUser()]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        user = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": "旧密码不正确"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "密码修改成功"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def info(self, request):
        """获取当前用户信息"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data) 