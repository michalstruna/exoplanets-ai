import requests
from http import HTTPStatus
from mongoengine.errors import DoesNotExist
from datetime import datetime

from .Service import Service
from .SecurityService import SecurityService


class UserService(Service):

    def __init__(self):
        super().__init__()
        self.security_service = SecurityService()
        self.setup(self.db.User, [])

    def facebook_login(self, token):
        # TODO: FacebookService or ExternalService?
        fb_profile_res = requests.get(f"https://graph.facebook.com/me?fields=id,name,gender,email,birthday,picture.width(200).height(200),address,location{'{location{city,state,region_id}}'}&access_token={token}")

        if fb_profile_res.status_code != HTTPStatus.OK:
            return None

        identity = fb_profile_res.json()

        try:
            user = self.get_by_filter({"fb_id": identity["id"]})
        except DoesNotExist:
            user = self.add({
                "name": identity["name"],
                "fb_id": identity["id"],
                "avatar": identity["picture"]["data"]["url"],
                "personal": {
                    "is_male": identity["gender"] != "female",
                    "birth": datetime.timestamp(datetime.strptime(identity["birthday"], "%d/%m/%Y")),
                    "country": "CZ"  # TODO
                }
            })

        user["token"] = self.security_service.tokenize({"_id": str(user["_id"])})
        user["score"] = {}
        user["score"]["rank"] = 12

        # TODO: Token
        return user
