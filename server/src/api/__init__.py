from flask_restx import Api

from api.datasets import api as datasets_api
from api.planets import api as planets_api
from api.stars import api as stars_api
from api.users import api as users_api

api = Api(
    title='Exoplanets',
    version='1.0',
    description='Exoplanets project.',
    doc='/api-docs',
    prefix='/api'
)

api.add_namespace(datasets_api.ns)
api.add_namespace(stars_api.ns)
api.add_namespace(planets_api.ns)
api.add_namespace(users_api)