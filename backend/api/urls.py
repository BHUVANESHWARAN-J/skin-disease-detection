from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views import (
    RegisterView,
    ProfileView,
    HistoryView,
    PredictView,
    DashboardView
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),

    path("profile/", ProfileView.as_view()),
    path("history/", HistoryView.as_view()),
    path("predict/", PredictView.as_view()),
    path("dashboard/", DashboardView.as_view()),
]
