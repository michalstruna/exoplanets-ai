from flask_restx import fields, Resource

from utils.http import Api
from service.Planet import PlanetService
from constants.Database import PlanetType, PlanetStatus


def map_props(prop):
    if prop == "datasets":
        return prop, str

    if prop in ["type", "name", "life_conditions", "semi_major_axis", "transit_depth", "distance"]:
        return f"properties.{prop}", str

    if prop in ["diameter", "mass", "density", "semi_major_axis", "distance", "orbital_period", "orbital_velocity", "surface_temperature"]:
        return f"properties.{prop}", float


api = Api("planets", description="Discovered planets.")

transit = api.ns.model("Transit", {
    "period": fields.Float(required=True, min=0, description="Period of transit [days]."),
    "depth": fields.Float(required=True, min=0, max=1, description="Relative depth of transit from interval <0; 1>."),
    "duration": fields.Float(required=True, min=0, description="Duration of transit [days].")
})

planet_properties = api.ns.model("PlanetProperties", {
    "name": fields.String(required=True, description="Name of planet."),
    "type": fields.String(required=True, enum=PlanetType.values(), description=f"Type of planet."),
    "diameter": fields.Float(min=0, description="Diameter of planet [Earth diameters]."),
    "mass": fields.Float(min=0, description="Mass of planet [Earth masses]."),
    "density": fields.Float(min=0, description="Density of planet [Earth density]."),
    "orbital_period": fields.Float(min=0, description="Orbital period [Earth days]."),
    "orbital_velocity": fields.Float(min=0, description="Average orbital velocity around star."),
    "surface_temperature": fields.Integer(description="Estimated surface temperature [°C]."),
    "surface_gravity": fields.Float(description="Surface gravity [m/s^2]."),
    "semi_major_axis": fields.Float(min=0, description="Semi-major axis of planet orbit [au]."),
    "life_conditions": fields.String(description="Planet's life conditions."),
    "distance": fields.Float(min=0, description="Distance of planet from Earth [ly]."),
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "processed": fields.Boolean(description="Properties comes from processed dataset, not plain dataset."),
    "transit": fields.Nested(transit, default=None, description="Transit of planet's host star.")
})

planet = api.ns.model("Planet", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "properties": fields.List(fields.Nested(planet_properties), required=True, default=[]),
    "index": fields.Integer(min=1),
    "status": fields.String(required=True, enum=PlanetStatus.values(), description="Sratus of planet.")
})

planet_service = PlanetService()


@api.ns.route("/<string:planetId>/merge/<string:targetId>")
class MergePlanets(Resource):

    @api.ns.marshal_with(planet, description="Successfully merge planets.")
    @api.ns.response(400, "It's not possible to merge two identical planets.")
    @api.ns.response(404, "Planet with specified ID was not found.")
    @api.ns.response(409, "Specified planets are not around same star.")
    def put(self):
        pass


api.init(full_model=planet, new_model=planet_properties, service=planet_service, model_name="Planet", map_props=map_props)
