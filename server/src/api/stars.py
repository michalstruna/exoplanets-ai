from flask_restx import fields

from constants.Database import StarType, SpectralClass
from service.Star import StarService
from utils.http import Api
from .planets import planet


api = Api("stars", description="Explored stars.")

new_star = api.ns.model("NewStar", {
    "name": fields.String(required=True, max_length=50, description="Name of star within dataset."),
    "diameter": fields.Float(min=0, description="Diameter of star in [sun diameters]."),
    "mass": fields.Float(min=0, description="Mass of star [sun masses]."),
    "surface_temperature": fields.Integer(description="Surface temperature of star [K]."),
    "distance": fields.Float(min=0, description="Distance of star from Earth [ly].")
})

star_properties = api.ns.inherit("StarProperties", new_star, {
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "density": fields.Integer(min=0, description="Density of star [kg/m^3]."),
    "gravity": fields.Integer(min=0, description="Surface gravity [m/s^2]."),
    "luminosity": fields.Float(min=0, description="Star luminosity [sun luminosity]."),
    "type": fields.String(enum=StarType.values(), description="Type of star."),
    "spectral_type": fields.String(enum=SpectralClass.values(), description="Spectral type of star.")
})

light_curve = api.ns.model("LightCurve", {
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which light curve originates."),
    "planets": fields.List(fields.Nested(planet), required=True)
})

star = api.ns.model("Star", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "properties": fields.List(fields.Nested(star_properties), required=True, default=[]),
    "light_curve": fields.List(fields.Nested(light_curve), required=True, default=[]),
    "planets": fields.List(fields.Nested(planet))
})

star_service = StarService()
api.init(full_model=star, new_model=star_properties, service=star_service, model_name="Star")