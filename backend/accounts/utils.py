from django.db import connection
 
def get_admin_school(admin_email=None):
    """
    Returns school name of admin (if exists).
    Safe function to avoid crashes.
    """
    if not admin_email:
        return None
 
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT school_name FROM ad_user WHERE email = %s",
                [admin_email]
            )
            row = cursor.fetchone()
            return row[0] if row else None
    except Exception:
        return None
