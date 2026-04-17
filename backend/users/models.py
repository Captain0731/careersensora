from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
	phone = models.CharField(max_length=32, blank=True)
	is_recruiter = models.BooleanField(default=False)

	def __str__(self) -> str:
		return f"{self.user.username} profile"
