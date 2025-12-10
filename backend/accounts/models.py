# from django.db import models

# class AdminUser(models.Model):
#     admin_id = models.AutoField(primary_key=True)
#     email = models.CharField(max_length=255, unique=True)
#     username = models.CharField(max_length=150)
#     password = models.CharField(max_length=255)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "ad_user"
#         managed = False  # VERY IMPORTANT — Django will NOT create or modify this table

from django.db import models


# ==========================
# LOGIN / SIGNUP TABLE
# ==========================
class AdminUser(models.Model):
    admin_id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=255, unique=True)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ad_user"
        managed = False  # Django will NOT create/modify this table


# ==========================
# PROFILE TABLE
# ==========================
class AdminUserProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        AdminUser,
        to_field="admin_id",
        db_column="user_id",
        on_delete=models.CASCADE
    )
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    school_name = models.CharField(max_length=255)
    school_address = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ad_user_profile"
        managed = False  # Django will NOT create/modify this table
