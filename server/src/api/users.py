from flask_restx import Resource, fields
from flask import request
from flask_restx._http import HTTPStatus

from api.global_stats import stats_aggregated, logged_item
from constants.User import UserRole, Sex
from utils.http import Api, Response, Request
from service.User import UserService

api = Api("users", "Users and authentication.")


def map_props(prop):
    if prop in ["planets", "items", "time", "data"]:
        return f"stats.{prop}.value", str

    if prop in ["planets_diff", "items_diff", "time_diff", "data_diff"]:
        return f"stats.{prop[:-5]}.diff", str

    if prop in ["created", "modified", "role"]:
        return prop, int

    if prop in ["name"]:
        return prop, str

    if prop in ["sex", "country", "contact", "text"]:
        return f"personal.{prop}", str

    if prop in ["birth"]:
        return f"personal.{prop}", int


user_personal = api.ns.model("UserPersonal", {
    "sex": fields.String(enum=Sex.values()),
    "country": fields.String(max_length=10),
    "birth": fields.Integer(),
    "contact": fields.String(),
    "text": fields.String()
})

user = api.ns.inherit("User", logged_item, {
    "_id": fields.String(requred=True, description="User unique identifier."),
    "name": fields.String(required=True, description="Name of user."),
    "avatar": fields.String(required=True, description="Url of user avatar."),
    "role": fields.Integer(requred=True, description="Role of user."),
    "stats": fields.Nested(stats_aggregated, required=True, description="Stats of user."),
    "personal": fields.Nested(user_personal),
    "online": fields.Boolean(required=True, description="User is online."),
    "index": fields.Integer(min=1)
})

updated_user = api.ns.model("UpdatedUser", {
    "personal": fields.Nested(user_personal),
    "avatar": fields.String,
    "password": fields.String,
    "old_password": fields.String
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
    @api.ns.response(HTTPStatus.BAD_REQUEST, "Invalid credentials.")
    @api.ns.expect(external_credentials)
    def post(self):
        result = user_service.facebook_login(request.get_json()["token"])
        return result if result else Response.bad_credentials("Facebook token is not valid.")

@api.ns.route("/login/google")
class GoogleLogin(Resource):

    @api.ns.marshal_with(identity, description="Successfully login user.")
    @api.ns.response(HTTPStatus.BAD_REQUEST, "Invalid credentials.")
    @api.ns.expect(external_credentials)
    def post(self):
        result = user_service.google_login(request.get_json()["token"])
        return result if result else Response.bad_credentials("Google token is not valid.")


resource_type = {
    "get_all": {"role": UserRole.UNAUTH},
    "get": {"role": UserRole.UNAUTH},
    "delete": {"role": UserRole.ADMIN},
    "update": {"role": UserRole.MYSELF},
    "rank": {"role": UserRole.UNAUTH}
}

api.init(service=user_service, full_model=user, updated_model=updated_user, resource_type=resource_type, model_name="User", map_props=map_props)