from django.shortcuts import render, redirect
from django.views import View
from django.http import JsonResponse
from django.contrib.auth.models import User
from validate_email import validate_email
import json
from django.contrib import messages
from django.core.mail import EmailMessage
from django.urls import reverse
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from .utils import token_generator


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
                    #Sending Activation Email
                    #Preparing variable to construct link
                    uidb64=urlsafe_base64_encode(force_bytes(user.pk))
                    token=token_generator.make_token(user)
                    domain = get_current_site(request).domain
                    link = reverse('activate-email', kwargs={
                        'uidb64':uidb64,
                        'token':token
                    })
                    activate_url = 'http://'+domain+link
                    email_subject ="Activate your Account"
                    email_body = "Hi, "+user.username+"\n Please use this link to verify your account\n" +activate_url 
                    email_from = "noreply@incomeexpenses.com"
                    email_to = data['email']
                    email = EmailMessage(
                        email_subject,
                        email_body,
                        email_from,
                        [email_to],
                    )
                    email.send(fail_silently=False)

                    #Flash Message
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
            

class ActivateEmailView(View):
    def get(self, request, uidb64, token):
        try:
            id = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=id)

            if not token_generator.check_token(user, token):
                return redirect('login'+'?message='+'User already active')

            if user.is_active:
                return redirect('login')

            user.is_active = True
            user.save()
            messages.success(request, 'Account activated successfully')
            return redirect('login')
        except Exception as ex:
            print(ex)
        
        return redirect('login')

        

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

class LoginView(View):
    def get(self, request):
        return render(request, 'authentication/login.html')