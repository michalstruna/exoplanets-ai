from flask_jwt_extended.view_decorators import jwt_required
from flask_restx import fields, Resource
from flask_restx._http import HTTPStatus

from api.errors import error
from api.global_stats import logged_item, stats_aggregated
from constants.User import EndpointAuth, UserRole
from service.Dataset import DatasetService
from utils.http import Api, Request, Response
from constants.Dataset import DatasetType

api = Api("datasets", description="Input datasets.")


def map_props(prop):
    if prop in ["type", "name", "priority", "items_getter", "item_getter"]:
        return prop, str

    if prop in [""]:
        return f"stats.{prop}", int

    if prop in ["size", "priority", "created", "modified", "time"]:
        return prop, float


dataset_field = api.ns.model("DatasetField", {
    "name": fields.String(required=True, max_length=50, description="Name of field in dataset."),
    "prefix": fields.String(max_length=20, description="Add field value prefix before processing."),
    "multiple": fields.Float(description="Multiply field value by this coefficient before processing.")
})

dataset_fields = api.ns.model("DatasetFields", {
    "*": fields.Wildcard(fields.String())
})

dataset = api.ns.inherit("Dataset", logged_item, {
    "_id": fields.String(requred=True, description="Dataset unique identifier."),
    "name": fields.String(required=True, description="Name of dataset."),
    "fields": fields.Nested(dataset_fields, required=True, description="Info about dataset fields (columns)."),
    "items_getter": fields.String(required=True, max_length=500, description="URL for obtaining all item names.", example="https://dataset.org?select=name"),
    "type": fields.String(required=True, description="Type of dataset.", enum=DatasetType._member_names_),
    "size": fields.Integer(required=True, description="Count of all items in dataset."),
    "priority": fields.Integer(required=True, min=1, max=5, default=3, description="1 = lowest, 2 = low, 3 = normal, 4 = high, 5 = highest. More prioritized datasets will be processed first."),
    "deleted_items": fields.List(fields.String(required=True), default=[]),
    "stats": fields.Nested(stats_aggregated, required=True, description="Stats of dataset."),
    "index": fields.Integer(min=1)
})

updated_dataset = api.ns.model("UpdatedDataset", {
    "name": fields.String(required=True, description="Name of dataset."),
    "fields": fields.Nested(dataset_fields, required=True, description="Info about dataset fields (columns)."),
    "items_getter": fields.String(required=True, max_length=500, description="URL for obtaining all item names.", example="https://dataset.org?select=name"),
    "priority": fields.Integer(min=1, max=5, default=3, description="1 = lowest, 2 = low, 3 = normal, 4 = high, 5 = highest. More prioritized datasets will be processed first.")
})

new_dataset = api.ns.inherit("NewDataset", updated_dataset, {
    "type": fields.String(required=True, description="Type of dataset.", enum=DatasetType._member_names_)
})

dataset_item = api.ns.model("DatasetItem", {
    "name": fields.String(required=True, description="Name of item.")
})


@api.ns.route("/<string:id>/reset")
class DatasetReset(Resource):

    @api.ns.response(HTTPStatus.OK, "Data from dataset was reset succesfully.")
    @api.ns.response(HTTPStatus.NOT_FOUND, "Dataset with specified ID was not found.", error)
    @jwt_required
    def put(self, id):
        Request.protect({"auth": UserRole.ADMIN}, id)
        return Response.put(lambda: dataset_service.reset(id))

resource_type = {
    "get_all": {"auth": EndpointAuth.ANY},
    "get": {"auth": EndpointAuth.ANY},
    "add": {"auth": UserRole.ADMIN},
    "delete": {"auth": UserRole.ADMIN},
    "update": {"auth": UserRole.ADMIN},
    "rank": {"auth": EndpointAuth.ANY}
}


dataset_service = DatasetService()
api.init(full_model=dataset, new_model=new_dataset, updated_model=updated_dataset, service=dataset_service, model_name="Dataset", map_props=map_props, resource_type=resource_type)
