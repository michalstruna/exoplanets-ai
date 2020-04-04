from flask_restx import Api

from .users import api as ns1

api = Api(
    title='Exoplanets',
    version='1.0',
    description='Exoplanets project.',
    doc='/api-docs',
    prefix='/api'
)

api.add_namespace(ns1)