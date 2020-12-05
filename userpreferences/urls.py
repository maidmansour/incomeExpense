from .views import PreferencesView
from django.urls import path

urlpatterns = [
    path('', PreferencesView.as_view(), name = 'preferences'),
    path('save', PreferencesView.as_view(), name = 'save-preferences'),
]