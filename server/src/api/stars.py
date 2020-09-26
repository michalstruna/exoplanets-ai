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

        if prop in ["life_conditions", "status", "type"]:
            return f"planets.properties.{prop}", str
    else:
        if prop in ["spectral_class", "luminosity_class"]:
            return f"properties.type.{prop}", str

        if prop == "name":
            return [f"properties.{prop}", f"light_curves.{prop}"], str

        if prop in ["type", "life_conditions", "semi_major_axis", "transit_depth", "distance", "dataset"]:
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
    "distance": fields.Float(min=0, description="Distance of star from Earth [ly]."),
    "ra": fields.Float(description=""),
    "dec": fields.Float(descritpion="Declination.")
})

star_type = api.ns.model("StarType", {
    "luminosity_class": fields.String(enum=LuminosityClass.values()),
    "luminosity_subclass": fields.String(enum=LuminositySubclass.values()),
    "spectral_class": fields.String(enum=SpectralClass.values()),
    "spectral_subclass": fields.String(enum=SpectralSubclass.values())
})

life_zone = api.ns.model("LifeZone", {
    "min_radius": fields.Float(min=0, description="Inner radius of habitable zone [au]."),
    "max_radius": fields.Float(min=0, description="Outer radius of habitable zone [au].")
})

star_properties = api.ns.inherit("StarProperties", new_star, {
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which properties originate."),
    "density": fields.Float(min=0, description="Density of star [kg/m^3]."),
    "surface_gravity": fields.Float(min=0, description="Surface gravity [m/s^2]."),
    "luminosity": fields.Float(min=0, description="Star luminosity [sun luminosity]."),
    "absolute_magnitude": fields.Float(description="Absolute magnitude of star."),
    "constellation": fields.String(description="Constellation where star is located on sky."),
    "type": fields.Nested(star_type, default={}),
    "life_zone": fields.Nested(life_zone, default={})
})

light_curve = api.ns.model("LightCurve", {
    "name": fields.String(required=True, max_length=50, description="Name of star within dataset."),
    "plot": fields.String(required=True, description="Name of file with rendered plot."),
    "min_flux": fields.Float(required=True, description="Minimum flux in light curve."),
    "max_flux": fields.Float(required=True, description="Maximum flux in light curve"),
    "min_time": fields.Float(required=True, description="Minimum time in light curve."),
    "max_time": fields.Float(required=True, description="Maximum time in light curve."),
    "n_observations": fields.Float(required=True, description="Size of light curve."),
    "n_days": fields.Float(required=True, description="Length of light curve."),
    "dataset": fields.String(required=True, max_length=50, description="Name of dataset from which light curve originates."),
})

star = api.ns.model("Star", {
    "_id": fields.String(requred=True, description="Star unique identifier."),
    "properties": fields.List(fields.Nested(star_properties), required=True, default=[]),
    "light_curves": fields.List(fields.Nested(light_curve), required=True, default=[]),
    "planets": fields.List(fields.Nested(planet), default=[]),
    "index": fields.Integer(min=1)
})


star_service = StarService()


@api.ns.route("/name/<string:name>")
class StarByName(Resource):

    @api.ns.marshal_with(star, description="Sucessfully get star by name,")
    @api.ns.response(404, "Star with specified name was not found.")
    def get(self, name):
        return star_service.get_by_name(name)


@api.ns.route("/<string:starId>/merge/<string:targetId>")
class MergePlanets(Resource):

    @api.ns.marshal_with(star, description="Successfully merge stars.")
    @api.ns.response(400, "It's not possible to merge two identical stars.")
    @api.ns.response(404, "Star with specified ID was not found.")
    def put(self):
        pass


api.init(full_model=star, new_model=star_properties, service=star_service, model_name="Star", map_props=map_props)
