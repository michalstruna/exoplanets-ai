from flask_restx import fields, Resource

from constants.Database import SpectralClass, SpectralSubclass, LuminosityClass, LuminositySubclass
from service.Star import StarService
from utils.http import Api
from .planets import planet


def map_props(prop):
    if prop.startswith("planet_"):
        prop = prop[7:]

        if prop in ["diameter", "mass", "density", "surface_temperature", "semi_major_axis", "orbital_period", "transit_depth", "surface_gravity", "orbital_velocity"]:
            return f"planets.properties.{prop}", float

        if prop in ["life_conditions", "status"]:
            return f"planets.properties.{prop}", str
    else:
        if prop in ["spectral_class", "luminosity_class"]:
            return f"properties.type.{prop}", str

        if prop in ["type", "name", "life_conditions", "semi_major_axis", "transit_depth", "distance", "dataset"]:
            return f"properties.{prop}", str

        if prop in ["diameter", "mass", "density", "surface_temperature", "distance", "luminosity", "transit_depth", "planets", "surface_gravity", "absolute_magnitude", "apparent_magnitude", "metallicity", "datasets"]:
            return f"properties.{prop}", float


api = Api("stars", description="Explored stars.")

new_star = api.ns.model("NewStar", {
    "name": fields.String(required=True, max_length=50, description="Name of star within dataset."),
    "diameter": fields.Float(min=0, description="Diameter of star in [sun diameters]."),
    "mass": fields.Float(min=0, description="Mass of star [sun masses]."),
    "surface_temperature": fields.Integer(description="Surface temperature of star [K]."),
    "apparent_magnitude": fields.Float(description="Apparent magnitude of star."),
    "metallicity": fields.Float(description="Metallicity of star."),
    "distance": fields.Float(min=0, description="Distance of star from Earth [ly].")
})

star_type = api.ns.model("StarType", {
    "luminosity_class": fields.String(enum=LuminosityClass.values()),
    "luminosity_subclass": fields.String(enum=LuminositySubclass.values()),
    "spectral_class": fields.String(enum=SpectralClass.values()),
    "spectral_subclass": fields.String(enum=SpectralSubclass.values())
})

star_properties = api.ns.inherit("StarProperties", new_star, {
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "density": fields.Float(min=0, description="Density of star [kg/m^3]."),
    "surface_gravity": fields.Float(min=0, description="Surface gravity [m/s^2]."),
    "luminosity": fields.Float(min=0, description="Star luminosity [sun luminosity]."),
    "absolute_magnitude": fields.Float(description="Absolute magnitude of star."),
    "type": fields.Nested(star_type, default={})
})

light_curve = api.ns.model("LightCurve", {
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which light curve originates."),
    "planets": fields.List(fields.Nested(planet), required=True)
})

star = api.ns.model("Star", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "properties": fields.List(fields.Nested(star_properties), required=True, default=[]),
    "light_curve": fields.List(fields.Nested(light_curve), required=True, default=[]),
    "planets": fields.List(fields.Nested(planet), default=[]),
    "index": fields.Integer(min=1)
})


star_service = StarService()


@api.ns.route("/<string:starId>/merge/<string:targetId>")
class MergePlanets(Resource):

    @api.ns.marshal_with(star, description="Successfully merge stars.")
    @api.ns.response(400, "It's not possible to merge two identical stars.")
    @api.ns.response(404, "Star with specified ID was not found.")
    def put(self):
        pass


api.init(full_model=star, new_model=star_properties, service=star_service, model_name="Star", map_props=map_props)
