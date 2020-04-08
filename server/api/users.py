from flask_restx import Namespace, Resource, fields

api = Namespace('users', description='Users')

user = api.model('User', {
    'id': fields.String(required=True, description='User\'s unique identifier.')
})

@api.route('/<string:id>')
class User(Resource):

    def get(self, id):
        return None