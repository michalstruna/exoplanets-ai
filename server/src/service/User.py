import requests
from http import HTTPStatus
from mongoengine.errors import DoesNotExist
from datetime import datetime

from utils.exceptions import BadCredentials, Invalid
from .Base import Service
from .Security import SecurityService
import db
from .Stats import GlobalStatsService


class UserService(Service):

    def __init__(self):
        super().__init__(db.user_dao)
        self.security_service = SecurityService()
        self.stats_service = GlobalStatsService()

    def local_sign_up(self, credentials):
        self.add({
            "username": credentials["username"],
            "name": credentials["name"],
            "password": credentials["password"]
        })

        self.stats_service.add(volunteers=1)

        return self.local_login(credentials)

    def local_login(self, credentials):
        try:
            user = self.get({"username": credentials["username"]})
        except DoesNotExist:
            raise BadCredentials("Bad credentials.")

        if self.security_service.verify_hash(user["password"], credentials["password"]):
            user = self.update(user["_id"], {"online": True})
            user["token"] = self.security_service.tokenize({"_id": str(user["_id"])})  # TODO: Is str() neccesary?
            return user
        else:
            raise BadCredentials("Bad credentials.")

    def facebook_login(self, token):
        fb_profile_res = requests.get(f"https://graph.facebook.com/me?fields=id,name,gender,email,birthday,picture.width(200).height(200),address,location{'{location{city,state,region_id}}'}&access_token={token}")

        if fb_profile_res.status_code != HTTPStatus.OK:
            return None

        identity = fb_profile_res.json()

        try:
            user = self.get({"fb_id": identity["id"]})
        except DoesNotExist:
            user = self.add({
                "name": identity["name"],
                "fb_id": identity["id"],
                "avatar": identity["picture"]["data"]["url"],
                "personal": {
                    "sex": identity["gender"] == "female",
                    "birth": datetime.timestamp(datetime.strptime(identity["birthday"], "%d/%m/%Y")),
                    "country": "CZ"  # TODO
                }
            })

            self.stats_service.add(volunteers=1)

        user = self.update(user["_id"], {"online": True})
        user["token"] = self.security_service.tokenize({"_id": str(user["_id"])})
        return user

    def update(self, id, item, with_return=True):
        if "password" in item and item["password"]:  # Verify old password if password changed.
            user = self.get_by_id(id)

            if "password" in user:
                if "old_password" not in item or not self.security_service.verify_hash(user["password"], item["old_password"]):
                    raise Invalid("Invalid password.")
            else:
                del item["password"]

        if "old_password" in item:
            del item["old_password"]

        return super().update(id, item, with_return)


