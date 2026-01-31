import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.contrib.auth.hashers import make_password, check_password


# ============================
# HELPERS
# ============================
def dictfetchone(cursor):
    desc = [col[0] for col in cursor.description]
    row = cursor.fetchone()
    return dict(zip(desc, row)) if row else None


# ============================
# ADMIN SIGNUP
# ============================
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
            {"message": "Signup successful", "admin_id": admin_id},
            status=201
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# ADMIN LOGIN
# ============================
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
                SELECT admin_id, full_name, email, password,
                       phone, school_name, school_address
                FROM ad_user
                WHERE email = %s AND is_active = TRUE
                """,
                [email]
            )
            user = cursor.fetchone()

        if not user:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        admin_id, full_name, email, hashed_password, phone, school_name, school_address = user

        if not check_password(password, hashed_password):
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        return JsonResponse({
            "message": "Login successful",
            "admin": {
                "admin_id": admin_id,
                "fullName": full_name,
                "email": email,
                "phone": phone,
                "schoolName": school_name,
                "schoolAddress": school_address,
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# PROFILE GET (QUERY PARAM)
# ============================
def profile_get(request):
    email = request.GET.get("email")

    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT admin_id, full_name, email,
                       phone, school_name, school_address
                FROM ad_user
                WHERE email = %s
                """,
                [email]
            )
            user = dictfetchone(cursor)

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        return JsonResponse({
            "admin_id": user["admin_id"],
            "fullName": user["full_name"],
            "email": user["email"],
            "phone": user["phone"],
            "schoolName": user["school_name"],
            "schoolAddress": user["school_address"],
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# PROFILE UPDATE (AUTO HEAL)
# ============================
@csrf_exempt
def profile_update(request):
    if request.method not in ["POST", "PUT"]:
        return JsonResponse({"error": "Only POST/PUT allowed"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = data.get("email")
    full_name = data.get("fullName")
    phone = data.get("phone")
    school_name = data.get("schoolName")
    school_address = data.get("schoolAddress")

    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)

    if not school_name:
        return JsonResponse({"error": "School name is required"}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE ad_user
                SET
                    full_name = COALESCE(%s, full_name),
                    phone = COALESCE(%s, phone),
                    school_name = %s,
                    school_address = %s
                WHERE email = %s
                """,
                [full_name, phone, school_name, school_address, email]
            )

            if cursor.rowcount == 0:
                return JsonResponse({"error": "User not found"}, status=404)

        return JsonResponse({"message": "Profile updated successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# ADMIN → SCHOOL (CRITICAL)
# ============================
def get_admin_school(email):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT school_name, school_address
            FROM ad_user
            WHERE email = %s
              AND school_name IS NOT NULL
              AND school_name <> ''
            """,
            [email]
        )
        row = cursor.fetchone()

    if not row:
        return None

    return {
        "school_name": row[0],
        "school_address": row[1],
    }


# ============================
# TEACHER REGISTRATIONS (FIXED)
# ============================
def get_teacher_registrations(request):
    admin_email = request.GET.get("admin_email")

    if not admin_email:
        return JsonResponse({"error": "admin_email is required"}, status=400)

    school = get_admin_school(admin_email)

    if not school:
        return JsonResponse(
            {"error": "Admin school not found"},
            status=400
        )

    # No teacher table yet – return empty list safely
    return JsonResponse({
        "school_name": school["school_name"],
        "teachers": []
    })


# ============================
# SAFE DUMMY APIS
# ============================
def get_overview_data(request):
    return JsonResponse({"message": "ok"})

def get_attendance_data(request):
    return JsonResponse({"message": "ok"})

def get_school_teachers(request):
    return JsonResponse({"message": "ok"})

def get_school_students(request):
    return JsonResponse({"message": "ok"})

def get_school_parents(request):
    return JsonResponse({"message": "ok"})

def get_school_student_progress(request):
    return JsonResponse({"message": "ok"})

def get_school_student_reports(request):
    return JsonResponse({"message": "ok"})

def get_school_attendance(request):
    return JsonResponse({"message": "ok"})
