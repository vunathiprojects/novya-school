from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from .utils import get_admin_school


# ============================
# GET TEACHER REGISTRATIONS
# ============================
@csrf_exempt
def get_school_teacher_registrations(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)

    # ✅ FIX: get admin_email from query params
    admin_email = request.GET.get("admin_email")

    if not admin_email:
        return JsonResponse({
            "teachers": [],
            "summary": {
                "newTeachers": 0,
                "totalTeachers": 0,
                "upcomingTeachers": 0,
            }
        })

    admin_school = get_admin_school(admin_email)

    # ✅ SAFE: do NOT break login / UI
    if not admin_school:
        return JsonResponse({
            "teachers": [],
            "summary": {
                "newTeachers": 0,
                "totalTeachers": 0,
                "upcomingTeachers": 0,
            }
        })

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    tr.teacher_id,
                    tr.teacher_username,
                    tr.email,
                    tr.first_name,
                    tr.last_name,
                    tr.phone_number,
                    tr.grade,
                    tr.school,
                    tr.status,
                    tr.created_at
                FROM teacher_registration tr
                WHERE LOWER(TRIM(tr.school)) = LOWER(TRIM(%s))
                ORDER BY tr.created_at DESC
                """,
                [admin_school]
            )

            columns = [col[0] for col in cursor.description]
            teachers = []

            for row in cursor.fetchall():
                t = dict(zip(columns, row))
                teachers.append({
                    "teacher_id": t["teacher_id"],
                    "firstName": t["first_name"],
                    "lastName": t["last_name"],
                    "email": t["email"],
                    "phone": t["phone_number"],
                    "grade": t["grade"],
                    "school": t["school"],
                    "status": t["status"].capitalize(),
                })

        return JsonResponse({
            "teachers": teachers,
            "summary": {
                "newTeachers": len([t for t in teachers if t["status"] == "Pending"]),
                "totalTeachers": len([t for t in teachers if t["status"] == "Approved"]),
                "upcomingTeachers": 0,
            },
            "school": admin_school
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# APPROVE TEACHER
# ============================
@csrf_exempt
def approve_teacher(request, teacher_id):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    admin_email = request.GET.get("admin_email")
    admin_school = get_admin_school(admin_email)

    if not admin_school:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE teacher_registration
                SET status = 'approved'
                WHERE teacher_id = %s
                AND LOWER(TRIM(school)) = LOWER(TRIM(%s))
                """,
                [teacher_id, admin_school]
            )

        return JsonResponse({"message": "Teacher approved successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# REJECT TEACHER
# ============================
@csrf_exempt
def reject_teacher(request, teacher_id):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    admin_email = request.GET.get("admin_email")
    admin_school = get_admin_school(admin_email)

    if not admin_school:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE teacher_registration
                SET status = 'rejected'
                WHERE teacher_id = %s
                AND LOWER(TRIM(school)) = LOWER(TRIM(%s))
                """,
                [teacher_id, admin_school]
            )

        return JsonResponse({"message": "Teacher rejected successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# BLOCK / UNBLOCK TEACHER
# ============================
@csrf_exempt
def block_teacher(request, teacher_id):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    admin_email = request.GET.get("admin_email")
    admin_school = get_admin_school(admin_email)

    if not admin_school:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE teacher_registration
                SET status = 'blocked'
                WHERE teacher_id = %s
                AND LOWER(TRIM(school)) = LOWER(TRIM(%s))
                """,
                [teacher_id, admin_school]
            )

        return JsonResponse({"message": "Teacher blocked successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
