from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load env for Groq and other secrets (never commit real keys).
# Later loads override earlier (repo root → Next local → backend wins).
load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(BASE_DIR.parent / ".env.local", override=True)
load_dotenv(BASE_DIR / ".env", override=True)

SECRET_KEY = "hireonix-dev-key-change-in-production"

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]"]

INSTALLED_APPS = [
	"django.contrib.admin",
	"django.contrib.auth",
	"django.contrib.contenttypes",
	"django.contrib.sessions",
	"django.contrib.messages",
	"django.contrib.staticfiles",
	"corsheaders",
	"users",
	"interviews",
	"career_mapper",
	"parallel_insights",
	"jobs",
]

MIDDLEWARE = [
	"corsheaders.middleware.CorsMiddleware",
	"django.middleware.security.SecurityMiddleware",
	"django.contrib.sessions.middleware.SessionMiddleware",
	"django.middleware.common.CommonMiddleware",
	"django.middleware.csrf.CsrfViewMiddleware",
	"django.contrib.auth.middleware.AuthenticationMiddleware",
	"django.contrib.messages.middleware.MessageMiddleware",
	"django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "hireonix.urls"

TEMPLATES = [
	{
		"BACKEND": "django.template.backends.django.DjangoTemplates",
		"DIRS": [],
		"APP_DIRS": True,
		"OPTIONS": {
			"context_processors": [
				"django.template.context_processors.debug",
				"django.template.context_processors.request",
				"django.contrib.auth.context_processors.auth",
				"django.contrib.messages.context_processors.messages",
			],
		},
	},
]

WSGI_APPLICATION = "hireonix.wsgi.application"

DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.sqlite3",
		"NAME": BASE_DIR / "db.sqlite3",
	}
}

AUTH_PASSWORD_VALIDATORS = [
	{"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
	{"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
	{"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
	{"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Dev: allow browser → Django when NEXT_PUBLIC_API_URL points here (any localhost port).
if DEBUG:
	CORS_ALLOW_ALL_ORIGINS = True
else:
	CORS_ALLOWED_ORIGINS = [
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	]
CORS_ALLOW_CREDENTIALS = True
