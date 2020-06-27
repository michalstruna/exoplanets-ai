from flask_restx import Api

from api.datasets import api as datasets_api
from api.planets import api as planets_api
from api.stars import api as stars_api

api = Api(
    title='Exoplanets',
    version='1.0',
    description='Exoplanets project.',
    doc='/api-docs',
    prefix='/api'
)

api.add_namespace(datasets_api)
api.add_namespace(planets_api)
api.add_namespace(stars_api)