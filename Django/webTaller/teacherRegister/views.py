# encoding utf-8
from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.core.urlresolvers import reverse


from .forms import RegistroUserForm
from .models import Profesores


def nuevo_JefeArea(request):
    if request.method == 'POST':
        # Si el method es post, obtenemos los datos del formulario
        form = RegistroUserForm(request.POST, request.FILES)

        # Comprobamos si el formulario es valido
        if form.is_valid():
            # En caso de ser valido, obtenemos los datos del formulario.
            # form.cleaned_data obtiene los datos limpios y los pone en un
            # diccionario con pares clave/valor, donde clave es el nombre del campo
            # del formulario y el valor es el valor si existe.
            cleaned_data = form.cleaned_data
            username = cleaned_data.get('username')
            password = cleaned_data.get('password')
            email = cleaned_data.get('email')
            # E instanciamos un objeto User, con el username, password y una desactivación de cuenta para que el admin lo habilite
            user_model = User.objects.create_user(username=username, password=password,is_active = False)
            # Anadimos el email
            user_model.email = email
            # Y guardamos el objeto, esto guardara los datos en la db.
            user_model.save()
            # Ahora, creamos un objeto UserProfile, aunque no haya incluido
            # una imagen, ya quedara la referencia creada en la db.
            user_profile = Profesores()
            # Al campo user le asignamos el objeto user_model
            user_profile.user = user_model
            # ¿Se acuerdan cuando creamos el usuario deshabilitado? Lo deshabilitamos de vuelta! (si no lo haciamos tiraba error)
            user_profile.is_active = False
            # Por ultimo, guardamos tambien el objeto UserProfile
            user_profile.save()
            # Ahora, redireccionamos a la pagina accounts/gracias.html
            # Pero lo hacemos con un redirect.
            return render(request, 'gracias.html')
    else:
        # Si el mthod es GET, instanciamos un objeto RegistroUserForm vacio
        form = RegistroUserForm()
    # Creamos el contexto
    context = {'form': form}
    # Y mostramos los datos
    return render(request, 'registerAteacher.html', context)


def gracias_view(request, username):
    return render(request, 'gracias.html', {'username': username})
