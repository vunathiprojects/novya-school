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
    # AUTH APIs
    # =========================
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),

    # =========================
    # PROFILE APIs
    # =========================
    path("profile/<str:email>/", views.profile_get, name="profile_get"),
    path("profile/update/<str:email>/", views.profile_update, name="profile_update"),

    # =========================
    # DASHBOARD APIs
    # =========================
    path("dashboard/overview/", views.get_overview_data, name="dashboard_overview"),
    path("dashboard/attendance/", views.get_attendance_data, name="dashboard_attendance"),

    # =========================
    # SCHOOL DATA APIs
    # =========================
    path("school/teachers/", views.get_school_teachers, name="school_teachers"),
    path("school/students/", views.get_school_students, name="school_students"),
    path("school/parents/", views.get_school_parents, name="school_parents"),
    path("school/student-progress/", views.get_school_student_progress, name="student_progress"),
    path("school/student-reports/", views.get_school_student_reports, name="student_reports"),
    path("school/attendance/", views.get_school_attendance, name="school_attendance"),

    # =========================
    # TEACHER MANAGEMENT APIs
    # =========================
    path("school/teacher-registrations/", get_school_teacher_registrations, name="teacher_registrations"),
    path("school/teacher/<int:teacher_id>/approve/", approve_teacher, name="approve_teacher"),
    path("school/teacher/<int:teacher_id>/reject/", reject_teacher, name="reject_teacher"),
    path("school/teacher/<int:teacher_id>/block/", block_teacher, name="block_teacher"),

    # =========================
    # PARENT MANAGEMENT APIs
    # =========================
    path("school/parent-registrations/", get_school_parent_registrations, name="parent_registrations"),
    path("school/parent/<int:parent_id>/approve/", approve_parent, name="approve_parent"),
    path("school/parent/<int:parent_id>/reject/", reject_parent, name="reject_parent"),
    path("school/parent/<int:parent_id>/block/", block_parent, name="block_parent"),
]
