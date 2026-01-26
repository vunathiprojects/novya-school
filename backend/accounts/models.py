from django.db import models


# ==========================
# ADMIN USER (LOGIN TABLE)
# ==========================
class AdminUser(models.Model):
    admin_id = models.AutoField(primary_key=True)

    full_name = models.CharField(max_length=255)   # moved here (important)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ad_user"
        managed = True   # ✅ Django WILL create and manage this table

    def __str__(self):
        return self.email


# ==========================
# ADMIN PROFILE TABLE
# ==========================
class AdminUserProfile(models.Model):
    profile_id = models.AutoField(primary_key=True)

    user = models.OneToOneField(
        AdminUser,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    phone = models.CharField(max_length=15, blank=True, null=True)
    school_name = models.CharField(max_length=255, blank=True, null=True)
    school_address = models.TextField(blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ad_user_profile"
        managed = True   # ✅ Django WILL create and manage this table

    def __str__(self):
        return f"Profile of {self.user.email}"
