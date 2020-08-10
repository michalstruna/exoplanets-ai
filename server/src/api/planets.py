from flask_restx import fields

from utils.http import Api
from service.Planet import PlanetService


def map_sort(sort):
    if sort == "datasets":
        return sort

    if sort in ["type", "name", "diameter", "mass", "density", "semi_major_axis", "distance", "datasets", "orbital_period", "orbital_velocity", "surface_temperature", "life_conditions", "semi_major_axis", "transit_depth", "distance"]:
        return f"properties.{sort}"


api = Api("planets", description="Discovered planets.")

transit = api.ns.model("Transit", {
    "period": fields.Float(required=True, min=0, description="Period of transit [days]."),
    "depth": fields.Float(required=True, min=0, max=1, description="Relative depth of transit from interval <0; 1>."),
    "duration": fields.Float(required=True, min=0, description="Duration of transit [days].")
})

planet_properties = api.ns.model("PlanetProperties", {
    "name": fields.String(required=True, description="Name of planet."),
    "diameter": fields.Float(min=0, description="Diameter of planet [Earth diameters]."),
    "mass": fields.Float(min=0, description="Mass of planet [Earth masses]."),
    "density": fields.Float(min=0, description="Density of planet [Earth density]."),
    "orbital_period": fields.Float(min=0, description="Orbital period [Earth days]."),
    "orbital_velocity": fields.Float(min=0, description="Average orbital velocity around star."),
    "surface_temperature": fields.Integer(description="Estimated surface temperature [°C]."),
    "semi_major_axis": fields.Float(min=0, description="Semi-major axis of planet orbit [au]."),
    "live_conditions": fields.String(description="Planet's live conditions."),
    "distance": fields.Float(min=0, description="Distance of planet from Earth [ly]."),
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "transit": fields.Nested(transit, default=None, description="Transit of planet's host star.")
})

planet = api.ns.model("Planet", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "properties": fields.List(fields.Nested(planet_properties), required=True, default=[])
})

planet_service = PlanetService()
api.init(full_model=planet, new_model=planet_properties, service=planet_service, model_name="Planet", map_sort=map_sort)