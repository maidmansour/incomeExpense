from django.shortcuts import render
from django.views import View
import os
import json
from django.contrib import messages
from django.conf import settings
from .models import UserPreference
class PreferencesView(View):
    def get(self, request):

       
        user_preferences = UserPreference.objects.get(user=request.user)
            

        currency_data = []
        file_path = os.path.join(settings.BASE_DIR, 'currencies.json')

        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
            for k,v in data.items():
                currency_data.append({'name':k, 'value':v})

        return render(request, 'preferences/index.html', {'currencies': currency_data, 'user_preferences':user_preferences })

    def post(self, request):
        
        currency = request.POST['currency']
        exist = UserPreference.objects.filter(user=request.user).exists()
       
        if exist:
            user_preferences = UserPreference.objects.get(user=request.user)
            user_preferences.currency = currency
            user_preferences.save()
        else:
            user_preferences = UserPreference.objects.create(user=request.user, currency=currency)

        storage = messages.get_messages(request)
        storage.used = True
        messages.success(request, 'Changes saved')
        currency_data = []
        file_path = os.path.join(settings.BASE_DIR, 'currencies.json')

        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
            for k,v in data.items():
                currency_data.append({'name':k, 'value':v})

        # import pdb
        # pdb.set_trace()

        return render(request, 'preferences/index.html', {'currencies': currency_data, 'user_preferences' : user_preferences})


