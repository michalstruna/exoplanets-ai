from flask_restx import Namespace, Resource, fields
from flask import request

from service.PipelineService import PipelineService
from utils.http import Response

api = Namespace("pipelines", description="Input data pipelines.")

dataset = api.model("Dataset", {
    "name": fields.String(required=True, description="Name of dataset."),
    "map_fields": fields.Raw(description="Map fields in dataset to fields in app."),
    "url_getter": fields.String(required=True, max_length=500, description="URL for obtaining data. {#} is wildcard for item name.", example="https://dataset.org?name={#}")
})

new_pipeline = api.model("NewPipeline", {
    "name": fields.String(required=True, description="Name of pipeline."),
    "star_dataset": fields.Nested(dataset, description="Dataset for star properties obtaining."),
    "light_curve_dataset": fields.Nested(dataset, description="Dataset for light curve obtaining.")
})

pipeline = api.inherit("Pipeline", new_pipeline, {
    "id": fields.String(required=True, description="Pipeline unique identifier.")
})

pipeline_service = PipelineService()


@api.route("")
class Pipelines(Resource):

    @api.marshal_list_with(pipeline, description="Successfully get pipelines.")
    def get(self):
        return Response.get(lambda: pipeline_service.get_all())

    @api.marshal_with(pipeline, description="Pipeline was successfully created.")
    @api.response(400, "Pipeline is invalid.")
    @api.response(409, "Pipeline is duplicate.")
    @api.expect(new_pipeline)
    def post(self):
        return Response.post(lambda: pipeline_service.add(request.get_json()))


@api.route("/<string:id>")
class Pipeline(Resource):

    @api.marshal_with(pipeline, code=201, description="Successfully get pipeline.")
    @api.response(404, "Pipeline with specified ID was not found.")
    @api.expect(fields.String)
    def get(self, id):
        return Response.get(lambda: pipeline_service.get(id))

    @api.marshal_with(None, code=204, description="Pipeline was successfully deleted.")
    @api.response(404, "Pipeline with specified ID was not found.")
    @api.expect(fields.String)
    def delete(self, id):
        return Response.delete(lambda: pipeline_service.delete(id))

    @api.marshal_with(pipeline, description="Successfully get pipeline.")
    @api.response(400, "Pipeline is invalid.")
    @api.response(404, "Pipeline with specified ID was not found.")
    @api.response(409, "Pipeline is duplicate.")
    @api.expect(fields.String)
    def put(self, id):
        return Response.put(lambda: pipeline_service.update(id, request.get_json()))