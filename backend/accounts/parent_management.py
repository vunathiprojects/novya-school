from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from .views import get_admin_school


# Get all parent registrations for admin's school
@csrf_exempt
def get_school_parent_registrations(request):
    """Get all parent registrations (pending, approved, rejected, blocked) for admin's school"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Get all parents linked to students in this school
            # Using a more comprehensive query that checks all possible school locations
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
                    pr.created_at,
                    COUNT(DISTINCT sr.student_id) as children_count,
                    CASE pr.status
                        WHEN 'pending' THEN 1
                        WHEN 'approved' THEN 2
                        WHEN 'rejected' THEN 3
                        WHEN 'blocked' THEN 4
                        ELSE 5
                    END as status_order
                FROM parent_registration pr
                INNER JOIN parent_student_mapping psm ON pr.email = psm.parent_email
                INNER JOIN student_registration sr ON psm.student_id = sr.student_id
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE (
                    (LOWER(TRIM(COALESCE(sp.school, ''))) = LOWER(TRIM(%s)) AND TRIM(COALESCE(sp.school, '')) != '')
                    OR (LOWER(TRIM(COALESCE(sr.school, ''))) = LOWER(TRIM(%s)) AND TRIM(COALESCE(sr.school, '')) != '')
                )
                GROUP BY pr.parent_id, pr.parent_username, pr.email, pr.first_name, pr.last_name, pr.phone_number, pr.status, pr.created_at
                ORDER BY status_order, pr.created_at DESC
                """,
                [admin_school, admin_school]
            )
            columns = [col[0] for col in cursor.description]
            parents = []
            upcoming_parents = []
            
            for row in cursor.fetchall():
                parent_dict = dict(zip(columns, row))
                parent_id = parent_dict.get("parent_id")
                status = parent_dict.get("status", "pending")
                created_at = parent_dict.get("created_at")
                children_count = parent_dict.get("children_count", 0)
                
                # Format registration date
                reg_date = "N/A"
                if created_at:
                    if isinstance(created_at, str):
                        reg_date = created_at[:10]
                    else:
                        reg_date = created_at.strftime("%d/%m/%Y")
                
                parent_data = {
                    "regId": f"P{parent_id:03d}",
                    "parent_id": parent_id,
                    "firstName": parent_dict.get("first_name", ""),
                    "lastName": parent_dict.get("last_name", ""),
                    "email": parent_dict.get("email", ""),
                    "phone": parent_dict.get("phone_number", ""),
                    "username": parent_dict.get("parent_username", ""),
                    "children": children_count,
                    "status": status.capitalize(),
                    "locked": status == "blocked",
                    "registrationDate": reg_date,
                    "createdAt": created_at.isoformat() if created_at and hasattr(created_at, 'isoformat') else str(created_at),
                }
                
                parents.append(parent_data)
            
            # Calculate summary stats
            new_parents_count = len([p for p in parents if p["status"] == "Pending"])
            total_parents_count = len([p for p in parents if p["status"] == "Approved"])
            upcoming_count = len(upcoming_parents)
            
            return JsonResponse({
                "parents": parents,
                "upcomingParents": upcoming_parents,
                "summary": {
                    "newParents": new_parents_count,
                    "totalParents": total_parents_count,
                    "upcomingParents": upcoming_count,
                },
                "school": admin_school
            })
    except Exception as e:
        import traceback
        print(f"Error in get_school_parent_registrations: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Approve parent registration
@csrf_exempt
def approve_parent(request, parent_id):
    """Approve a parent registration - creates user account and sets status to approved"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Verify parent is linked to students in admin's school
            cursor.execute(
                """
                SELECT DISTINCT pr.parent_id, pr.parent_username, pr.email, pr.first_name, pr.last_name, 
                       pr.phone_number, pr.parent_password
                FROM parent_registration pr
                INNER JOIN parent_student_mapping psm ON pr.email = psm.parent_email
                INNER JOIN student_registration sr ON psm.student_id = sr.student_id
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE pr.parent_id = %s
                AND (
                    LOWER(TRIM(COALESCE(sp.school, ''))) = LOWER(TRIM(%s))
                    OR LOWER(TRIM(COALESCE(sr.school, ''))) = LOWER(TRIM(%s))
                )
                """,
                [parent_id, admin_school, admin_school]
            )
            parent_row = cursor.fetchone()
            
            if not parent_row:
                return JsonResponse({"error": "Parent not found or not linked to students in your school"}, status=404)
            
            # Update status to approved
            cursor.execute(
                """
                UPDATE parent_registration
                SET status = 'approved'
                WHERE parent_id = %s
                """,
                [parent_id]
            )
            
            # Create User account if it doesn't exist
            cursor.execute(
                """
                SELECT username FROM users WHERE username = %s
                """,
                [parent_row[1]]  # parent_username
            )
            user_exists = cursor.fetchone()
            
            if not user_exists:
                # Create user account
                cursor.execute(
                    """
                    INSERT INTO users (username, email, firstname, lastname, phonenumber, role, password)
                    VALUES (%s, %s, %s, %s, %s, 'Parent', %s)
                    """,
                    [parent_row[1], parent_row[2], parent_row[3], parent_row[4], parent_row[5], parent_row[6]]
                )
                
                # Create Parent record
                cursor.execute(
                    """
                    INSERT INTO parent (parent_id)
                    SELECT userid FROM users WHERE username = %s
                    """,
                    [parent_row[1]]
                )
            
            return JsonResponse({
                "message": "Parent approved successfully",
                "parent_id": parent_id
            })
    except Exception as e:
        import traceback
        print(f"Error in approve_parent: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Reject parent registration
@csrf_exempt
def reject_parent(request, parent_id):
    """Reject a parent registration"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
        with connection.cursor() as cursor:
            # Verify parent is linked to students in admin's school
            cursor.execute(
                """
                SELECT DISTINCT pr.parent_id
                FROM parent_registration pr
                INNER JOIN parent_student_mapping psm ON pr.email = psm.parent_email
                INNER JOIN student_registration sr ON psm.student_id = sr.student_id
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE pr.parent_id = %s
                AND (
                    LOWER(TRIM(COALESCE(sp.school, ''))) = LOWER(TRIM(%s))
                    OR LOWER(TRIM(COALESCE(sr.school, ''))) = LOWER(TRIM(%s))
                )
                """,
                [parent_id, admin_school, admin_school]
            )
            if not cursor.fetchone():
                return JsonResponse({"error": "Parent not found or not linked to students in your school"}, status=404)
            
            # Update status to rejected
            cursor.execute(
                """
                UPDATE parent_registration
                SET status = 'rejected'
                WHERE parent_id = %s
                """,
                [parent_id]
            )
            
            return JsonResponse({
                "message": "Parent rejected successfully",
                "parent_id": parent_id
            })
    except Exception as e:
        import traceback
        print(f"Error in reject_parent: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)


# Block/Unblock parent
@csrf_exempt
def block_parent(request, parent_id):
    """Block or unblock a parent - prevents login when blocked"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)
    
    try:
        admin_school = get_admin_school(request)
        if not admin_school:
            return JsonResponse({"error": "Admin school not found"}, status=400)
        
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
            # Verify parent is linked to students in admin's school
            cursor.execute(
                """
                SELECT DISTINCT pr.parent_id, pr.status
                FROM parent_registration pr
                INNER JOIN parent_student_mapping psm ON pr.email = psm.parent_email
                INNER JOIN student_registration sr ON psm.student_id = sr.student_id
                LEFT JOIN student_profile sp ON sr.student_id = sp.student_id
                WHERE pr.parent_id = %s
                AND (
                    LOWER(TRIM(COALESCE(sp.school, ''))) = LOWER(TRIM(%s))
                    OR LOWER(TRIM(COALESCE(sr.school, ''))) = LOWER(TRIM(%s))
                )
                """,
                [parent_id, admin_school, admin_school]
            )
            parent_row = cursor.fetchone()
            
            if not parent_row:
                return JsonResponse({"error": "Parent not found or not linked to students in your school"}, status=404)
            
            current_status = parent_row[1]
            
            # Update status
            if action == 'block':
                new_status = 'blocked'
            else:  # unblock
                new_status = 'approved' if current_status == 'blocked' else current_status
            
            cursor.execute(
                """
                UPDATE parent_registration
                SET status = %s
                WHERE parent_id = %s
                """,
                [new_status, parent_id]
            )
            
            return JsonResponse({
                "message": f"Parent {action}ed successfully",
                "parent_id": parent_id,
                "status": new_status
            })
    except Exception as e:
        import traceback
        print(f"Error in block_parent: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

