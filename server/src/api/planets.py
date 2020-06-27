from flask_restx import Namespace, Resource, fields

from utils.http import Response

api = Namespace("planets", description="Discovered planets.")

transit = api.model("Transit", {
    "period": fields.Float(required=True, min=0, description="Period of transit [days]."),
    "depth": fields.Float(required=True, min=0, max=1, description="Relative depth of transit from interval <0; 1>."),
    "duration": fields.Float(required=True, min=0, description="Duration of transit [days].")
})

planet_properties = api.model("PlanetProperties", {
    "name": fields.String(required=True, description="Name of planet."),
    "diameter": fields.Float(min=0, description="Diameter of planet [Earth diameters]."),
    "mass": fields.Float(min=0, description="Mass of planet [Earth masses]."),
    "density": fields.Float(min=0, description="Density of planet [Earth density]."),
    "semi_major_axis": fields.Float(min=0, description="Semi-major axis of planet orbit [AU]."),
    "live_conditions": fields.String(description="Planet's live conditions."),
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "transit": fields.Nested(transit, default=None, description="Transit of planet's host star.")
})

planet = api.model("Planet", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "properties": fields.List(fields.Nested(planet_properties), required=True, default=[]),
    "star": fields.Nested(planet_properties)  # TODO: Star
})


@api.route("")
class Planets(Resource):

    @api.marshal_list_with(planet, description="Successfully get planets.")
    def get(self):
        pass


@api.route("/<string:id>")
class Planet(Resource):

    @api.marshal_with(planet, description="Successfully get planet.")
    def get(self):
        pass