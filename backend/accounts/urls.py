from django.urls import path
from .views import (
    signup, login, profile_get, profile_update,
    get_reports_data, get_progress_data, get_payments_data,
    get_overview_data, get_attendance_data, get_tickets_data,
    get_school_teachers, get_school_students, get_school_parents,
    get_school_student_progress, get_school_student_reports,
    get_school_attendance
)
from .teacher_management import (
    get_school_teacher_registrations,
    approve_teacher, reject_teacher, block_teacher
)
from .fix_teachers_endpoint import fix_teachers_to_pending
from .parent_management import (
    get_school_parent_registrations,
    approve_parent, reject_parent, block_parent
)

urlpatterns = [
    path("signup/", signup),
    path("login/", login),

    path("profile/<str:email>/", profile_get),
    path("profile/update/<str:email>/", profile_update),

    # Dashboard data endpoints
    path("dashboard/reports/", get_reports_data),
    path("dashboard/progress/", get_progress_data),
    path("dashboard/payments/", get_payments_data),
    path("dashboard/overview/", get_overview_data),
    path("dashboard/attendance/", get_attendance_data),
    path("dashboard/tickets/", get_tickets_data),
    
    # School admin endpoints
    path("school/teachers/", get_school_teachers),
    path("school/students/", get_school_students),
    path("school/parents/", get_school_parents),
    path("school/student-progress/", get_school_student_progress),
    path("school/student-reports/", get_school_student_reports),
    path("school/attendance/", get_school_attendance),
    path("school/teacher-registrations/", get_school_teacher_registrations),
    path("school/teacher/<int:teacher_id>/approve/", approve_teacher),
    path("school/teacher/<int:teacher_id>/reject/", reject_teacher),
    path("school/teacher/<int:teacher_id>/block/", block_teacher),
    path("school/fix-teachers/", fix_teachers_to_pending),
    path("school/parent-registrations/", get_school_parent_registrations),
    path("school/parent/<int:parent_id>/approve/", approve_parent),
    path("school/parent/<int:parent_id>/reject/", reject_parent),
    path("school/parent/<int:parent_id>/block/", block_parent),
]
