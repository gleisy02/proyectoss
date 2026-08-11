from .serializers import MovimientoSerializer, MovimientoCreateSerializerReg, MovimientoUpdateSerializerUpdate, MovimientoDeleteSerializerDelete
from rest_framework.decorators import api_view
from movimientos.models import movimientos
from rest_framework.status import HTTP_200_OK,HTTP_201_CREATED
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q
from django.core.paginator import Paginator
from .services.response import Result,TryCatch,ListError
# Create your views here.

@api_view(['GET'])
def index(request):

    def action_to_execute():

        datos = movimientos.objects.all().order_by('-fecha')

        serializer = MovimientoSerializer(
            datos,
            many=True
        )

        return Result.Exitosa(
            '',
            serializer.data,
            HTTP_200_OK
        )

    return TryCatch(action_to_execute)



pk_paramView = openapi.Parameter(
    'id',
    openapi.IN_QUERY,
    description="ID Movimiento",
    type=openapi.TYPE_INTEGER
)


@swagger_auto_schema(
    method='get',
    operation_description="Buscar movimiento.",
    manual_parameters=[pk_paramView],
    responses={200: 'Exitoso', 400: 'Error'}
)
@api_view(['GET'])
def View(request):

    def action_to_execute():

        id = request.GET.get('id')

        datos = movimientos.objects.filter(
            id=id
        )

        serializer = MovimientoSerializer(
            datos,
            many=True
        )

        return Result.Exitosa(
            '',
            serializer.data,
            HTTP_200_OK
        )

    return TryCatch(action_to_execute)



@swagger_auto_schema(
    method='post',
    operation_description='Añadir un nuevo movimiento.',
    request_body=MovimientoCreateSerializerReg,
    responses={200: 'Exitoso', 400: 'Error'}
)
@api_view(['POST'])
def Add(request):

    def action_to_execute():

        concepto = request.data.get('concepto')
        monto = request.data.get('monto')
        tipo = request.data.get('tipo')
        categoria = request.data.get('categoria')
        fecha = request.data.get('fecha')

        ListError.Mensaje.clear()

        if not concepto:
            ListError.Mensaje.append(
                "Complete la casilla concepto!"
            )

        if not monto:
            ListError.Mensaje.append(
                "Complete la casilla monto!"
            )

        if not tipo:
            ListError.Mensaje.append(
                "Complete la casilla tipo!"
            )

        if not categoria:
            ListError.Mensaje.append(
                "Complete la casilla categoria!"
            )

        if not fecha:
            ListError.Mensaje.append(
                "Complete la casilla fecha!"
            )

        if ListError.Mensaje:
            return Result.Error(
                ListError.Mensaje
            )

        serializer = MovimientoCreateSerializerReg(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
        else:
            return Result.Error(
                "Complete los campos vacíos"
            )

        return Result.Exitosa(
            "Se registro correctamente",
            {},
            HTTP_201_CREATED
        )

    return TryCatch(action_to_execute)



@swagger_auto_schema(
    method='put',
    operation_description="Actualiza un movimiento.",
    request_body=MovimientoUpdateSerializerUpdate,
    responses={200: 'Exitoso', 400: 'Error'}
)
@api_view(['PUT'])
def Update(request):

    def action_to_execute():

        pk = request.data.get('id')

        concepto = request.data.get('concepto')
        monto = request.data.get('monto')
        tipo = request.data.get('tipo')
        categoria = request.data.get('categoria')
        fecha = request.data.get('fecha')

        ListError.Mensaje.clear()

        if not pk:
            ListError.Mensaje.append(
                "Complete la casilla ID!"
            )

        if not concepto:
            ListError.Mensaje.append(
                "Complete la casilla concepto!"
            )

        if not monto:
            ListError.Mensaje.append(
                "Complete la casilla monto!"
            )

        if not tipo:
            ListError.Mensaje.append(
                "Complete la casilla tipo!"
            )

        if not categoria:
            ListError.Mensaje.append(
                "Complete la casilla categoria!"
            )

        if not fecha:
            ListError.Mensaje.append(
                "Complete la casilla fecha!"
            )

        if ListError.Mensaje:
            return Result.Error(
                ListError.Mensaje
            )

        movimiento = movimientos.objects.get(
            id=pk
        )

        serializer = MovimientoUpdateSerializerUpdate(
            instance=movimiento,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
        else:
            return Result.Error(
                "Complete los campos vacíos"
            )

        return Result.Exitosa(
            "Se actualizo correctamente",
            {},
            HTTP_200_OK
        )

    return TryCatch(action_to_execute)



@swagger_auto_schema(
    method='delete',
    operation_description="Eliminar un movimiento.",
    manual_parameters=[pk_paramView],
    responses={200: 'Exitoso', 400: 'Error'}
)
@api_view(['DELETE'])
def Delete(request):

    def action_to_execute():

        pk = request.GET.get('id')

        ListError.Mensaje.clear()

        if not pk:
            ListError.Mensaje.append(
                "Complete la casilla del ID del movimiento!"
            )

        if ListError.Mensaje:
            return Result.Error(
                ListError.Mensaje
            )

        movimiento = movimientos.objects.get(
            id=pk
        )

        movimiento.delete()

        return Result.Exitosa(
            "Se elimino correctamente",
            {},
            HTTP_200_OK
        )

    return TryCatch(action_to_execute)



page_paramView = openapi.Parameter(
    'page',
    openapi.IN_QUERY,
    description="Page",
    type=openapi.TYPE_INTEGER
)

filter_paramView = openapi.Parameter(
    'filter',
    openapi.IN_QUERY,
    description="Filter",
    type=openapi.TYPE_STRING
)


@swagger_auto_schema(
    method='get',
    operation_description="Buscar",
    manual_parameters=[
        page_paramView,
        filter_paramView
    ],
    responses={200: 'Exitoso', 400: 'Error'}
)
@api_view(['GET'])
def Paginators(request):

    def action_to_execute():

        page = request.GET.get('page')
        pagesize = 10
        filter = request.GET.get('filter')

        showPages = int(pagesize)

        if filter:

            query = Q(concepto__icontains=filter) | \
                    Q(tipo__icontains=filter) | \
                    Q(categoria__icontains=filter)

            cont = movimientos.objects.filter(query)

        else:

            cont = movimientos.objects.all().order_by('-fecha')

        paginator = Paginator(
            cont,
            showPages
        )

        total_pages = paginator.num_pages

        try:
            page = int(page)
        except ValueError:
            page = 1

        if page > total_pages or page < 1:

            return Result.ErrorResponsePaginator(
                "No se encuentra esta página",
                total_pages,
                page
            )

        if page == total_pages and paginator.num_pages % showPages != 0:

            page_obj = paginator.page(total_pages)

        else:

            page_obj = paginator.page(page)

        if page == total_pages:

            button_previous = True
            button_next = False

        elif page <= 1:

            button_previous = False
            button_next = True

        elif page < total_pages:

            button_previous = True
            button_next = True

        serializer = MovimientoSerializer(
            page_obj,
            many=True
        )

        return Result.ResponsePaginator(
            '',
            serializer.data,
            total_pages,
            page,
            button_previous,
            button_next
        )

    return TryCatch(action_to_execute)
   
    
