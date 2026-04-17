import json
import os
from urllib import error, request


GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
REQUEST_TIMEOUT_SEC = 45


def _post_chat(payload: dict) -> str:
	body = json.dumps(payload).encode("utf-8")
	api_key = os.getenv("GROQ_API_KEY", "").strip()
	req = request.Request(
		GROQ_URL,
		data=body,
		headers={
			"Authorization": f"Bearer {api_key}",
			"Content-Type": "application/json",
		},
		method="POST",
	)
	with request.urlopen(req, timeout=REQUEST_TIMEOUT_SEC) as resp:
		raw = resp.read().decode("utf-8")
		data = json.loads(raw)
		return data["choices"][0]["message"]["content"].strip()


def groq_chat_completion(
	system_prompt: str,
	user_prompt: str,
	temperature: float = 0.2,
	*,
	json_object: bool = False,
) -> str:
	api_key = os.getenv("GROQ_API_KEY", "").strip()
	if not api_key:
		raise RuntimeError("GROQ_API_KEY is not configured.")

	base_payload: dict = {
		"model": os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
		"temperature": temperature,
		"messages": [
			{"role": "system", "content": system_prompt},
			{"role": "user", "content": user_prompt},
		],
	}

	tries: list[bool] = [True, False] if json_object else [False]

	for use_json_format in tries:
		payload = {**base_payload}
		if use_json_format:
			payload["response_format"] = {"type": "json_object"}
		try:
			return _post_chat(payload)
		except error.HTTPError as exc:
			detail = exc.read().decode("utf-8", errors="ignore")
			if json_object and use_json_format and exc.code == 400:
				continue
			raise RuntimeError(f"Groq API HTTP error: {exc.code} {detail}") from exc
		except error.URLError as exc:
			raise RuntimeError("Cannot reach Groq API.") from exc
		except (KeyError, IndexError, ValueError) as exc:
			raise RuntimeError("Unexpected Groq API response format.") from exc

	raise RuntimeError("Groq request failed.")
