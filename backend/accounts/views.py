# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.db import connection
# from django.contrib.auth.hashers import make_password, check_password


# # ============================
# # 🔹 SIGNUP API
# # ============================
# @csrf_exempt
# def signup(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Only POST allowed"}, status=400)

#     try:
#         data = json.loads(request.body.decode("utf-8"))
#     except:
#         return JsonResponse({"error": "Invalid JSON"}, status=400)

#     full_name = data.get("fullName")
#     email = data.get("email")
#     password = data.get("password")

#     if not full_name or not email or not password:
#         return JsonResponse({"error": "All fields are required"}, status=400)

#     # Hash password
#     hashed_password = make_password(password)

#     try:
#         with connection.cursor() as cursor:
#             cursor.execute(
#                 """
#                 INSERT INTO ad_user (full_name, email, password)
#                 VALUES (%s, %s, %s)
#                 RETURNING id;
#                 """,
#                 [full_name, email, hashed_password]
#             )
#             new_user_id = cursor.fetchone()[0]

#         return JsonResponse({
#             "message": "Signup successful!",
#             "id": new_user_id
#         }, status=201)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)



# # ============================
# # 🔹 LOGIN API
# # ============================
# @csrf_exempt
# def login(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Only POST allowed"}, status=400)

#     try:
#         data = json.loads(request.body.decode("utf-8"))
#     except:
#         return JsonResponse({"error": "Invalid JSON"}, status=400)

#     email = data.get("email")
#     password = data.get("password")

#     if not email or not password:
#         return JsonResponse({"error": "Email & Password required"}, status=400)

#     with connection.cursor() as cursor:
#         cursor.execute(
#             "SELECT id, full_name, password FROM ad_user WHERE email = %s",
#             [email]
#         )
#         user = cursor.fetchone()

#     if not user:
#         return JsonResponse({"error": "Invalid email or password"}, status=401)

#     user_id, full_name, hashed_password = user

#     # Check hashed password
#     if not check_password(password, hashed_password):
#         return JsonResponse({"error": "Invalid email or password"}, status=401)

#     # Success
#     return JsonResponse({
#         "message": "Login successful!",
#         "user": {
#             "id": user_id,
#             "full_name": full_name,
#             "email": email
#         }
#     }, status=200)

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.contrib.auth.hashers import make_password, check_password


# ============================
# SIGNUP
# ============================
@csrf_exempt
def signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return JsonResponse({"error": "All fields required"}, status=400)

    hashed_password = make_password(password)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO ad_user (full_name, email, password)
                VALUES (%s, %s, %s)
                RETURNING id;
                """,
                [full_name, email, hashed_password]
            )
            new_user_id = cursor.fetchone()[0]

        return JsonResponse({"message": "Signup successful!", "id": new_user_id}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# ============================
# LOGIN
# ============================
@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email & Password required"}, status=400)

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT id, full_name, password FROM ad_user WHERE email = %s",
            [email]
        )
        user = cursor.fetchone()

    if not user:
        return JsonResponse({"error": "Invalid email or password"}, status=401)

    user_id, full_name, hashed_password = user

    if not check_password(password, hashed_password):
        return JsonResponse({"error": "Invalid email or password"}, status=401)

    return JsonResponse({
        "message": "Login successful!",
        "user": {
            "id": user_id,
            "full_name": full_name,
            "email": email
        }
    })

# ============================
# PROFILE — GET using EMAIL
# ============================
@csrf_exempt
def profile_get(request, email):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT full_name, phone, school_name, school_address
                FROM ad_user_profile
                WHERE email = %s
                """,
                [email]
            )
            row = cursor.fetchone()

        if not row:
            return JsonResponse({
                "full_name": "",
                "phone": "",
                "school_name": "",
                "school_address": ""
            })

        full_name, phone, school_name, school_address = row

        return JsonResponse({
            "full_name": full_name,
            "phone": phone,
            "school_name": school_name,
            "school_address": school_address
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# ============================
# PROFILE — UPDATE using EMAIL
# ============================
@csrf_exempt
def profile_update(request, email):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    full_name = data.get("full_name")
    phone = data.get("phone")
    school_name = data.get("school_name")
    school_address = data.get("school_address")

    try:
        with connection.cursor() as cursor:
            # Check if profile exists
            cursor.execute(
                "SELECT id FROM ad_user_profile WHERE email = %s",
                [email]
            )
            exists = cursor.fetchone()

            if exists:
                cursor.execute(
                    """
                    UPDATE ad_user_profile
                    SET full_name=%s, phone=%s, school_name=%s, school_address=%s, updated_at=NOW()
                    WHERE email=%s
                    """,
                    [full_name, phone, school_name, school_address, email]
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO ad_user_profile (email, full_name, phone, school_name, school_address)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    [email, full_name, phone, school_name, school_address]
                )

        return JsonResponse({"message": "Profile updated successfully!"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
