from ninja import Schema


class LoginIn(Schema):
	username: str
	password: str


class SignupIn(Schema):
	username: str
	email: str
	phone: str = ""
	password: str
	first_name: str = ""
	last_name: str = ""


class TokenOut(Schema):
	token: str
	username: str


class MeOut(Schema):
	username: str
	email: str
	phone: str
	is_recruiter: bool
	first_name: str
	last_name: str
