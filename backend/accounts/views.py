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


# ============================
# DASHBOARD DATA ENDPOINTS
# ============================

# Reports - Class and Student Data
@csrf_exempt
def get_reports_data(request):
    """Get reports data (classes, students, marks)"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        # TODO: Replace with actual database queries
        data = {
            "classes": {
                "Class 7": [
                    {"id": "C7S01", "name": "Ravi", "dob": "12-03-2010", "attendance": "88%"},
                    {"id": "C7S02", "name": "Aarav", "dob": "21-04-2010", "attendance": "91%"},
                ],
                "Class 8": [
                    {"id": "C8S01", "name": "Teja", "dob": "11-02-2009", "attendance": "94%"},
                    {"id": "C8S02", "name": "Swathi", "dob": "09-05-2009", "attendance": "89%"},
                ],
                "Class 9": [
                    {"id": "C9S01", "name": "Meghana", "dob": "17-07-2008", "attendance": "95%"},
                    {"id": "C9S02", "name": "John", "dob": "03-11-2008", "attendance": "87%"},
                ],
                "Class 10": [
                    {"id": "C10S01", "name": "Divya", "dob": "15-01-2007", "attendance": "93%"},
                    {"id": "C10S02", "name": "Ajay", "dob": "28-08-2007", "attendance": "90%"},
                ],
            },
            "marks": {
                "C7S01": [
                    {"subject": "Math", "marks": 82, "grade": "A"},
                    {"subject": "Science", "marks": 90, "grade": "A+"},
                    {"subject": "English", "marks": 76, "grade": "B+"},
                    {"subject": "History", "marks": 84, "grade": "A"},
                    {"subject": "Chemistry", "marks": 88, "grade": "A"},
                    {"subject": "Computer Science", "marks": 92, "grade": "A+"},
                ],
                "C7S02": [
                    {"subject": "Math", "marks": 88, "grade": "A"},
                    {"subject": "Science", "marks": 92, "grade": "A+"},
                    {"subject": "English", "marks": 81, "grade": "A"},
                    {"subject": "History", "marks": 79, "grade": "B+"},
                    {"subject": "Chemistry", "marks": 85, "grade": "A"},
                    {"subject": "Computer Science", "marks": 90, "grade": "A+"},
                ],
            }
        }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Progress Data
@csrf_exempt
def get_progress_data(request):
    """Get student progress data"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        # TODO: Replace with actual database queries
        data = []
        for classIdx in range(6):
            className = f"Class {classIdx + 7}"
            students = []
            for sIdx in range(6):
                studentId = f"S{classIdx + 7}{sIdx + 1}"
                scores = {
                    "Math": 60 + (sIdx * 5) + (classIdx * 2),
                    "Science": 65 + (sIdx * 4) + (classIdx * 2),
                    "English": 62 + (sIdx * 6) + (classIdx * 2),
                    "History": 68 + (sIdx * 3) + (classIdx * 2),
                }
                avg = round(sum(scores.values()) / len(scores))
                topSubject = max(scores, key=scores.get)
                students.append({
                    "id": studentId,
                    "name": f"Student{classIdx + 7}{sIdx + 1}",
                    "scores": scores,
                    "average": avg,
                    "topSubject": topSubject,
                    "improvement": 10 + (sIdx * 2),
                    "completion": 80 + (sIdx * 3),
                    "aiInsight": "High retention" if avg > 85 else "Needs support" if avg < 70 else "Steady",
                })
            data.append({"className": className, "students": students})
        
        return JsonResponse({"classes": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Payments/Transactions Data
@csrf_exempt
def get_payments_data(request):
    """Get payments/transactions data"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        # Get query parameters for filtering
        class_filter = request.GET.get("class", "")
        search = request.GET.get("search", "")
        date_filter = request.GET.get("date", "")
        
        # TODO: Replace with actual database queries
        data = [
            {
                "id": 101,
                "transactionId": "TXN123456",
                "email": "john.doe@example.com",
                "phone": "+91 9876543210",
                "class": "10th",
                "status": "Success",
                "date": "2025-07-25",
                "amount": 3600,
            },
            {
                "id": 102,
                "transactionId": "TXN123457",
                "email": "priya.sharma@example.com",
                "phone": "+91 8765432109",
                "class": "8th",
                "status": "Pending",
                "date": "2025-07-20",
                "amount": 3600,
            },
            {
                "id": 103,
                "transactionId": "TXN123458",
                "email": "rahul.singh@example.com",
                "phone": "+91 7654321098",
                "class": "7th",
                "status": "Failed",
                "date": "2025-07-22",
                "amount": 3600,
            },
            {
                "id": 104,
                "transactionId": "TXN123459",
                "email": "aarav.mehta@example.com",
                "phone": "+91 6543210987",
                "class": "9th",
                "status": "Success",
                "date": "2025-07-18",
                "amount": 3600,
            },
        ]
        
        # Apply filters
        if class_filter:
            data = [d for d in data if class_filter.lower() in d.get("class", "").lower()]
        if search:
            search_lower = search.lower()
            data = [d for d in data if (
                search_lower in d.get("email", "").lower() or
                search_lower in d.get("phone", "").lower() or
                search_lower in d.get("transactionId", "").lower()
            )]
        
        # Calculate summary
        total_revenue = sum(d["amount"] for d in data if d["status"] == "Success")
        pending_count = len([d for d in data if d["status"] == "Pending"])
        failed_count = len([d for d in data if d["status"] == "Failed"])
        
        return JsonResponse({
            "payments": data,
            "summary": {
                "totalRevenue": total_revenue,
                "pending": pending_count,
                "failed": failed_count,
            }
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Helper function to get admin's school
def get_admin_school(request):
    """Get the school name for the logged-in admin from request"""
    # Get email from query parameter, header, or request body
    admin_email = (
        request.GET.get('admin_email') or 
        request.headers.get('X-Admin-Email') or
        (request.data.get('admin_email') if hasattr(request, 'data') else None)
    )
    
    # If still not found, try to get from session or token (if implemented)
    if not admin_email:
        # Try to get from request session if available
        admin_email = getattr(request, 'session', {}).get('admin_email')
    
    if not admin_email:
        return None
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT school_name FROM ad_user_profile WHERE email = %s
                """,
                [admin_email]
            )
            row = cursor.fetchone()
            if row and row[0]:
                return row[0].strip()
    except Exception as e:
        print(f"Error getting admin school: {e}")
        import traceback
        traceback.print_exc()
    return None


# Overview/Stats Data
@csrf_exempt
def get_overview_data(request):
    """Get dashboard overview statistics for admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        # Get admin's school
        admin_school = get_admin_school(request)
        
        if not admin_school:
            return JsonResponse({"error": "Admin school not found. Please complete your profile."}, status=400)
        
        with connection.cursor() as cursor:
            # Get total students in this school
            cursor.execute(
                """
                SELECT COUNT(DISTINCT sr.student_id)
                FROM student_registration sr
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (sp.school = %s OR sr.school = %s)
                AND sr.status = 'approved'
                """,
                [admin_school, admin_school]
            )
            total_students = cursor.fetchone()[0] or 0
            
            # Get total teachers in this school
            cursor.execute(
                """
                SELECT COUNT(DISTINCT tr.teacher_id)
                FROM teacher_registration tr
                LEFT JOIN teacher_profile tp ON tr.teacher_id = tp.teacher_id
                WHERE (tp.school = %s OR tr.school = %s)
                AND tr.status = 'approved'
                """,
                [admin_school, admin_school]
            )
            total_teachers = cursor.fetchone()[0] or 0
            
            # Get total parents linked to students in this school
            cursor.execute(
                """
                SELECT COUNT(DISTINCT pr.parent_id)
                FROM parent_registration pr
                INNER JOIN parent_student_mapping psm ON pr.email = psm.parent_email
                INNER JOIN student_registration sr ON psm.student_id = sr.student_id
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (sp.school = %s OR sr.school = %s)
                AND sr.status = 'approved'
                AND pr.status = 'approved'
                """,
                [admin_school, admin_school]
            )
            total_parents = cursor.fetchone()[0] or 0
            
            # Get unique grades/classes in this school
            cursor.execute(
                """
                SELECT COUNT(DISTINCT COALESCE(sp.grade, sr.grade))
                FROM student_registration sr
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (sp.school = %s OR sr.school = %s)
                AND sr.status = 'approved'
                AND COALESCE(sp.grade, sr.grade) IS NOT NULL
                """,
                [admin_school, admin_school]
            )
            total_classes = cursor.fetchone()[0] or 0
            
            # Get attendance rate (simplified - you can enhance this)
            attendance_rate = 92  # TODO: Calculate from actual attendance data
        
        data = {
            "stats": {
                "totalStudents": total_students,
                "totalParents": total_parents,
                "totalTeachers": total_teachers,
                "totalClasses": total_classes,
                "attendanceRate": attendance_rate,
            },
            "classPerformance": {
                "labels": ["Class 7", "Class 8", "Class 9", "Class 10"],
                "datasets": [
                    {
                        "label": "Average Score (%)",
                        "data": [79, 83, 87, 84],
                        "backgroundColor": "#2196F3",
                    }
                ],
            },
            "registrations": [],  # TODO: Get recent registrations
        }
        return JsonResponse(data)
    except Exception as e:
        import traceback
        print(f"Error in get_overview_data: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Attendance Data
@csrf_exempt
def get_attendance_data(request):
    """Get attendance data for students and teachers"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        # TODO: Replace with actual database queries
        data = {
            "students": {
                "Class 7": [
                    {"id": "C7S01", "name": "Ravi", "present": 18, "absent": 2},
                    {"id": "C7S02", "name": "Meghana", "present": 19, "absent": 1},
                    {"id": "C7S03", "name": "Teja", "present": 15, "absent": 5},
                    {"id": "C7S04", "name": "Aarav", "present": 20, "absent": 0},
                ],
                "Class 8": [
                    {"id": "C8S01", "name": "Harsha", "present": 16, "absent": 4},
                    {"id": "C8S02", "name": "Ritu", "present": 18, "absent": 2},
                    {"id": "C8S03", "name": "Anita", "present": 20, "absent": 0},
                    {"id": "C8S04", "name": "Sanjay", "present": 17, "absent": 3},
                ],
                "Class 9": [
                    {"id": "C9S01", "name": "Tarun", "present": 19, "absent": 1},
                    {"id": "C9S02", "name": "Deepak", "present": 14, "absent": 6},
                    {"id": "C9S03", "name": "Swathi", "present": 18, "absent": 2},
                    {"id": "C9S04", "name": "Pranay", "present": 16, "absent": 4},
                ],
                "Class 10": [
                    {"id": "C10S01", "name": "Akhil", "present": 20, "absent": 0},
                    {"id": "C10S02", "name": "John", "present": 19, "absent": 1},
                ],
            },
            "teachers": [
                {"id": "T01", "name": "Mr. Ramesh", "department": "Math", "present": 20, "absent": 1, "class": "Class 7"},
                {"id": "T02", "name": "Ms. Priya", "department": "Science", "present": 19, "absent": 2, "class": "Class 8"},
                {"id": "T03", "name": "Mr. Vijay", "department": "English", "present": 18, "absent": 3, "class": "Class 9"},
                {"id": "T04", "name": "Ms. Kavya", "department": "History", "present": 20, "absent": 0, "class": "Class 10"},
            ],
            "classes": ["Class 7", "Class 8", "Class 9", "Class 10"],
        }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Tickets/Support Data
@csrf_exempt
def get_tickets_data(request):
    """Get support tickets data"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        # TODO: Replace with actual database queries
        data = {
            "tickets": [],
            "parentTickets": [],
            "contactRequests": [],
        }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================
# NEW ENDPOINTS FOR SCHOOL ADMIN
# ============================

# Get all teachers in admin's school
@csrf_exempt
def get_school_teachers(request):
    """Get all teachers in the admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
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
                    tr.status,
                    tp.grade,
                    tp.department,
                    tp.school
                FROM teacher_registration tr
                LEFT JOIN teacher_profile tp ON tr.teacher_id = tp.teacher_id
                WHERE (tp.school = %s OR tr.school = %s)
                ORDER BY tr.first_name, tr.last_name
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            teachers = []
            for row in cursor.fetchall():
                teacher_dict = dict(zip(columns, row))
                teachers.append({
                    "teacher_id": teacher_dict.get("teacher_id"),
                    "username": teacher_dict.get("teacher_username"),
                    "email": teacher_dict.get("email"),
                    "name": f"{teacher_dict.get('first_name', '')} {teacher_dict.get('last_name', '')}".strip(),
                    "phone": teacher_dict.get("phone_number"),
                    "grade": teacher_dict.get("grade"),
                    "department": teacher_dict.get("department"),
                    "school": teacher_dict.get("school"),
                    "status": teacher_dict.get("status"),
                })
        
        return JsonResponse({"teachers": teachers, "total": len(teachers), "school": admin_school})
    except Exception as e:
        import traceback
        print(f"Error in get_school_teachers: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Get all students in admin's school
@csrf_exempt
def get_school_students(request):
    """Get all students in the admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    sr.student_id,
                    sr.student_username,
                    sr.student_email,
                    sr.first_name,
                    sr.last_name,
                    sr.phone_number,
                    sr.grade,
                    sr.status,
                    sp.grade as profile_grade,
                    sp.school as profile_school,
                    sp.parent_email
                FROM student_registration sr
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (sp.school = %s OR sr.school = %s)
                ORDER BY sr.first_name, sr.last_name
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            students = []
            for row in cursor.fetchall():
                student_dict = dict(zip(columns, row))
                students.append({
                    "student_id": student_dict.get("student_id"),
                    "username": student_dict.get("student_username"),
                    "email": student_dict.get("student_email"),
                    "name": f"{student_dict.get('first_name', '')} {student_dict.get('last_name', '')}".strip(),
                    "phone": student_dict.get("phone_number"),
                    "grade": student_dict.get("profile_grade") or student_dict.get("grade"),
                    "school": student_dict.get("profile_school") or admin_school,
                    "parent_email": student_dict.get("parent_email"),
                    "status": student_dict.get("status"),
                })
        
        return JsonResponse({"students": students, "total": len(students), "school": admin_school})
    except Exception as e:
        import traceback
        print(f"Error in get_school_students: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Get all parents linked to students in admin's school
@csrf_exempt
def get_school_parents(request):
    """Get all parents whose children are in the admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT 
                    pr.parent_id,
                    pr.parent_username,
                    pr.email,
                    pr.first_name,
                    pr.last_name,
                    pr.phone_number,
                    pr.status,
                    COUNT(DISTINCT sr.student_id) as children_count
                FROM parent_registration pr
                INNER JOIN parent_student_mapping psm ON pr.email = psm.parent_email
                INNER JOIN student_registration sr ON psm.student_id = sr.student_id
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (
                    (LOWER(TRIM(COALESCE(sp.school, ''))) = LOWER(TRIM(%s)) AND TRIM(COALESCE(sp.school, '')) != '')
                    OR (LOWER(TRIM(COALESCE(sr.school, ''))) = LOWER(TRIM(%s)) AND TRIM(COALESCE(sr.school, '')) != '')
                )
                GROUP BY pr.parent_id, pr.parent_username, pr.email, pr.first_name, pr.last_name, pr.phone_number, pr.status
                ORDER BY pr.first_name, pr.last_name
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            parents = []
            for row in cursor.fetchall():
                parent_dict = dict(zip(columns, row))
                parents.append({
                    "parent_id": parent_dict.get("parent_id"),
                    "username": parent_dict.get("parent_username"),
                    "email": parent_dict.get("email"),
                    "name": f"{parent_dict.get('first_name', '')} {parent_dict.get('last_name', '')}".strip(),
                    "phone": parent_dict.get("phone_number"),
                    "status": parent_dict.get("status"),
                    "children_count": parent_dict.get("children_count", 0),
                })
        
        return JsonResponse({"parents": parents, "total": len(parents), "school": admin_school})
    except Exception as e:
        import traceback
        print(f"Error in get_school_parents: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Get student progress data for ALL grades in admin's school
@csrf_exempt
def get_school_student_progress(request):
    """Get student progress data (quiz/mock scores) for ALL grades in admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Get all students in this school (ALL grades)
            cursor.execute(
                """
                SELECT DISTINCT
                    sr.student_id,
                    sr.student_username,
                    sr.student_email,
                    sr.first_name,
                    sr.last_name,
                    COALESCE(sp.grade, sr.grade) as grade,
                    sp.school as profile_school
                FROM student_registration sr
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (sp.school = %s OR sr.school = %s)
                AND sr.status = 'approved'
                ORDER BY COALESCE(sp.grade, sr.grade), sr.first_name, sr.last_name
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            students_data = []
            
            for row in cursor.fetchall():
                student_dict = dict(zip(columns, row))
                student_id = student_dict.get("student_id")
                grade = student_dict.get("grade") or "Unknown"
                
                # Get quiz attempts for this student
                cursor.execute(
                    """
                    SELECT 
                        COALESCE(SUM(total_questions), 0) as total_quiz_questions,
                        COALESCE(SUM(correct_answers), 0) as total_quiz_correct,
                        COUNT(*) as quiz_count
                    FROM quiz_attempt
                    WHERE student_id = %s
                    AND (total_questions > 0 OR score IS NOT NULL)
                    """,
                    [student_id]
                )
                quiz_row = cursor.fetchone()
                total_quiz_q = quiz_row[0] or 0
                total_quiz_correct = quiz_row[1] or 0
                quiz_count = quiz_row[2] or 0
                
                # Calculate quiz score
                quiz_score = None
                if total_quiz_q > 0:
                    quiz_score = round((total_quiz_correct / total_quiz_q) * 100, 1)
                elif quiz_count > 0:
                    # Fallback: use score field if available
                    cursor.execute(
                        """
                        SELECT AVG(score) as avg_score
                        FROM quiz_attempt
                        WHERE student_id = %s AND score IS NOT NULL
                        """,
                        [student_id]
                    )
                    score_row = cursor.fetchone()
                    if score_row and score_row[0]:
                        quiz_score = round((score_row[0] / 10) * 100, 1)  # Assuming 10 questions per quiz
                
                # Get mock test attempts
                cursor.execute(
                    """
                    SELECT 
                        COALESCE(SUM(total_questions), 0) as total_mock_questions,
                        COALESCE(SUM(correct_answers), 0) as total_mock_correct,
                        COUNT(*) as mock_count
                    FROM mock_test_attempt
                    WHERE student_id = %s
                    AND (total_questions > 0 OR score IS NOT NULL)
                    """,
                    [student_id]
                )
                mock_row = cursor.fetchone()
                total_mock_q = mock_row[0] or 0
                total_mock_correct = mock_row[1] or 0
                mock_count = mock_row[2] or 0
                
                # Calculate mock score
                mock_score = None
                if total_mock_q > 0:
                    mock_score = round((total_mock_correct / total_mock_q) * 100, 1)
                elif mock_count > 0:
                    cursor.execute(
                        """
                        SELECT AVG(score) as avg_score
                        FROM mock_test_attempt
                        WHERE student_id = %s AND score IS NOT NULL
                        """,
                        [student_id]
                    )
                    score_row = cursor.fetchone()
                    if score_row and score_row[0]:
                        mock_score = round((score_row[0] / 10) * 100, 1)
                
                # Calculate average score
                avg_score = None
                valid_scores = []
                if quiz_score is not None:
                    valid_scores.append(quiz_score)
                if mock_score is not None:
                    valid_scores.append(mock_score)
                if valid_scores:
                    avg_score = round(sum(valid_scores) / len(valid_scores), 1)
                
                # Get school test scores (marks published by teachers) for this student
                # Get all exam types: quarterly, half-yearly, annual
                # Normalize subject names in SQL to handle case variations
                cursor.execute(
                    """
                    SELECT 
                        CASE 
                            WHEN LOWER(TRIM(subject)) LIKE '%math%' OR LOWER(TRIM(subject)) LIKE '%mathematics%' THEN 'Mathematics'
                            WHEN LOWER(TRIM(subject)) LIKE '%science%' OR LOWER(TRIM(subject)) LIKE '%sci%' THEN 'Science'
                            WHEN LOWER(TRIM(subject)) LIKE '%english%' OR LOWER(TRIM(subject)) LIKE '%eng%' THEN 'English'
                            WHEN LOWER(TRIM(subject)) LIKE '%social%' OR LOWER(TRIM(subject)) LIKE '%history%' OR LOWER(TRIM(subject)) LIKE '%sst%' OR LOWER(TRIM(subject)) LIKE '%studies%' THEN 'History'
                            WHEN LOWER(TRIM(subject)) LIKE '%computer%' OR LOWER(TRIM(subject)) LIKE '%comp%' OR LOWER(TRIM(subject)) LIKE '%cs%' THEN 'Computer'
                            ELSE TRIM(subject)
                        END as normalized_subject,
                        quarterly_score,
                        half_yearly_score,
                        annual_score
                    FROM (
                        SELECT 
                            subject,
                            quarterly_score,
                            half_yearly_score,
                            annual_score,
                            ROW_NUMBER() OVER (
                                PARTITION BY 
                                    CASE 
                                        WHEN LOWER(TRIM(subject)) LIKE '%math%' OR LOWER(TRIM(subject)) LIKE '%mathematics%' THEN 'Mathematics'
                                        WHEN LOWER(TRIM(subject)) LIKE '%science%' OR LOWER(TRIM(subject)) LIKE '%sci%' THEN 'Science'
                                        WHEN LOWER(TRIM(subject)) LIKE '%english%' OR LOWER(TRIM(subject)) LIKE '%eng%' THEN 'English'
                                        WHEN LOWER(TRIM(subject)) LIKE '%social%' OR LOWER(TRIM(subject)) LIKE '%history%' OR LOWER(TRIM(subject)) LIKE '%sst%' OR LOWER(TRIM(subject)) LIKE '%studies%' THEN 'History'
                                        WHEN LOWER(TRIM(subject)) LIKE '%computer%' OR LOWER(TRIM(subject)) LIKE '%comp%' OR LOWER(TRIM(subject)) LIKE '%cs%' THEN 'Computer'
                                        ELSE TRIM(subject)
                                    END
                                ORDER BY updated_at DESC, academic_year DESC
                            ) as rn
                        FROM school_test_scores
                        WHERE student_id = %s
                    ) ranked
                    WHERE rn = 1
                    ORDER BY normalized_subject
                    """,
                    [student_id]
                )
                school_scores = cursor.fetchall()
                
                # Calculate subject-wise scores, averages, improvement, and completion
                subject_scores_avg = {}  # Average of all three exams per subject
                subject_scores_quarterly = {}
                subject_scores_halfyearly = {}
                subject_scores_annual = {}
                all_scores_for_completion = []  # All scores for completion calculation
                
                for score_row in school_scores:
                    normalized_subject = score_row[0]  # Already normalized in SQL
                    quarterly = score_row[1]
                    half_yearly = score_row[2]
                    annual = score_row[3]
                    
                    if normalized_subject:
                        # Store individual exam scores with normalized subject name
                        if quarterly is not None:
                            subject_scores_quarterly[normalized_subject] = float(quarterly)
                            all_scores_for_completion.append(float(quarterly))
                        if half_yearly is not None:
                            subject_scores_halfyearly[normalized_subject] = float(half_yearly)
                            all_scores_for_completion.append(float(half_yearly))
                        if annual is not None:
                            subject_scores_annual[normalized_subject] = float(annual)
                            all_scores_for_completion.append(float(annual))
                        
                        # Calculate average of all three exams for this subject
                        valid_scores = []
                        if quarterly is not None:
                            valid_scores.append(float(quarterly))
                        if half_yearly is not None:
                            valid_scores.append(float(half_yearly))
                        if annual is not None:
                            valid_scores.append(float(annual))
                        
                        if valid_scores:
                            subject_avg = round(sum(valid_scores) / len(valid_scores), 1)
                            subject_scores_avg[normalized_subject] = subject_avg
                
                # Calculate overall average (average of all subject averages)
                final_avg_score = avg_score
                if subject_scores_avg:
                    subject_avg_values = list(subject_scores_avg.values())
                    final_avg_score = round(sum(subject_avg_values) / len(subject_avg_values), 1)
                
                # Calculate improvement for different exam types
                # Quarterly: 0 (baseline)
                # Half-yearly: improvement from quarterly
                # Annual: improvement from half-yearly
                improvement_quarterly = 0  # Baseline, no improvement
                
                improvement_halfyearly = 0
                if subject_scores_halfyearly and subject_scores_quarterly:
                    halfyearly_values = []
                    quarterly_values = []
                    for subject in subject_scores_halfyearly.keys():
                        halfyearly_val = subject_scores_halfyearly[subject]
                        quarterly_val = subject_scores_quarterly.get(subject)
                        if quarterly_val is not None:
                            halfyearly_values.append(halfyearly_val)
                            quarterly_values.append(quarterly_val)
                    if halfyearly_values and quarterly_values:
                        halfyearly_avg = sum(halfyearly_values) / len(halfyearly_values)
                        quarterly_avg = sum(quarterly_values) / len(quarterly_values)
                        improvement_halfyearly = round(halfyearly_avg - quarterly_avg, 1)
                
                improvement_annual = 0
                if subject_scores_annual and subject_scores_halfyearly:
                    annual_values = []
                    halfyearly_values = []
                    for subject in subject_scores_annual.keys():
                        annual_val = subject_scores_annual[subject]
                        halfyearly_val = subject_scores_halfyearly.get(subject)
                        if halfyearly_val is not None:
                            annual_values.append(annual_val)
                            halfyearly_values.append(halfyearly_val)
                    if annual_values and halfyearly_values:
                        annual_avg = sum(annual_values) / len(annual_values)
                        halfyearly_avg = sum(halfyearly_values) / len(halfyearly_values)
                        improvement_annual = round(annual_avg - halfyearly_avg, 1)
                
                # For Average: improvement from quarterly to annual
                improvement_avg = 0
                if subject_scores_annual and subject_scores_quarterly:
                    annual_values = []
                    quarterly_values = []
                    for subject in subject_scores_annual.keys():
                        annual_val = subject_scores_annual[subject]
                        quarterly_val = subject_scores_quarterly.get(subject)
                        if quarterly_val is not None:
                            annual_values.append(annual_val)
                            quarterly_values.append(quarterly_val)
                    if annual_values and quarterly_values:
                        annual_avg = sum(annual_values) / len(annual_values)
                        quarterly_avg = sum(quarterly_values) / len(quarterly_values)
                        improvement_avg = round(annual_avg - quarterly_avg, 1)
                
                # Calculate completion: average of all three exam types (quarterly, half-yearly, annual)
                completion = 0
                if all_scores_for_completion:
                    completion = round(sum(all_scores_for_completion) / len(all_scores_for_completion), 1)
                
                students_data.append({
                    "student_id": student_id,
                    "username": student_dict.get("student_username"),
                    "email": student_dict.get("student_email"),
                    "name": f"{student_dict.get('first_name', '')} {student_dict.get('last_name', '')}".strip(),
                    "grade": grade,
                    "quiz_score": quiz_score,
                    "mock_score": mock_score,
                    "average_score": final_avg_score,
                    "school_scores_avg": subject_scores_avg,  # Average of all three exams per subject
                    "school_scores_quarterly": subject_scores_quarterly,
                    "school_scores_halfyearly": subject_scores_halfyearly,
                    "school_scores_annual": subject_scores_annual,
                    "improvement_quarterly": improvement_quarterly,  # 0 (baseline)
                    "improvement_halfyearly": improvement_halfyearly,  # Improvement from quarterly
                    "improvement_annual": improvement_annual,  # Improvement from half-yearly
                    "improvement_avg": improvement_avg,  # Improvement from quarterly to annual
                    "completion": completion,  # Average of all three exam types
                    "quiz_count": quiz_count,
                    "mock_count": mock_count,
                })
            
            # Group by grade/class
            classes_data = {}
            for student in students_data:
                grade = student["grade"]
                if grade not in classes_data:
                    classes_data[grade] = []
                classes_data[grade].append(student)
            
            return JsonResponse({
                "classes": classes_data,
                "total_students": len(students_data),
                "school": admin_school
            })
    except Exception as e:
        import traceback
        print(f"Error in get_school_student_progress: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Get student reports data for ALL grades in admin's school
@csrf_exempt
def get_school_student_reports(request):
    """Get student reports (classes and marks) for ALL grades in admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Get all students grouped by grade/class
            cursor.execute(
                """
                SELECT DISTINCT
                    sr.student_id,
                    sr.student_username,
                    sr.student_email,
                    sr.first_name,
                    sr.last_name,
                    COALESCE(sp.grade, sr.grade) as grade,
                    sr.created_at::date as dob
                FROM student_registration sr
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (sp.school = %s OR sr.school = %s)
                AND sr.status = 'approved'
                ORDER BY COALESCE(sp.grade, sr.grade), sr.first_name, sr.last_name
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            
            classes_dict = {}
            marks_dict = {}
            
            for row in cursor.fetchall():
                student_dict = dict(zip(columns, row))
                student_id = student_dict.get("student_id")
                grade = student_dict.get("grade") or "Unknown"
                student_name = f"{student_dict.get('first_name', '')} {student_dict.get('last_name', '')}".strip()
                
                # Format class name
                class_name = f"Class {grade}" if grade != "Unknown" else "Class Unknown"
                
                # Add to classes dict
                if class_name not in classes_dict:
                    classes_dict[class_name] = []
                
                classes_dict[class_name].append({
                    "id": f"C{grade}S{student_id}",
                    "name": student_name,
                    "dob": student_dict.get("dob").strftime("%d-%m-%Y") if student_dict.get("dob") else "N/A",
                    "attendance": "N/A"  # TODO: Calculate from attendance table
                })
                
                # Get marks for this student from school_test_scores table (published by teachers)
                student_marks = []
                
                # Get school test scores (marks published by teachers)
                # Get the latest score for each subject
                cursor.execute(
                    """
                    SELECT 
                        subject,
                        overall_score,
                        annual_score,
                        half_yearly_score,
                        quarterly_score
                    FROM (
                        SELECT 
                            subject,
                            overall_score,
                            annual_score,
                            half_yearly_score,
                            quarterly_score,
                            ROW_NUMBER() OVER (PARTITION BY subject ORDER BY updated_at DESC, academic_year DESC) as rn
                        FROM school_test_scores
                        WHERE student_id = %s
                    ) ranked
                    WHERE rn = 1
                    ORDER BY subject
                    """,
                    [student_id]
                )
                score_rows = cursor.fetchall()
                
                for score_row in score_rows:
                    subject = score_row[0]
                    overall = score_row[1]
                    annual = score_row[2]
                    half_yearly = score_row[3]
                    quarterly = score_row[4]
                    
                    # Use overall_score if available, otherwise use annual, then half_yearly, then quarterly
                    marks_value = overall if overall is not None else (annual if annual is not None else (half_yearly if half_yearly is not None else quarterly))
                    
                    if subject and marks_value is not None:
                        marks = round(float(marks_value))
                        # Calculate grade based on marks
                        if marks >= 90:
                            grade_letter = "A+"
                        elif marks >= 80:
                            grade_letter = "A"
                        elif marks >= 70:
                            grade_letter = "B+"
                        elif marks >= 60:
                            grade_letter = "B"
                        elif marks >= 50:
                            grade_letter = "C+"
                        elif marks >= 40:
                            grade_letter = "C"
                        else:
                            grade_letter = "F"
                        
                        student_marks.append({
                            "subject": subject,
                            "marks": marks,
                            "grade": grade_letter
                        })
                
                marks_dict[f"C{grade}S{student_id}"] = student_marks
            
        return JsonResponse({
            "classes": classes_dict,
            "marks": marks_dict,
            "school": admin_school
        })
    except Exception as e:
        import traceback
        print(f"Error in get_school_student_reports: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Get attendance data for ALL grades in admin's school (from teacher portal)
@csrf_exempt
def get_school_attendance(request):
    """Get attendance data for all students in admin's school from attendance table (marked by teachers)"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Get all students in this school (ALL grades)
            cursor.execute(
                """
                SELECT DISTINCT
                    sr.student_id,
                    sr.student_username,
                    sr.first_name,
                    sr.last_name,
                    COALESCE(sp.grade, sr.grade) as grade
                FROM student_registration sr
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (sp.school = %s OR sr.school = %s)
                AND sr.status = 'approved'
                ORDER BY COALESCE(sp.grade, sr.grade), sr.first_name, sr.last_name
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            students_list = []
            for row in cursor.fetchall():
                student_dict = dict(zip(columns, row))
                students_list.append({
                    "student_id": student_dict.get("student_id"),
                    "username": student_dict.get("student_username"),
                    "name": f"{student_dict.get('first_name', '')} {student_dict.get('last_name', '')}".strip(),
                    "grade": student_dict.get("grade") or "Unknown",
                })
            
            # Get attendance records for all these students from attendance table
            student_ids = [s["student_id"] for s in students_list]
            if not student_ids:
                return JsonResponse({
                    "classes": [],
                    "students": {},
                    "school": admin_school
                })
            
            # Query attendance table (from novya-main progress app)
            # Get total counts per student grouped by status
            if student_ids:
                placeholders = ','.join(['%s'] * len(student_ids))
                cursor.execute(
                    f"""
                    SELECT 
                        a.student_id,
                        a.status,
                        COUNT(*) as count
                    FROM attendance a
                    WHERE a.student_id IN ({placeholders})
                    GROUP BY a.student_id, a.status
                    ORDER BY a.student_id
                    """,
                    student_ids
                )
            else:
                cursor.execute("SELECT 1 WHERE 1=0")  # Return empty result
            
            # Process attendance data
            attendance_by_student = {}
            for row in cursor.fetchall():
                sid, status, count = row
                if sid not in attendance_by_student:
                    attendance_by_student[sid] = {"present": 0, "absent": 0, "late": 0, "excused": 0}
                if status in attendance_by_student[sid]:
                    attendance_by_student[sid][status] = count
                else:
                    attendance_by_student[sid][status] = count
            
            # Group students by grade/class
            classes_dict = {}
            for student in students_list:
                grade = student["grade"]
                class_name = f"Class {grade}" if grade != "Unknown" else "Class Unknown"
                
                if class_name not in classes_dict:
                    classes_dict[class_name] = []
                
                # Get attendance counts for this student
                att_data = attendance_by_student.get(student["student_id"], {"present": 0, "absent": 0, "late": 0, "excused": 0})
                present = att_data.get("present", 0) + att_data.get("late", 0) + att_data.get("excused", 0)  # Count late and excused as present
                absent = att_data.get("absent", 0)
                
                classes_dict[class_name].append({
                    "id": f"C{grade}S{student['student_id']}",
                    "name": student["name"],
                    "present": present,
                    "absent": absent,
                })
            
            # Get list of class names
            classes = sorted(classes_dict.keys())
            
            return JsonResponse({
                "classes": classes,
                "students": classes_dict,
                "school": admin_school
            })
    except Exception as e:
        import traceback
        print(f"Error in get_school_attendance: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)