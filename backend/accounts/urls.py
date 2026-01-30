from django.urls import path

# =========================
# IMPORT AUTH & PROFILE VIEWS
# =========================
from .views import (
    signup,
    login,
    profile_get,
    profile_update,

    # Dashboard
    get_overview_data,
    get_attendance_data,

    # School admin
    get_school_teachers,
    get_school_students,
    get_school_parents,
    get_school_student_progress,
    get_school_student_reports,
    get_school_attendance,
)

# =========================
# TEACHER MANAGEMENT
# =========================
from .teacher_management import (
    get_school_teacher_registrations,
    approve_teacher,
    reject_teacher,
    block_teacher,
)

# =========================
# PARENT MANAGEMENT
# =========================
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
    path("signup/", signup, name="signup"),
    path("login/", login, name="login"),

    # =========================
    # PROFILE
    # =========================
    path("profile/<str:email>/", profile_get, name="profile_get"),
    path("profile/update/<str:email>/", profile_update, name="profile_update"),

    # =========================
    # DASHBOARD
    # =========================
    path("dashboard/overview/", get_overview_data, name="dashboard_overview"),
    path("dashboard/attendance/", get_attendance_data, name="dashboard_attendance"),

    # =========================
    # SCHOOL – DATA
    # =========================
    path("school/teachers/", get_school_teachers, name="school_teachers"),
    path("school/students/", get_school_students, name="school_students"),
    path("school/parents/", get_school_parents, name="school_parents"),
    path("school/student-progress/", get_school_student_progress, name="student_progress"),
    path("school/student-reports/", get_school_student_reports, name="student_reports"),
    path("school/attendance/", get_school_attendance, name="school_attendance"),

    # =========================
    # SCHOOL – TEACHER MANAGEMENT
    # =========================
    path("school/teacher-registrations/", get_school_teacher_registrations, name="teacher_registrations"),
    path("school/teacher/<int:teacher_id>/approve/", approve_teacher, name="approve_teacher"),
    path("school/teacher/<int:teacher_id>/reject/", reject_teacher, name="reject_teacher"),
    path("school/teacher/<int:teacher_id>/block/", block_teacher, name="block_teacher"),

    # =========================
    # SCHOOL – PARENT MANAGEMENT
    # =========================
    path("school/parent-registrations/", get_school_parent_registrations, name="parent_registrations"),
    path("school/parent/<int:parent_id>/approve/", approve_parent, name="approve_parent"),
    path("school/parent/<int:parent_id>/reject/", reject_parent, name="reject_parent"),
    path("school/parent/<int:parent_id>/block/", block_parent, name="block_parent"),
]

