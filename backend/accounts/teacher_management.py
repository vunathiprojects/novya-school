from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
#from .views import get_admin_school
from .utils import get_admin_school


# Get all teacher registrations for admin's school
@csrf_exempt
def get_school_teacher_registrations(request):
    """Get all teacher registrations (pending, approved, rejected, blocked) for admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Get all teachers in this school
            # Use case-insensitive comparison and trim whitespace for accurate matching
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
                    tr.created_at,
                    COALESCE(tp.department, 'N/A') as department
                FROM teacher_registration tr
                LEFT JOIN teacher_profile tp ON tr.teacher_id = tp.teacher_id
                WHERE (
                    LOWER(TRIM(COALESCE(tp.school, ''))) = LOWER(TRIM(%s))
                    OR LOWER(TRIM(COALESCE(tr.school, ''))) = LOWER(TRIM(%s))
                )
                AND TRIM(COALESCE(tr.school, '')) != ''
                ORDER BY 
                    CASE tr.status
                        WHEN 'pending' THEN 1
                        WHEN 'approved' THEN 2
                        WHEN 'rejected' THEN 3
                        WHEN 'blocked' THEN 4
                        ELSE 5
                    END,
                    tr.created_at DESC
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            teachers = []
            upcoming_teachers = []
            
            for row in cursor.fetchall():
                teacher_dict = dict(zip(columns, row))
                teacher_id = teacher_dict.get("teacher_id")
                status = teacher_dict.get("status", "pending")
                created_at = teacher_dict.get("created_at")
                
                # Format registration date
                reg_date = "N/A"
                if created_at:
                    if isinstance(created_at, str):
                        reg_date = created_at[:10]  # Extract date part
                    else:
                        reg_date = created_at.strftime("%d/%m/%Y")
                
                teacher_data = {
                    "regId": f"T{teacher_id:03d}",
                    "teacher_id": teacher_id,
                    "firstName": teacher_dict.get("first_name", ""),
                    "lastName": teacher_dict.get("last_name", ""),
                    "email": teacher_dict.get("email", ""),
                    "phone": teacher_dict.get("phone_number", ""),
                    "username": teacher_dict.get("teacher_username", ""),
                    "subject": teacher_dict.get("department", "N/A"),
                    "grade": teacher_dict.get("grade", ""),
                    "school": teacher_dict.get("school", ""),
                    "status": status.capitalize(),
                    "locked": status == "blocked",
                    "registrationDate": reg_date,
                    "createdAt": created_at.isoformat() if created_at and hasattr(created_at, 'isoformat') else str(created_at),
                }
                
                # Separate upcoming (future dates) and regular teachers
                if status == "pending":
                    teachers.append(teacher_data)
                else:
                    teachers.append(teacher_data)
            
            # Calculate summary stats
            new_teachers_count = len([t for t in teachers if t["status"] == "Pending"])
            total_teachers_count = len([t for t in teachers if t["status"] == "Approved"])
            upcoming_count = len(upcoming_teachers)
            
            return JsonResponse({
                "teachers": teachers,
                "upcomingTeachers": upcoming_teachers,
                "summary": {
                    "newTeachers": new_teachers_count,
                    "totalTeachers": total_teachers_count,
                    "upcomingTeachers": upcoming_count,
                },
                "school": admin_school
            })
    except Exception as e:
        import traceback
        print(f"Error in get_school_teacher_registrations: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Approve teacher registration
@csrf_exempt
def approve_teacher(request, teacher_id):
    """Approve a teacher registration - creates user account and sets status to approved"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Get teacher registration - verify it belongs to admin's school
            cursor.execute(
                """
                SELECT tr.teacher_id, tr.teacher_username, tr.email, tr.first_name, tr.last_name, 
                       tr.phone_number, tr.teacher_password, tr.grade, tr.school
                FROM teacher_registration tr
                LEFT JOIN teacher_profile tp ON tr.teacher_id = tp.teacher_id
                WHERE tr.teacher_id = %s
                AND (
                    LOWER(TRIM(COALESCE(tp.school, ''))) = LOWER(TRIM(%s))
                    OR LOWER(TRIM(COALESCE(tr.school, ''))) = LOWER(TRIM(%s))
                )
                """,
                [teacher_id, admin_school, admin_school]
            )
            teacher_row = cursor.fetchone()
            
            if not teacher_row:
                return JsonResponse({"error": "Teacher not found or not in your school"}, status=404)
            
            # Update status to approved
            cursor.execute(
                """
                UPDATE teacher_registration
                SET status = 'approved'
                WHERE teacher_id = %s
                """,
                [teacher_id]
            )
            
            # Create User account if it doesn't exist
            cursor.execute(
                """
                SELECT username FROM users WHERE username = %s
                """,
                [teacher_row[1]]  # teacher_username
            )
            user_exists = cursor.fetchone()
            
            if not user_exists:
                # Create user account
                cursor.execute(
                    """
                    INSERT INTO users (username, email, firstname, lastname, phonenumber, role, password)
                    VALUES (%s, %s, %s, %s, %s, 'Teacher', %s)
                    """,
                    [teacher_row[1], teacher_row[2], teacher_row[3], teacher_row[4], teacher_row[5], teacher_row[6]]
                )
            
            # Create or update TeacherProfile
            cursor.execute(
                """
                INSERT INTO teacher_profile (teacher_id, teacher_username, teacher_name, email, phone_number, grade, school)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (teacher_id) DO UPDATE SET
                    teacher_name = EXCLUDED.teacher_name,
                    email = EXCLUDED.email,
                    phone_number = EXCLUDED.phone_number,
                    grade = EXCLUDED.grade,
                    school = EXCLUDED.school
                """,
                [teacher_id, teacher_row[1], f"{teacher_row[3]} {teacher_row[4]}", teacher_row[2], teacher_row[5], teacher_row[7], teacher_row[8]]
            )
            
            return JsonResponse({
                "message": "Teacher approved successfully",
                "teacher_id": teacher_id
            })
    except Exception as e:
        import traceback
        print(f"Error in approve_teacher: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Reject teacher registration
@csrf_exempt
def reject_teacher(request, teacher_id):
    """Reject a teacher registration"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Verify teacher is in admin's school
            cursor.execute(
                """
                SELECT tr.teacher_id
                FROM teacher_registration tr
                LEFT JOIN teacher_profile tp ON tr.teacher_id = tp.teacher_id
                WHERE tr.teacher_id = %s
                AND (
                    LOWER(TRIM(COALESCE(tp.school, ''))) = LOWER(TRIM(%s))
                    OR LOWER(TRIM(COALESCE(tr.school, ''))) = LOWER(TRIM(%s))
                )
                """,
                [teacher_id, admin_school, admin_school]
            )
            if not cursor.fetchone():
                return JsonResponse({"error": "Teacher not found or not in your school"}, status=404)
            
            # Update status to rejected
            cursor.execute(
                """
                UPDATE teacher_registration
                SET status = 'rejected'
                WHERE teacher_id = %s
                """,
                [teacher_id]
            )
            
            return JsonResponse({
                "message": "Teacher rejected successfully",
                "teacher_id": teacher_id
            })
    except Exception as e:
        import traceback
        print(f"Error in reject_teacher: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Block/Unblock teacher
@csrf_exempt
def block_teacher(request, teacher_id):
    """Block or unblock a teacher - prevents login when blocked"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        # Get action from request body or query params
        import json
        if request.body:
            try:
                body_data = json.loads(request.body)
                action = body_data.get('action', 'block')
            except:
                action = request.POST.get('action', 'block')
        else:
            action = request.POST.get('action', 'block')
        
        with connection.cursor() as cursor:
            # Verify teacher is in admin's school
            cursor.execute(
                """
                SELECT tr.teacher_id, tr.status
                FROM teacher_registration tr
                LEFT JOIN teacher_profile tp ON tr.teacher_id = tp.teacher_id
                WHERE tr.teacher_id = %s
                AND (
                    LOWER(TRIM(COALESCE(tp.school, ''))) = LOWER(TRIM(%s))
                    OR LOWER(TRIM(COALESCE(tr.school, ''))) = LOWER(TRIM(%s))
                )
                """,
                [teacher_id, admin_school, admin_school]
            )
            teacher_row = cursor.fetchone()
            
            if not teacher_row:
                return JsonResponse({"error": "Teacher not found or not in your school"}, status=404)
            
            current_status = teacher_row[1]
            
            # Update status
            if action == 'block':
                new_status = 'blocked'
            else:  # unblock
                # Restore to approved if it was blocked
                new_status = 'approved' if current_status == 'blocked' else current_status
            
            cursor.execute(
                """
                UPDATE teacher_registration
                SET status = %s
                WHERE teacher_id = %s
                """,
                [new_status, teacher_id]
            )
            
            return JsonResponse({
                "message": f"Teacher {action}ed successfully",
                "teacher_id": teacher_id,
                "status": new_status
            })
    except Exception as e:
        import traceback
        print(f"Error in block_teacher: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

