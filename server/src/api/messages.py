from flask_restx import fields

from api.users import user
from service.Message import MessageService
from utils.http import Api
from constants.Message import MessageTag
from constants.User import EndpointAuth, UserRole

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

def modify_new(item, author):
    item["user_id"] = author["_id"]
    
    if "tag" in item:
        del item["tag"]

resource_type = {
    "get_all": {"auth": EndpointAuth.ANY},
    "get": {"auth": EndpointAuth.ANY},
    "delete": {"auth": UserRole.MOD},
    "add": {"auth": UserRole.AUTH, "modify": modify_new}
}

message_service = MessageService()
api.init(full_model=message, new_model=new_message, service=message_service, model_name="Message", resource_type=resource_type)