from flask_restx import Api

from api.pipelines import api as pipelines_api

api = Api(
    title='Exoplanets',
    version='1.0',
    description='Exoplanets project.',
    doc='/api-docs',
    prefix='/api'
)

api.add_namespace(pipelines_api)
