from flask_restx import fields, Resource
from flask import request
from flask_restx._http import HTTPStatus
from mimetypes import guess_extension

from utils.http import Api, Response
from service.File import FileService
from api.errors import error

api = Api("files", description="Locally stored files.")

file = api.ns.model("File", {
    "file": fields.Raw
})

@api.ns.route("/<string:tag>")
class Files(Resource):

    @api.ns.response(HTTPStatus.OK, "File was uploaded succesfully.")
    @api.ns.response(HTTPStatus.BAD_REQUEST, "File was not uploaded.", error)
    @api.ns.expect(file)
    def post(self, tag):
        return file_service.save_from_storage(request.files.get("file"), tag)


file_service = FileService()
api.init(resource_type=Api.CUSTOM_RESOURCE)
