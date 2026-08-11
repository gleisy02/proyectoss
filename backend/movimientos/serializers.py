from rest_framework import serializers
from .models import movimientos

class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = movimientos
        fields = ['id', 'concepto', 'monto', 'tipo', 'categoria', 'fecha', 'nota']
        
class MovimientoCreateSerializerReg(serializers.ModelSerializer):
    class Meta:
        model = movimientos
        fields = ['concepto', 'monto', 'tipo', 'categoria', 'fecha', 'nota']
        
class MovimientoUpdateSerializerUpdate(serializers.ModelSerializer):
    class Meta: 
        model = movimientos
        fields = ['concepto', 'monto', 'tipo', 'categoria', 'fecha', 'nota']

class MovimientoDeleteSerializerDelete(serializers.ModelSerializer):
    id = serializers.IntegerField()
    
    class Meta:
        model = movimientos
        fields = ['id']