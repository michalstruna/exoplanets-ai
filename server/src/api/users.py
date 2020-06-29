from flask_restx import Namespace, Resource, fields
from flask import request

from utils.http import Response
from service.UserService import UserService

api = Namespace("users", description="Users and authentication.")

user_score = api.model("UserScore", {
    "rank": fields.Integer(min=1, requred=True, description="User rank."),
    "planets": fields.Integer(min=0, required=True, description="Count of discovered planets.", default=0),
    "stars": fields.Integer(min=0, required=True, description="Count of explored stars.", default=0),
    "time": fields.Integer(min=0, required=True, description="Count of seconds of computing power.", default=0)
})

user_personal = api.model("UserPersonal", {

})

user_activity = api.model("UserActivity", {

})

user = api.model("User", {
    "_id": fields.String(requred=True, description="User unique identifier."),
    "name": fields.String(required=True, description="Name of user."),
    "avatar": fields.String(required=True, description="Url of user avatar."),
    "role": fields.Integer(requred=True, description="Role of user."),
    "score": fields.Nested(user_score),
    "personal": fields.Nested(user_personal),
    "activity": fields.Nested(user_activity)
})

identity = api.inherit("Identity", user, {
    "token": fields.String(required=True, description="Authentication token.")
})

credentials = api.model("Credentials", {
    "email": fields.String(required=True, max_length=200, description="Login email."),
    "password": fields.String(required=True, max_length=200, description="Password of user.")
})

external_credentials = api.model("ExternalCredentials", {
    "token": fields.String(required=True, max_length=200, description="Authentication token from external service like Facebook or Google.")
})

user_service = UserService()


@api.route("/login")
class Login(Resource):

    @api.marshal_with(identity, description="Successfully login user.")
    @api.response(400, "Invalid credentials.")
    @api.expect(credentials)
    def post(self, token):
        pass


@api.route("/login/facebook")
class FacebookLogin(Resource):

    @api.marshal_with(identity, description="Successfully login user.")
    @api.response(400, "Invalid credentials.")
    @api.expect(external_credentials)
    def post(self):
        identity = user_service.facebook_login(request.json["token"])

        if identity or True:
            return Response.ok(identity)
        else:
            return Response.bad_credentials("Facebook token is not valid.")