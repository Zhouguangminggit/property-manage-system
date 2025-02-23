from rest_framework import serializers


class BaseModelSerializer(serializers.ModelSerializer):
    """
    基础模型序列化器
    """
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        abstract = True
        fields = ['id', 'created_at', 'updated_at']


class BaseSerializer(serializers.Serializer):
    """
    基础序列化器
    """
    def create(self, validated_data):
        raise NotImplementedError('`create()` must be implemented.')

    def update(self, instance, validated_data):
        raise NotImplementedError('`update()` must be implemented.') 