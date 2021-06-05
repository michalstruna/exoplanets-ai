from flask_jwt_extended import create_access_token, get_jwt_identity
import bcrypt


class SecurityService:

    def hash(self, text, rounds=12):
        return bcrypt.hashpw(text.encode("utf-8"), bcrypt.gensalt(rounds))

    def verify_hash(self, hash, text):
        return bcrypt.checkpw(text.encode("utf-8"), hash)

    def tokenize(self, data):
        return create_access_token(identity=data)

    def get_req_identity(self):
        identity = get_jwt_identity()

        if identity:
            return identity
