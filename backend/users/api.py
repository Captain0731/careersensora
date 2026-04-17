from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from ninja import Router
from ninja.errors import HttpError

from users.auth_jwt import create_access_token, jwt_auth
from users.models import UserProfile
from users.schemas import LoginIn, MeOut, SignupIn, TokenOut

router = Router(tags=["auth"])


def _find_user_by_username_or_email(identifier: str) -> User | None:
	needle = (identifier or "").strip()
	if not needle:
		return None
	if "@" in needle:
		return User.objects.filter(email__iexact=needle).first()
	return User.objects.filter(username=needle).first()


def _ensure_profile(user: User, *, phone: str | None = None, is_recruiter: bool | None = None) -> UserProfile:
	defaults: dict[str, object] = {}
	if phone is not None:
		defaults["phone"] = phone
	if is_recruiter is not None:
		defaults["is_recruiter"] = is_recruiter
	profile, _created = UserProfile.objects.get_or_create(user=user, defaults=defaults)
	updated_fields = []
	if phone is not None and profile.phone != phone:
		profile.phone = phone
		updated_fields.append("phone")
	if is_recruiter is not None and profile.is_recruiter != is_recruiter:
		profile.is_recruiter = is_recruiter
		updated_fields.append("is_recruiter")
	if updated_fields:
		profile.save(update_fields=updated_fields)
	return profile


@router.post("/login", response=TokenOut)
def login(request, data: LoginIn):
	identifier = data.username.strip()
	if not identifier:
		raise HttpError(400, "Username or email is required.")
	if not data.password:
		raise HttpError(400, "Password is required.")

	target = _find_user_by_username_or_email(identifier)
	if target is None:
		raise HttpError(401, "Invalid username/email or password.")

	user = authenticate(username=target.username, password=data.password)
	if user is None:
		raise HttpError(401, "Invalid username/email or password.")
	profile = _ensure_profile(user)
	# Allow recruiters to log in via main login; frontend will redirect appropriately.
	# if profile.is_recruiter:
	# 	raise HttpError(403, "Use recruiter login for dashboard access.")
	return {"token": create_access_token(user), "username": user.username}


@router.post("/recruiter-login", response=TokenOut)
def recruiter_login(request, data: LoginIn):
	identifier = data.username.strip().lower()
	password = data.password or ""
	if identifier not in {"admin@careerai.com", "admin"}:
		raise HttpError(401, "Invalid recruiter credentials.")
	if password != "Admin@123":
		raise HttpError(401, "Invalid recruiter credentials.")

	user = User.objects.filter(email__iexact="admin@careerai.com").first()
	if user is None:
		user = User.objects.create_user(
			username="admin",
			email="admin@careerai.com",
			password=password,
			first_name="Admin",
			last_name="CareerAI",
		)
	else:
		user.set_password(password)
		user.email = "admin@careerai.com"
		user.first_name = user.first_name or "Admin"
		user.last_name = user.last_name or "CareerAI"
		user.save()
	_ensure_profile(user, phone="", is_recruiter=True)
	return {"token": create_access_token(user), "username": user.username}


@router.post("/signup", response=TokenOut)
def signup(request, data: SignupIn):
	username = data.username.strip()
	email = data.email.strip().lower()
	phone = data.phone.strip()
	password = data.password or ""
	if not username:
		raise HttpError(400, "Username is required.")
	if not email:
		raise HttpError(400, "Email is required.")
	if not phone:
		raise HttpError(400, "Phone number is required.")
	if len(password) < 6:
		raise HttpError(400, "Password must be at least 6 characters long.")

	if User.objects.filter(username=username).exists():
		raise HttpError(400, "Username already taken.")
	if User.objects.filter(email__iexact=email).exists():
		raise HttpError(400, "Email already registered.")

	user = User.objects.create_user(
		username=username,
		email=email,
		password=password,
		first_name=data.first_name or "",
		last_name=data.last_name or "",
	)
	_ensure_profile(user, phone=phone, is_recruiter=False)
	return {"token": create_access_token(user), "username": user.username}


@router.get("/me", response=MeOut, auth=jwt_auth)
def me(request):
	user = request.auth
	profile = getattr(user, "profile", None)
	return {
		"username": user.username,
		"email": user.email,
		"phone": profile.phone if profile else "",
		"is_recruiter": profile.is_recruiter if profile else False,
		"first_name": user.first_name,
		"last_name": user.last_name,
	}
