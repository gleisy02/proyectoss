from django.db import models

# Create your models here.

class movimientos (models.Model):
    
    TIPOS = [
        ('ingreso', 'Ingreso'),
        ('gasto', 'gasto')
    ]
    
    CATEGORIAS = [
        
        ('salario', 'Salario'),
        ('bonos', 'bonos'),
        ('inversiones', 'Inversiones'),
        
        ('comida', 'Comida'),
        ('transporte', 'Transporte'),
        ('alquiler', 'Alquiler'),
        ('otros', 'Otros')
    ]
    
    concepto = models.CharField(max_length=100)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS)
    fecha = models.DateField()
    nota = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.concepto} - {self.monto} - {self.tipo} - {self.categoria} - {self.fecha}"
    
    class Meta:
        ordering = ['-fecha']