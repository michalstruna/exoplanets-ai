from http import HTTPStatus
from flask_restx import abort
from mongoengine.errors import ValidationError, NotUniqueError, DoesNotExist
from bson.errors import InvalidId
from flask_restx.reqparse import RequestParser

from constants.Data import Relation


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
        status = HTTPStatus.CREATED if create else (HTTPStatus.NO_CONTENT if delete else HTTPStatus.OK)

        try:
            return handler(), status
        except ValidationError as e:
            if "is not a valid ObjectId" in str(e):
                Response.not_found(str(e))
            else:
                Response.invalid(str(e))
        except InvalidId as e:
            Response.not_found(e)
        except NotUniqueError as e:
            Response.duplicate(str(e))
        except DoesNotExist as e:
            Response.not_found(str(e))
        except Exception as e:
            Response.bad_request(str(e))

    @staticmethod
    def not_found(message=""):
        abort(HTTPStatus.NOT_FOUND, type="NOT_FOUND", message=message)

    @staticmethod
    def invalid(message=""):
        abort(HTTPStatus.UNPROCESSABLE_ENTITY, type="INVALID", message=message)

    @staticmethod
    def duplicate(message=""):
        abort(HTTPStatus.CONFLICT, type="DUPLICATE", message=message)

    @staticmethod
    def bad_credentials(message=""):
        abort(HTTPStatus.BAD_REQUEST, type="BAD_CREDENTIALS", message=message)

    @staticmethod
    def bad_request(message=""):
        abort(HTTPStatus.BAD_REQUEST, type="BAD_REQUEST", message=message)

    @staticmethod
    def ok(body):
        return body, HTTPStatus.OK

    @staticmethod
    def page_model(api, model):
        return api.model("Page", {
            "content": fields.List(fields.Nested(model)),
            "count": fields.Integer(min=0)
        })

    @staticmethod
    def page(service, map_sort=None):
        def get_page():
            cursor = Request.cursor(map_sort)

            return {
                "content": service.get_all(**cursor),
                "count": service.get_count(cursor["filter"])
            }

        return Response.get(lambda: get_page())


class Request:

    @staticmethod
    def cursor_parser():
        parser = RequestParser()
        parser.add_argument("limit", type=int, default=100, help="Max count of returned items.")
        parser.add_argument("offset", type=int, default=0, help="Skip first n items.")
        parser.add_argument("filter", type=str, action="append", default=[], help="Filter result by comma separated strings property,relation,value. Relation could be one of eq, cont, gt, gte, lt, lte, stars or ends. Nested property should be separated by dot. Example: 'article.name,contains,Abc'.")
        parser.add_argument("sort", type=str, action="append", default=[], help="Sort items by comma separated pairs property,order where order is asc or desc.")

        return parser

    @staticmethod
    def cursor(map_sort=None):
        args = Request.cursor_parser().parse_args()

        return {
            "limit": args["limit"],
            "offset": args["offset"],
            "filter": Request.parse_filter(args["filter"]),
            "sort": Request.parse_sort(args["sort"], map_sort)
        }

    @staticmethod
    def parse_sort(sort, map_sort=None):
        sort = list(map(lambda item: item.split(","), sort))
        result = {}

        for item in sort:
            if len(item) != 2:
                raise Exception(f"'{','.join(item)}' is not valid sort.")

            prop, order = item
            final_prop = map_sort(prop) if map_sort else prop

            if not final_prop:
                raise Exception(f"Items are not sortable by '{prop}' prop.")

            if order not in ["asc", "desc"]:
                raise Exception(f"'{order}' is no valid order.")

            result[final_prop] = 1 if order == "asc" else -1

        return result

    @staticmethod
    def parse_filter(filter):
        def parse_filter_item(item):
            if len(item) < 3:
                raise Exception(f"'{','.join(item)}' is not valid filter.")

            prop, rel, *vals = item.split(",")
            val = ",".join(vals)

            if rel not in Relation._value2member_map_:
                raise Exception(f"'{rel}' is not valid relation.")

            return [prop, rel, val]

        filter = list(map(parse_filter_item, filter))
        result = {}

        for prop, rel, val in filter:
            if rel == Relation.EQ.value:
                item = val
            elif rel == Relation.CONT.value:
                item = {"$regex": ".*" + val + ".*"}
            elif rel == Relation.STARTS.value:
                item = {"$regex": val + ".*"}
            elif rel == Relation.ENDS.value:
                item = {"$regex": ".*" + val}
            else:
                item = {"$" + rel: val}

            result[prop] = item

        return result


from flask_restx import Namespace, Resource, fields
from flask import request


class Api:

    _endpoint_uid = 0

    def __init__(self, name, description=None):
        self.ns = Namespace(name, description=description)
        self.service, self.full_model, self.new_model, self.model_name, self.map_sort = None, None, None, None, None

    def init(self, full_model=None, new_model=None, service=None, model_name=None, map_sort=None):
        self.service = service
        self.full_model = full_model
        self.new_model = new_model
        self.model_name = model_name
        self.map_sort = map_sort

        self.all_resources()
        self.single_resource()

    def model(self, name, model):
        return self.ns.model(name, model)

    def inherit(self, name, parent, model):
        return self.ns.inherit(name, parent, model)

    def all_resources(self, path=""):
        @self.ns.marshal_with(Response.page_model(self.ns, self.full_model), description=f"Successfully get {self.model_name}s.")
        @self.ns.response(400, "Invalid query parameters.")
        @self.ns.expect(Request.cursor_parser())
        def get(_self):
            return Response.page(self.service, self.map_sort)

        @self.ns.marshal_with(self.full_model, code=201, description=f"{self.model_name} was successfully created.")
        @self.ns.response(400, f"{self.model_name} is invalid.")
        @self.ns.response(409, f"{self.model_name} is duplicate.")
        @self.ns.expect(self.new_model)
        def post(_self):
            return Response.post(lambda: self.service.add(request.get_json()))

        Endpoint = type(str(Api._endpoint_uid), (Resource,), {"get": get, "post": post})
        Api._endpoint_uid += 1
        self.ns.add_resource(Endpoint, path)

    def single_resource(self, path="/<string:id>"):
        @self.ns.marshal_with(self.full_model, description=f"Successfully get {self.model_name}.")
        @self.ns.response(404, f"{self.model_name} with specified ID was not found.")
        @self.ns.expect(fields.String)
        def get(_self, id):
            return Response.get(lambda: self.service.get(id))

        @self.ns.marshal_with(None, code=204, description=f"{self.model_name} was successfully deleted.")
        @self.ns.response(404, f"{self.model_name} with specified ID was not found.")
        @self.ns.expect(fields.String)
        def delete(_self, id):
            return Response.delete(lambda: self.service.delete(id))

        @self.ns.marshal_with(self.full_model, description=f"Successfully get {self.model_name}.")
        @self.ns.response(400, f"{self.model_name} is invalid.")
        @self.ns.response(404, f"{self.model_name} with specified ID was not found.")
        @self.ns.response(409, f"{self.model_name} is duplicate.")
        @self.ns.expect(fields.String)
        def put(_self, id):
            return Response.put(lambda: self.service.update(id, request.get_json()))

        Endpoint = type(str(Api._endpoint_uid), (Resource,), {"get": get, "delete": delete, "put": put})
        Api._endpoint_uid += 1
        self.ns.add_resource(Endpoint, path)