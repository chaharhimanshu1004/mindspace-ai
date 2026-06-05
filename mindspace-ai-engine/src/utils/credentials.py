import base64
import json
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

_IV_LEN = 12
_TAG_LEN = 16


def _key() -> bytes:
    from src.config import env
    return bytes.fromhex(env.CREDENTIALS_SECRET)


def decrypt_credentials(ciphertext: str) -> dict:
    raw = base64.b64decode(ciphertext)
    iv = raw[:_IV_LEN]
    tag = raw[_IV_LEN:_IV_LEN + _TAG_LEN]
    encrypted = raw[_IV_LEN + _TAG_LEN:]
    aesgcm = AESGCM(_key())
    plaintext = aesgcm.decrypt(iv, encrypted + tag, None)
    return json.loads(plaintext)


def encrypt_credentials(plain: dict) -> str:
    iv = os.urandom(_IV_LEN)
    aesgcm = AESGCM(_key())
    encrypted_with_tag = aesgcm.encrypt(iv, json.dumps(plain).encode(), None)
    ciphertext = encrypted_with_tag[:-_TAG_LEN]
    tag = encrypted_with_tag[-_TAG_LEN:]
    return base64.b64encode(iv + tag + ciphertext).decode()
