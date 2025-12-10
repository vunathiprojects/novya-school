from django.urls import path
from .views import signup, login, profile_get, profile_update

urlpatterns = [
    path("signup/", signup),
    path("login/", login),

    path("profile/<str:email>/", profile_get),
    path("profile/update/<str:email>/", profile_update),
]
