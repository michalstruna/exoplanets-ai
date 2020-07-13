from flask_restx import Resource, fields

from service.DatasetService import DatasetService
from utils.http import Response, Api
from constants.Dataset import DatasetType

api = Api("datasets", description="Input datasets.")

dataset_field = api.ns.model("DatasetField", {
    "name": fields.String(required=True, max_length=50, description="Name of field in dataset."),
    "prefix": fields.String(max_length=20, description="Add field value prefix before processing."),
    "multiple": fields.Float(description="Multiply field value by this coefficient before processing.")
})

dataset_fields = api.ns.model("DatasetFields", {
    "*": fields.Wildcard(fields.Nested(dataset_field))
})

dataset = api.ns.model("Dataset", {
    "_id": fields.String(requred=True, description="Dataset unique identifier."),
    "name": fields.String(required=True, description="Name of dataset."),
    "fields": fields.Nested(dataset_fields, required=True, description="Info about dataset fields (columns)."),
    "items_getter": fields.String(required=True, max_length=500, description="URL for obtaining all item names.",
                                  example="https://dataset.org?select=name"),
    "type": fields.String(required=True, description="Type of dataset.", enum=DatasetType._member_names_),
    "total_size": fields.Integer(required=True, description="Count of all items in dataset."),
    "current_size": fields.Integer(required=True, description="Count of not yet processed items in dataset."),
    "processed": fields.Integer(required=True, description="Count of processed bytes from dataset."),
    "created": fields.Integer(required=True, description="Timestamp of dataset publication [s]."),
    "modified": fields.Integer(required=True, description="Timestamp of last dataset change [s]."),
    "time": fields.Integer(required=True, description="Total process time in dataset [s]."),
    "priority": fields.Integer(required=True, min=1, max=5, default=3, description="1 = lowest, 2 = low, 3 = normal, 4 = high, 5 = highest. More prioritized datasets will be processed first.")
})

new_dataset = api.ns.model("NewDataset", {
    "name": fields.String(required=True, description="Name of dataset."),
    "fields": fields.Nested(dataset_fields, required=True, description="Info about dataset fields (columns)."),
    "type": fields.String(required=True, description="Type of dataset.", enum=DatasetType._member_names_),
    "items_getter": fields.String(required=True, max_length=500, description="URL for obtaining all item names.", example="https://dataset.org?select=name"),
    "priority": fields.Integer(min=1, max=5, default=3, description="1 = lowest, 2 = low, 3 = normal, 4 = high, 5 = highest. More prioritized datasets will be processed first.")
})

dataset_item = api.ns.model("DatasetItem", {
    "name": fields.String(required=True, description="Name of item.")
})

dataset_service = DatasetService()
api.init(full_model=dataset, new_model=new_dataset, service=dataset_service, model_name="Dataset")


@api.ns.route("/<string:id>/item")
class DatasetItem(Resource):

    @api.ns.marshal_with(dataset_item, description="Successfully get first unprocessed item from dataset.")
    @api.ns.response(400, "Dataset is empty, so there are no items to process.")
    @api.ns.response(404, "Dataset with specified ID was not found or is empty.")
    def get(self, id):
        return Response.get(lambda: dataset_service.get_item_from_dataset(id))


@api.ns.route("/<string:id>/item/<string:name>/process")
class DatasetItem(Resource):

    @api.ns.marshal_with(dataset, description="Successfully process item from dataset.")
    def put(self):
        pass