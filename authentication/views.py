from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.contrib.auth.models import User
from validate_email import validate_email
import json
from django.contrib import messages


class LoginView(View):
    def get(self, request):
        return render(request, 'authentication/login.html')

class RegisterView(View):
    template_name = 'authentication/register.html'
    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        data = request.POST
        context = {
                'fieldValue':data
            }
        if(len(data['username'])>0 and len(data['email'])>0 and len(data['password'])>0):
            if not User.objects.filter(username=data['username']).exists():
                if not User.objects.filter(email=data['email']).exists():
                    user = User.objects.create(username=data['username'],email=data['email'])
                    user.set_password(data['password'])
                    user.is_active=False
                    user.save()
                    messages.success(request, 'Successfuly registered.')
                    return render(request, self.template_name)
                else:
                    messages.error(request, 'Email already taken', extra_tags='danger')
                    return render(request, self.template_name, context=context)
            else:
                messages.error(request, 'Username already taken', extra_tags='danger')
                return render(request, self.template_name, context=context)
        else:
            messages.error(request, 'Invalid data', extra_tags='danger')
            return render(request, self.template_name, context=context)
            

        

class ValidateUsernameView(View):
    def post(self, request):
        data=json.loads(request.body)
        username=data['username']
        if not str(username).isalnum():
            return JsonResponse({'username_error':'Username should only contain alphanumeric characters'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'username_error': 'Username already taken'}, status=409)

        return JsonResponse({'username_valid':True}, status=200)

class ValidateEmailView(View):
    def post(self, request):
        data=json.loads(request.body)
        email=data['email']
        if not validate_email(email):
            return JsonResponse({'email_error':'Email is not valid'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'email_error': 'Email already taken'}, status=409)

        return JsonResponse({'username_valid':True}, status=200)


# def register(request):
#     return render(request, 'authentication/register.html')