from flask_restx import Namespace, Resource, fields


from service.StarService import StarService
from utils.http import Response
from .datasets import dataset


api = Namespace("stars", description="Explored stars.")

star_property = api.model("StarProperty", {
    "dataset": fields.Nested(dataset),
    "name": fields.String(required=True, max_length=50, description="Name of star within dataset."),
    "diameter": fields.Float(min=0, description="Diameter of star in [sun diameters]."),
    "mass": fields.Float(min=0, description="Mass of star [sun masses]."),
    "temperature": fields.Integer(description="Surface temperature of star [K]."),
    "distance": fields.Float(min=0, description="Distance of star from Earth [ly].")
})

star = api.model("Star", {
    "id": fields.String(requred=True, description="Star unique identifier."),
    "name": fields.String(required=True, description="Name of star."),
    "properties": fields.List(fields.Nested(star_property), required=True)
})

star_service = StarService()


@api.route("")
class Stars(Resource):

    @api.marshal_list_with(star, description="Successfully get stars.")
    def get(self):
        return Response.get(lambda: star_service.get_all())


@api.route("/<string:id>")
class Star(Resource):

    @api.marshal_with(star, description="Successfully get star.")
    @api.response(404, "Star with specified ID was not found.")
    @api.expect(fields.String)
    def get(self, id):
        return Response.get(lambda: star_service.get(id))