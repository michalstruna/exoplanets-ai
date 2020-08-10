from flask_jwt_extended import create_access_token, get_jwt_identity


class SecurityService:

    def hash(self, text):
        pass

    def verify_hash(self, text, hash):
        pass

    def tokenize(self, data):
        return create_access_token(identity=data)

    def get_request_identity(self):
        return get_jwt_identity()
