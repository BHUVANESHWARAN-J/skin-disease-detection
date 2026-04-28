from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count

from .serializers import RegisterSerializer, PredictionSerializer
from .models import PredictionHistory


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created"})

        return Response(serializer.errors, status=400)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email
        })


class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = PredictionHistory.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = PredictionSerializer(data, many=True)
        return Response(serializer.data)


class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from ai.predict import run_prediction
        
        file = request.FILES.get("image")

        if not file:
            return Response({"error": "Image required"}, status=400)

        try:
            result = run_prediction(file, request.user)
        except Exception as exc:
            return Response({"error": str(exc)}, status=500)

        return Response(result)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = PredictionHistory.objects.count()

        top = (
            PredictionHistory.objects
            .values("predicted_disease")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )

        recent = PredictionHistory.objects.order_by("-created_at")[:5]

        recent_data = PredictionSerializer(recent, many=True).data

        return Response({
            "total_predictions": total,
            "top_diseases": list(top),
            "recent": recent_data
        })
