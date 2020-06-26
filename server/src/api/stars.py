from flask_restx import Namespace, Resource, fields

from service.StarService import StarService
from utils.http import Response
from .planets import planet


api = Namespace("stars", description="Explored stars.")

star_properties = api.model("StarProperties", {
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "name": fields.String(required=True, max_length=50, description="Name of star within dataset."),
    "diameter": fields.Float(min=0, description="Diameter of star in [sun diameters]."),
    "mass": fields.Float(min=0, description="Mass of star [sun masses]."),
    "temperature": fields.Integer(description="Surface temperature of star [K]."),
    "distance": fields.Float(min=0, description="Distance of star from Earth [ly]."),
})

light_curve = api.model("LightCurve", {
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which light curve originates."),
    "planets": fields.List(fields.Nested(planet), required=True)
})

star = api.model("Star", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "name": fields.String(required=True, description="Name of star."),
    "properties": fields.List(fields.Nested(star_properties), required=True, default=[]),
    "light_curve": fields.List(fields.Nested(light_curve), required=True, default=[])
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