from django.urls import path
from .views import LoginView, RegisterView, ValidateUsernameView, ValidateEmailView, ActivateEmailView
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('login/',LoginView.as_view(), name="login"),
    path('register/',RegisterView.as_view(), name="register"),
    path('validate-username/',csrf_exempt(ValidateUsernameView.as_view()), name="validate-username" ),
    path('validate-email/',csrf_exempt(ValidateEmailView.as_view()), name="validate-email" ),
    path('activate-email/<uidb64>/<token>/',ActivateEmailView.as_view(), name="activate-email" ),
]