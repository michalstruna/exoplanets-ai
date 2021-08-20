from flask_restx import fields, Resource
from flask_restx._http import HTTPStatus
from flask import request

from utils.http import Api, Response
from service.Planet import PlanetService
from constants.Planet import PlanetType, PlanetStatus
from service.Stats import GlobalStatsService


def map_props(prop):
    if prop == "datasets":
        return prop, str

    if prop in ["type", "name", "life_conditions", "semi_major_axis", "transit_depth", "distance"]:
        return f"properties.{prop}", str

    if prop in ["semi_major_axis", "period", "velocity", "inclination", "eccentricity"]:
        return f"properties.orbit.{prop}", float

    if prop in ["diameter", "mass", "density", "distance", "surface_temperature"]:
        return f"properties.{prop}", float


api = Api("planets", description="Discovered planets.")

view = api.ns.model("View", {
    "plot": fields.String(required=True, description="Plotted view."),
    "min_flux": fields.Float(required=True, description="Minimum flux in view."),
    "max_flux": fields.Float(required=True, description="Maximum flux in view.")
})

transit = api.ns.model("Transit", {
    "period": fields.Float(required=True, min=0, description="Period of transit [days]."),
    "depth": fields.Float(required=True, min=0, max=1, description="Relative depth of transit from interval <0; 1>."),
    "duration": fields.Float(required=True, min=0, description="Duration of transit [days]."),
    "local_view": fields.Nested(view),
    "global_view": fields.Nested(view)
})

orbit = api.ns.model("Orbit", {
    "period": fields.Float(min=0, description="Orbital period [Earth days]."),
    "velocity": fields.Float(min=0, description="Average orbital velocity around star."),
    "period": fields.Float(min=0, description="Orbital period [Earth days]."),
    "semi_major_axis": fields.Float(min=0, description="Semi-major axis of planet orbit [au]."),
    "eccentricity": fields.Float(min=0, description="Eccentricity of planet orbit."),
    "inclination": fields.Float(min=0, description="Inclination of planet orbit [°]."),
})

planet_properties = api.ns.model("PlanetProperties", {
    "name": fields.String(required=True, description="Name of planet."),
    "type": fields.String(required=True, enum=PlanetType.values(), description=f"Type of planet."),
    "diameter": fields.Float(min=0, description="Diameter of planet [Earth diameters]."),
    "mass": fields.Float(min=0, description="Mass of planet [Earth masses]."),
    "density": fields.Float(min=0, description="Density of planet [Earth density]."),
    "surface_temperature": fields.Integer(description="Estimated surface temperature [°C]."),
    "surface_gravity": fields.Float(description="Surface gravity [m/s^2]."),
    "life_conditions": fields.String(description="Planet's life conditions."),
    "distance": fields.Float(min=0, description="Distance of planet from Earth [ly]."),
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "processed": fields.Boolean(description="Properties comes from processed dataset, not plain dataset."),
    "transit": fields.Nested(transit, default=None, description="Transit of planet."),
    "orbit": fields.Nested(orbit, default=None, description="Orbit of planet.")
})

planet = api.ns.model("Planet", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "properties": fields.List(fields.Nested(planet_properties), required=True, default=[]),
    "index": fields.Integer(min=1),
    "status": fields.String(required=True, enum=PlanetStatus.values(), description="Sratus of planet.")
})

ranked_planet = api.ns.inherit("RankedPlanet", planet, {
    "value": fields.Float(),
    "distance": fields.Float()
})

planet_ranks = api.ns.model("PlanetRanks", {
    "nearest": fields.List(fields.Nested(ranked_planet)),
    "similar": fields.List(fields.Nested(ranked_planet)),
    "latest": fields.List(fields.Nested(ranked_planet))
})

transit_views = api.ns.model("TransitViews", {
    "local_view": fields.List(fields.Float(required=True)),
    "global_view": fields.List(fields.Float(required=True))
})

transit_classification = api.ns.model("TransitClassification", {
    "is_planet": fields.Boolean(required=True)
})

planet_service = PlanetService()
stats_service = GlobalStatsService()


"""
@api.ns.route("/<string:planet_id>/merge/<string:target_id>")
class MergePlanets(Resource):

    @api.ns.marshal_with(planet, description="Successfully merge planets.")
    @api.ns.response(400, "It's not possible to merge two identical planets.")
    @api.ns.response(404, "Planet with specified ID was not found.")
    @api.ns.response(409, "Specified planets are not around same star.")
    def put(self):
        pass
"""


@api.ns.route("/ranks")
class PlanetRanks(Resource):

    @api.ns.marshal_with(planet_ranks, description="Get planet ranks.")
    def get(self):
        return stats_service.get_planet_ranks()


@api.ns.route("/transit")
class Transit(Resource):

    @api.ns.marshal_with(transit_classification, description="Transit classification.")
    @api.ns.response(HTTPStatus.BAD_REQUEST, f"Transit view is invalid.")
    @api.ns.expect(transit_views)
    def post(self):
        views = request.get_json()
        return Response.post(lambda: {"is_planet": planet_service.is_planet(views["global_view"], views["local_view"])})


api.init(full_model=planet, new_model=planet_properties, service=planet_service, model_name="Planet", map_props=map_props)
