from flask_restx import fields, Resource
from flask_restx._http import HTTPStatus

from api.users import user
from service.Message import MessageService
from utils.http import Api, Response
from constants.Message import MessageTag
from constants.User import UserRole

api = Api("messages", description="Chat messages and notifications.")

new_message = api.ns.model("NewMessage", {
    "text": fields.String(required=True)
})

message = api.ns.inherit("Message",  new_message, {
    "_id": fields.String(requred=True, description="Message unique identifier."),
    "user": fields.Nested(user, default=None),  # TODO: None not working.
    "tag": fields.String(enum=MessageTag.values(), default=None),
    "created": fields.Integer(required=True)
})

resource_type = {
    "get_all": {"role": UserRole.UNAUTH},
    "get": {"role": UserRole.UNAUTH},
    "delete": {"role": UserRole.ADMIN},
    "add": {"role": UserRole.AUTH, "author": "user_id"}
}

message_service = MessageService()
api.init(full_model=message, new_model=new_message, service=message_service, model_name="Message", resource_type=resource_type)