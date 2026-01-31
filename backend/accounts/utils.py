from django.db import connection


def get_admin_school(admin_email=None):
    """
    Returns the admin's school_name as a STRING.
    - Safe (never crashes)
    - Returns None if email or school is missing
    - Used by Teacher & Parent management APIs
    """

    if not admin_email:
        return None

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT school_name
                FROM ad_user
                WHERE email = %s
                  AND school_name IS NOT NULL
                  AND TRIM(school_name) <> ''
                """,
                [admin_email]
            )
            row = cursor.fetchone()

        # row = ('Some School Name',)
        return row[0] if row else None

    except Exception as e:
        # Optional: log this if needed
        print("get_admin_school error:", e)
        return None
