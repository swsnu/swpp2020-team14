import json

from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.contrib.auth import get_user_model, login, logout

User = get_user_model()

class APISignup(View):
    def post(self, request):
        try:
            query = json.loads(request.body)
            email = query['email']
            password = query['password']
            nickname = query['nickname']
        except KeyError:
            return HttpResponse("Malformed sign-up request", status=400)

        print(email, password, nickname)
        user = User.objects.filter(email=email)
        if user.count():
            return HttpResponse("This email has already signed up.", status=400)

        user = User.objects.filter(first_name=nickname)
        if user.count():
            return HttpResponse("Please use another nickname.", status=400)

        try:
            u = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=nickname)
        except:
            return HttpResponse("Unknown error occured", status=400)

        u.save()
        login(request, u)
        return HttpResponse()

class APISignin(View):
    def post(self, request):
        if not request.user.is_authenticated:
            try:
                queryjson = json.loads(request.body)
                email = queryjson['email']
                password = queryjson['password']
            except KeyError:
                return HttpResponse("Malformed sign-in request", status=400)

# We cannot use authenticate(), because we don't use username
            user = User.objects.filter(email=email)
            if not user.count():
                return HttpResponse("No such user", status=404)
# TODO: get() below will raise error when user.count() > 1;
#         we should make sure emails are unique
            u = user.get()
            if u.check_password(password):
                login(request, u)
            else:
                return HttpResponse("Incorrect password", status=401)

        u = request.user
        return JsonResponse({
            "email": u.email,
            "nickname": u.first_name
        })

class APISignout(View):
    def post(self, request):
        logout(request)
        return HttpResponse(status=204)
