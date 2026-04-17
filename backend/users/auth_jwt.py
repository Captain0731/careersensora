from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from django.contrib.auth.models import User
from ninja.security import HttpBearer


def create_access_token(user: User) -> str:
	payload = {
		"user_id": user.id,
		"exp": datetime.now(timezone.utc) + timedelta(days=7),
	}
	return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


class JWTAuth(HttpBearer):
	def authenticate(self, request, token):
		try:
			payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
			uid = payload.get("user_id")
			if uid is None:
				return None
			return User.objects.filter(id=uid, is_active=True).first()
		except jwt.PyJWTError:
			return None


jwt_auth = JWTAuth()
