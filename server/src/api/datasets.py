from flask_restx import Namespace, Resource, fields
from flask import request


from service.DatasetService import DatasetService
from utils.http import Response
from constants.Dataset import DatasetType


api = Namespace("datasets", description="Input datasets.")

dataset_field = api.model("DatasetField", {
    "name": fields.String(required=True, max_length=50, description="Name of field in dataset."),
    "prefix": fields.String(max_length=20, description="Add field value prefix before processing."),
    "multiple": fields.Float(description="Multiply field value by this coefficient before processing.")
})

dataset_fields = api.model("DatasetFields", {
    "*": fields.Wildcard(fields.Nested(dataset_field))
})

dataset = api.model("Dataset", {
    "_id": fields.String(requred=True, description="Dataset unique identifier."),
    "name": fields.String(required=True, description="Name of dataset."),
    "fields": fields.Nested(dataset_fields, required=True, description="Info about dataset fields (columns)."),
    "items_getter": fields.String(required=True, max_length=500, description="URL for obtaining all item names.", example="https://dataset.org?select=name"),
    "type": fields.String(required=True, description="Type of dataset.", enum=DatasetType._member_names_),
    "total_size": fields.Integer(required=True, description="Count of all items in dataset."),
    "current_size": fields.Integer(required=True, description="Count of not yet processed items in dataset.")
})

new_dataset = api.model("NewDataset", {
    "name": fields.String(required=True, description="Name of dataset."),
    "fields": fields.Nested(dataset_fields, required=True, description="Info about dataset fields (columns)."),
    "type": fields.String(required=True, description="Type of dataset.", enum=DatasetType._member_names_),
    "items_getter": fields.String(required=True, max_length=500, description="URL for obtaining all item names.", example="https://dataset.org?select=name")
})

dataset_item = api.model("DatasetItem", {
    "name": fields.String(required=True, description="Name of item.")
})

dataset_service = DatasetService()


@api.route("")
class Datasets(Resource):

    @api.marshal_list_with(dataset, description="Successfully get datasets.")
    def get(self):
        return Response.get(lambda: dataset_service.get_all())

    @api.marshal_with(dataset, code=201, description="Dataset was successfully created.")
    @api.response(400, "Dataset is invalid.")
    @api.response(409, "Dataset has duplicate name.")
    @api.expect(new_dataset)
    def post(self):
        return Response.post(lambda: dataset_service.add(request.get_json()))


@api.route("/<string:id>")
class Dataset(Resource):

    @api.marshal_with(dataset, description="Successfully get dataset.")
    @api.response(404, "Dataset with specified ID was not found.")
    @api.expect(fields.String)
    def get(self, id):
        return Response.get(lambda: dataset_service.get(id))

    @api.marshal_with(None, code=204, description="Dataset was successfully deleted.")
    @api.response(404, "Dataset with specified ID was not found.")
    @api.expect(fields.String)
    def delete(self, id):
        return Response.delete(lambda: dataset_service.delete(id))

    @api.marshal_with(dataset, description="Successfully get dataset.")
    @api.response(400, "Dataset is invalid.")
    @api.response(404, "Dataset with specified ID was not found.")
    @api.response(409, "Dataset is duplicate.")
    @api.expect(fields.String)
    def put(self, id):
        return Response.put(lambda: dataset_service.update(id, request.get_json()))


@api.route("/<string:id>/item")
class DatasetItem(Resource):

    @api.marshal_with(dataset_item, description="Successfully get first unprocessed item from dataset.")
    @api.response(400, "Dataset is empty, so there are no items to process.")
    @api.response(404, "Dataset with specified ID was not found or is empty.")
    def get(self, id):
        return Response.get(lambda: dataset_service.get_item_from_dataset(id))


@api.route("/<string:id>/item/<string:name>/process")
class DatasetItem(Resource):

    @api.marshal_with(dataset, description="Successfully process item from dataset.")
    def put(self):
        pass