from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="/"),
    path('add', views.Add, name="/add"),
    path('update', views.Update, name="/update"),
    path('delete', views.Delete, name="/delete"),
    path('view', views.View, name="/view"),
    path('paginator', views.Paginators, name="/paginator"),
    
    
]