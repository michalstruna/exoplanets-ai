from flask_restx import Resource, fields
from flask import request
from flask_restx._http import HTTPStatus

from constants.User import UserRole
from utils.http import Api, Response
from service.User import UserService

api = Api("users", description="Users and authentication.")

user_score = api.ns.model("UserScore", {
    "rank": fields.Integer(min=1, requred=True, description="User rank."),
    "planets": fields.Integer(min=0, required=True, description="Count of discovered planets.", default=0),
    "stars": fields.Integer(min=0, required=True, description="Count of explored stars.", default=0),
    "time": fields.Integer(min=0, required=True, description="Count of seconds of computing power.", default=0)
})

user_personal = api.ns.model("UserPersonal", {
    "is_male": fields.Boolean(),
    "country": fields.String(max_length=10),
    "birth": fields.Integer()
})

user_activity = api.ns.model("UserActivity", {

})

user = api.ns.model("User", {
    "_id": fields.String(requred=True, description="User unique identifier."),
    "name": fields.String(required=True, description="Name of user."),
    "avatar": fields.String(required=True, description="Url of user avatar."),
    "role": fields.Integer(requred=True, description="Role of user."),
    "score": fields.Nested(user_score),
    "personal": fields.Nested(user_personal),
    "activity": fields.Nested(user_activity)
})

identity = api.ns.inherit("Identity", user, {
    "token": fields.String(required=True, description="Authentication token.")
})

local_login_credentials = api.ns.model("Credentials", {
    "username": fields.String(required=True, max_length=200, description="Login username (probably email)."),
    "password": fields.String(required=True, max_length=200, description="Password of user.")
})

local_sign_up_credentials = api.ns.inherit("LocalSignUpCredentials", local_login_credentials, {
    "name": fields.String(required=True, max_length=20, description="Displayed name.")
})

external_credentials = api.ns.model("ExternalCredentials", {
    "token": fields.String(required=True, max_length=200, description="Authentication token from external service like Facebook or Google.")
})

user_service = UserService()


@api.ns.route("/sign-up")
class SignUp(Resource):

    @api.ns.marshal_with(identity, description="Sucessfully registered user.")
    @api.ns.response(HTTPStatus.BAD_REQUEST, "Invalid credentials.")
    @api.ns.response(HTTPStatus.CONFLICT, "User with specified username already exists.")
    @api.ns.expect(local_sign_up_credentials)
    def post(self):
        return Response.post(lambda: user_service.local_sign_up(request.get_json()))


@api.ns.route("/login")
class Login(Resource):

    @api.ns.marshal_with(identity, description="Successfully login user.")
    @api.ns.response(HTTPStatus.BAD_REQUEST, "Invalid credentials.")
    @api.ns.expect(local_login_credentials)
    def post(self):
        return Response.get(lambda: user_service.local_login(request.get_json()))


@api.ns.route("/login/facebook")
class FacebookLogin(Resource):

    @api.ns.marshal_with(identity, description="Successfully login user.")
    @api.ns.response(400, "Invalid credentials.")
    @api.ns.expect(external_credentials)
    def post(self):
        if identity:
            return user_service.facebook_login(request.get_json()["token"])
        else:
            return Response.bad_credentials("Facebook token is not valid.")


resource_type = {
    "get_all": {"role": UserRole.UNAUTH},
    "get": {"role": UserRole.UNAUTH},
    "delete": {"role": UserRole.ADMIN}
}

api.init(service=user_service, full_model=user, resource_type=resource_type, model_name="User")