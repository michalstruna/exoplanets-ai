from http import HTTPStatus
from flask_restx import abort
from mongoengine.errors import ValidationError, NotUniqueError


class Response:

    @staticmethod
    def get(handler):
        return Response._process(handler)

    @staticmethod
    def post(handler):
        return Response._process(handler, create=True)

    @staticmethod
    def put(handler):
        return Response._process(handler)

    @staticmethod
    def delete(handler):
        return Response._process(handler, delete=True)

    @staticmethod
    def _process(handler, delete=False, create=False):
        status = HTTPStatus.CREATED if create else HTTPStatus.NO_CONTENT if delete else HTTPStatus.OK

        try:
            return handler(), status
        except ValidationError as e:
            if "is not a valid ObjectId" in str(e):
                Response.not_found(str(e))
            else:
                Response.invalid(str(e))
        except NotUniqueError as e:
            Response.duplicate(str(e))

    @staticmethod
    def not_found(message=""):
        abort(HTTPStatus.NOT_FOUND, type="NOT_FOUND", message=message)

    @staticmethod
    def invalid(message=""):
        abort(HTTPStatus.UNPROCESSABLE_ENTITY, type="INVALID", message=message)

    @staticmethod
    def duplicate(message=""):
        abort(HTTPStatus.CONFLICT, type="DUPLICATE", message=message)


not_found_response = {"message": "NOT_FOUND"}