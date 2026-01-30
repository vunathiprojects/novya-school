import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.contrib.auth.hashers import make_password, check_password


# =====================================================
# ADMIN SIGNUP
# TABLE: ad_user
# =====================================================
@csrf_exempt
def signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return JsonResponse({"error": "All fields are required"}, status=400)

    try:
        with connection.cursor() as cursor:
            # Check if email already exists
            cursor.execute("SELECT 1 FROM ad_user WHERE email = %s", [email])
            if cursor.fetchone():
                return JsonResponse({"error": "Email already exists"}, status=400)

            hashed_password = make_password(password)

            cursor.execute(
                """
                INSERT INTO ad_user (full_name, email, password, is_active, is_admin, created_at)
                VALUES (%s, %s, %s, TRUE, TRUE, NOW())
                RETURNING admin_id;
                """,
                [full_name, email, hashed_password]
            )

            admin_id = cursor.fetchone()[0]

        return JsonResponse(
            {
                "message": "Signup successful",
                "admin_id": admin_id
            },
            status=201
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# =====================================================
# ADMIN LOGIN
# =====================================================
@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email and password required"}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT admin_id, full_name, password
                FROM ad_user
                WHERE email = %s AND is_active = TRUE
                """,
                [email]
            )
            user = cursor.fetchone()

        if not user:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        admin_id, full_name, hashed_password = user

        if not check_password(password, hashed_password):
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        return JsonResponse(
            {
                "message": "Login successful",
                "admin": {
                    "admin_id": admin_id,
                    "full_name": full_name,
                    "email": email
                }
            },
            status=200
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# =====================================================
# PROFILE API (FIXES YOUR IMPORT ERROR)
# =====================================================
def profile_get(request):
    return JsonResponse({"message": "Profile API working"})
