import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.contrib.auth.hashers import make_password, check_password


# ======================================================
# SIGNUP
# ======================================================
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
                RETURNING admin_id;
                """,
                [full_name, email, hashed_password]
            )
            admin_id = cursor.fetchone()[0]

        return JsonResponse(
            {"message": "Signup successful!", "admin_id": admin_id},
            status=201
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ======================================================
# LOGIN
# ======================================================
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
            """
            SELECT admin_id, full_name, password
            FROM ad_user
            WHERE email = %s
            """,
            [email]
        )
        user = cursor.fetchone()

    if not user:
        return JsonResponse({"error": "Invalid email or password"}, status=401)

    admin_id, full_name, hashed_password = user

    if not check_password(password, hashed_password):
        return JsonResponse({"error": "Invalid email or password"}, status=401)

    return JsonResponse({
        "message": "Login successful!",
        "user": {
            "admin_id": admin_id,
            "full_name": full_name,
            "email": email
        }
    }, status=200)


# ======================================================
# PROFILE GET (by EMAIL)
# ======================================================
@csrf_exempt
def profile_get(request, email):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT phone, school_name, school_address
                FROM ad_user_profile
                WHERE user_id = (
                    SELECT admin_id FROM ad_user WHERE email = %s
                )
                """,
                [email]
            )
            row = cursor.fetchone()

        if not row:
            return JsonResponse({
                "phone": "",
                "school_name": "",
                "school_address": ""
            })

        phone, school_name, school_address = row

        return JsonResponse({
            "phone": phone,
            "school_name": school_name,
            "school_address": school_address
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ======================================================
# PROFILE UPDATE
# ======================================================
@csrf_exempt
def profile_update(request, email):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    phone = data.get("phone")
    school_name = data.get("school_name")
    school_address = data.get("school_address")

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT admin_id FROM ad_user WHERE email = %s
                """,
                [email]
            )
            row = cursor.fetchone()

            if not row:
                return JsonResponse({"error": "Admin not found"}, status=404)

            admin_id = row[0]

            cursor.execute(
                """
                SELECT profile_id FROM ad_user_profile WHERE user_id = %s
                """,
                [admin_id]
            )
            exists = cursor.fetchone()

            if exists:
                cursor.execute(
                    """
                    UPDATE ad_user_profile
                    SET phone=%s, school_name=%s, school_address=%s, updated_at=NOW()
                    WHERE user_id=%s
                    """,
                    [phone, school_name, school_address, admin_id]
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO ad_user_profile (user_id, phone, school_name, school_address)
                    VALUES (%s, %s, %s, %s)
                    """,
                    [admin_id, phone, school_name, school_address]
                )

        return JsonResponse({"message": "Profile updated successfully!"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
