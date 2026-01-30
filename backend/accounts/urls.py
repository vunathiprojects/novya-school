from django.urls import path
from . import views

# teacher management imports
from .teacher_management import (
    get_school_teacher_registrations,
    approve_teacher,
    reject_teacher,
    block_teacher,
)

# parent management imports
from .parent_management import (
    get_school_parent_registrations,
    approve_parent,
    reject_parent,
    block_parent,
)

urlpatterns = [

    # =========================
    # AUTH
    # =========================
    path("signup/", views.signup),
    path("login/", views.login),

    # =========================
    # PROFILE
    # =========================
    path("profile/<str:email>/", views.profile_get),
    path("profile/update/<str:email>/", views.profile_update),

    # =========================
    # DASHBOARD
    # =========================
    path("dashboard/overview/", views.get_overview_data),
    path("dashboard/attendance/", views.get_attendance_data),

    # =========================
    # SCHOOL – DATA
    # =========================
    path("school/teachers/", views.get_school_teachers),
    path("school/students/", views.get_school_students),
    path("school/parents/", views.get_school_parents),
    path("school/student-progress/", views.get_school_student_progress),
    path("school/student-reports/", views.get_school_student_reports),
    path("school/attendance/", views.get_school_attendance),

    # =========================
    # SCHOOL – TEACHER MANAGEMENT
    # =========================
    path("school/teacher-registrations/", get_school_teacher_registrations),
    path("school/teacher/<int:teacher_id>/approve/", approve_teacher),
    path("school/teacher/<int:teacher_id>/reject/", reject_teacher),
    path("school/teacher/<int:teacher_id>/block/", block_teacher),

    # =========================
    # SCHOOL – PARENT MANAGEMENT
    # =========================
    path("school/parent-registrations/", get_school_parent_registrations),
    path("school/parent/<int:parent_id>/approve/", approve_parent),
    path("school/parent/<int:parent_id>/reject/", reject_parent),
    path("school/parent/<int:parent_id>/block/", block_parent),
]
