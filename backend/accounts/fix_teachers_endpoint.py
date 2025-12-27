"""
Backend endpoint to fix teacher statuses
This can be called from the admin portal
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection


@csrf_exempt
def fix_teachers_to_pending(request):
    """Fix all approved teachers (except chavi) to pending status"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)
    
    try:
        with connection.cursor() as cursor:
            # Update all approved teachers to pending, except chavi (T007) and those with user accounts
            cursor.execute("""
                UPDATE teacher_registration
                SET status = 'pending'
                WHERE status = 'approved'
                AND teacher_id != 7
                AND teacher_username NOT IN (
                    SELECT username FROM users WHERE role = 'Teacher'
                )
            """)
            
            updated_count = cursor.rowcount
            
            # Get updated list
            cursor.execute("""
                SELECT teacher_id, teacher_username, first_name, last_name, status
                FROM teacher_registration
                WHERE status IN ('pending', 'approved')
                ORDER BY teacher_id
            """)
            
            columns = [col[0] for col in cursor.description]
            teachers = []
            for row in cursor.fetchall():
                teachers.append(dict(zip(columns, row)))
            
            return JsonResponse({
                "message": f"Successfully updated {updated_count} teachers to pending",
                "updated_count": updated_count,
                "teachers": teachers
            })
    except Exception as e:
        import traceback
        print(f"Error fixing teachers: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

