from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from .utils import get_admin_school


@csrf_exempt
def get_school_teacher_registrations(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)

    # ✅ Extract admin_email from query params
    admin_email = request.GET.get("admin_email")

    if not admin_email:
        return JsonResponse({"error": "admin_email is required"}, status=400)

    # ✅ Pass EMAIL (not request)
    admin_school = get_admin_school(admin_email)

    if not admin_school:
        return JsonResponse({"error": "Admin school not found"}, status=400)

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
                data = dict(zip(columns, row))
                teachers.append({
                    "teacher_id": data["teacher_id"],
                    "firstName": data["first_name"],
                    "lastName": data["last_name"],
                    "email": data["email"],
                    "phone": data["phone_number"],
                    "grade": data["grade"],
                    "school": data["school"],
                    "status": data["status"].capitalize(),
                })

        return JsonResponse({
            "school": admin_school,
            "teachers": teachers
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
