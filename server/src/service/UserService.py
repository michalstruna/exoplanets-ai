import requests
from http import HTTPStatus

from .Service import Service



class UserService(Service):

    def __init__(self):
        super().__init__()

        self.setup(self.db.User, [])

    def facebook_login(self, token):
        token_validation = requests.get(f"https://graph.facebook.com/me?access_token={token}")

        if token_validation.status_code != HTTPStatus.OK:
            return None

        identity = token_validation.json()
        print(identity)
        return identity