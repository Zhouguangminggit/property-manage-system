from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework import status


class BaseViewSet(viewsets.GenericViewSet):
    """
    基础视图集，提供通用的响应方法
    """
    
    def get_success_response(self, data=None, message="操作成功", status_code=status.HTTP_200_OK):
        """
        返回成功响应
        """
        response_data = {
            "success": True,
            "message": message,
            "data": data
        }
        return Response(response_data, status=status_code)

    def get_error_response(self, message="操作失败", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        """
        返回错误响应
        """
        response_data = {
            "success": False,
            "message": message,
            "errors": errors
        }
        return Response(response_data, status=status_code)


class ModelViewSet(BaseViewSet,
                  mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.ListModelMixin):
    """
    标准的视图集，提供完整的CRUD操作
    """
    pass


class ReadOnlyModelViewSet(BaseViewSet,
                          mixins.RetrieveModelMixin,
                          mixins.ListModelMixin):
    """
    只读视图集，只提供查询操作
    """
    pass 