from mongoengine.errors import ValidationError, NotUniqueError, DoesNotExist
from bson.errors import InvalidId
from flask_restx.reqparse import RequestParser
from flask_restx import Namespace, Resource, fields, abort
from flask import request
from flask_restx._http import HTTPStatus

from api.errors import error
from constants.Data import Relation
from constants.Error import ErrorType
from constants.User import UserRole
from utils.exceptions import BadCredentials


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
    def delete(handler, with_return=False):
        res, status = Response._process(handler, delete=True)

        if with_return and res:
            return res, HTTPStatus.OK
        else:
            return None, status

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
        except BadCredentials as e:
            Response.bad_credentials(str(e))
        except Exception as e:
            Response.bad_request(str(e))

    @staticmethod
    def not_found(message=""):
        abort(HTTPStatus.NOT_FOUND, type=ErrorType.NOT_FOUND.value, message=message)

    @staticmethod
    def invalid(message=""):
        abort(HTTPStatus.BAD_REQUEST, type=ErrorType.INVALID.value, message=message)

    @staticmethod
    def duplicate(message=""):
        abort(HTTPStatus.CONFLICT, type=ErrorType.DUPLICATE.value, message=message)

    @staticmethod
    def bad_credentials(message=""):
        abort(HTTPStatus.BAD_REQUEST, type=ErrorType.BAD_CREDENTIALS.value, message=message)

    @staticmethod
    def bad_request(message=""):
        abort(HTTPStatus.BAD_REQUEST, type=ErrorType.BAD_REQUEST.value, message=message)

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
    def page(service, map_props=None):
        def get_page():
            cursor = Request.cursor(map_props)

            return {
                "content": service.get_all(**cursor),
                "count": service.get_count(**cursor)
            }

        return Response.get(lambda: get_page())


class Request:

    @staticmethod
    def cursor_parser():
        parser = RequestParser()
        parser.add_argument("limit", type=int, default=100, help="Max count of returned items.")
        parser.add_argument("offset", type=int, default=0, help="Skip first n items.")
        parser.add_argument("filter", type=str, action="append", default=[], help="Filter result by comma separated strings property,relation,value. Relation could be one of eq, cont, gt, gte, lt, lte, starts or ends. Nested property should be separated by dot. Example: 'article.name,cont,Abc'.")
        parser.add_argument("sort", type=str, action="append", default=[], help="Sort items by comma separated pairs property,order where order is asc or desc.")

        return parser

    @staticmethod
    def cursor(map_props=None):
        args = Request.cursor_parser().parse_args()

        return {
            "limit": args["limit"],
            "offset": args["offset"],
            "filter": Request.parse_filter(args["filter"], map_props),
            "sort": Request.parse_sort(args["sort"], map_props)
        }

    @staticmethod
    def parse_sort(sort, map_props=None):
        sort = list(map(lambda item: item.split(","), sort))
        result = {}

        for item in sort:
            if len(item) != 2:
                raise Exception(f"'{','.join(item)}' is not valid sort.")

            prop, order = item
            final_prop, type = map_props(prop) if map_props else prop

            if not final_prop:
                raise Exception(f"Items are not sortable by '{prop}' prop.")

            if order not in ["asc", "desc"]:
                raise Exception(f"'{order}' is no valid order.")

            result[final_prop] = 1 if order == "asc" else -1

        return result

    @staticmethod
    def parse_filter(filter, map_props=None):
        def parse_filter_item(item):
            if len(item) < 3:
                raise Exception(f"'{','.join(item)}' is not valid filter.")

            prop, rel, *vals = item.split(",")
            val = ",".join(vals)

            if rel not in Relation._value2member_map_:
                raise Exception(f"'{rel}' is not valid relation.")

            final_prop, type = map_props(prop) if map_props else prop

            if not final_prop:
                raise Exception(f"Items are not filerable by '{prop}' prop.")

            return [final_prop, rel, type(val) if val != "" and isinstance(val, str) else ("" if type == str else 0)]

        filter = list(map(parse_filter_item, filter))
        rules = []

        for prop, rel, val in filter:
            props = prop if isinstance(prop, list) else [prop]
            prop_rules = []

            for prop in props:

                if rel == Relation.EQ.value:
                    rule = {"$regex": f"^{val}$", "$options": "i"}
                elif rel == Relation.CONT.value:
                    rule = {"$regex": val, "$options": "i"}
                elif rel == Relation.STARTS.value:
                    rule = {"$regex": f"^{val}", "$options": "i"}
                elif rel == Relation.ENDS.value:
                    rule = {"$regex": f"{val}$", "$options": "i"}
                else:
                    rule = {"$" + rel: val}

                prop_rules.append({prop: rule})

            rules.append({"$or": prop_rules} if len(prop_rules) > 1 else prop_rules[0])

        return {"$and": rules} if rules else {}


class Api:

    _endpoint_uid = 0

    UNSECURED_RESOURCE = {
        "get_all": { "role": UserRole.UNAUTH},
        "get": {"role": UserRole.UNAUTH},
        "add": {"role": UserRole.UNAUTH},
        "update": {"role": UserRole.UNAUTH},
        "delete": {"role": UserRole.UNAUTH}
    }

    CUSTOM_RESOURCE = {}

    def __init__(self, name, description=None):
        self.ns = Namespace(name, description=description)
        self.service, self.full_model, self.new_model, self.updated_model, self.model_name, self.map_props, self.resource_type = None, None, None, None, None, None, None

    def init(self, full_model=None, new_model=None, updated_model=None, service=None, model_name=None, map_props=None, resource_type=UNSECURED_RESOURCE):
        self.service = service
        self.full_model = full_model
        self.new_model = new_model
        self.updated_model = updated_model if updated_model else new_model
        self.model_name = model_name
        self.map_props = map_props
        self.resource_type = resource_type

        self.all_resources()
        self.single_resource()

    def model(self, name, model):
        return self.ns.model(name, model)

    def inherit(self, name, parent, model):
        return self.ns.inherit(name, parent, model)

    def all_resources(self, path=""):
        methods = {}

        if "get_all" in self.resource_type:
            @self.ns.marshal_with(Response.page_model(self.ns, self.full_model), code=HTTPStatus.OK, description=f"Successfully get {self.model_name}s.", )
            @self.ns.response(HTTPStatus.BAD_REQUEST, "Invalid query parameters.", error)
            @self.ns.expect(Request.cursor_parser())
            def get(_self):
                return Response.page(self.service, self.map_props)

            methods["get"] = get

        if "add" in self.resource_type:
            @self.ns.marshal_with(self.full_model, code=HTTPStatus.CREATED, description=f"{self.model_name} was successfully created.")
            @self.ns.response(HTTPStatus.BAD_REQUEST, f"{self.model_name} is invalid.", error)
            @self.ns.response(HTTPStatus.CONFLICT, f"{self.model_name} is duplicate.", error)
            @self.ns.expect(self.new_model)
            def post(_self):
                return Response.post(lambda: self.service.add(request.get_json()))

            methods["post"] = post

        Endpoint = type(str(Api._endpoint_uid), (Resource,), methods)
        Api._endpoint_uid += 1
        self.ns.add_resource(Endpoint, path)

    def single_resource(self, path="/<string:id>"):
        methods = {}

        if "get" in self.resource_type:
            @self.ns.marshal_with(self.full_model, code=HTTPStatus.OK, description=f"Successfully get {self.model_name}.")
            @self.ns.response(HTTPStatus.NOT_FOUND, f"{self.model_name} with specified ID was not found.", error)
            def get(_self, id):
                return Response.get(lambda: self.service.get_by_id(id))

            methods["get"] = get

        if "delete" in self.resource_type:
            @self.ns.response(HTTPStatus.NO_CONTENT, description=f"{self.model_name} was successfully deleted.")
            @self.ns.response(HTTPStatus.NOT_FOUND, f"{self.model_name} with specified ID was not found.", error)
            def delete(_self, id):
                return Response.delete(lambda: self.service.delete(id))

            methods["delete"] = delete

        if "update" in self.resource_type:
            @self.ns.marshal_with(self.full_model, code=HTTPStatus.OK, description=f"Successfully get {self.model_name}.")
            @self.ns.response(HTTPStatus.BAD_REQUEST, f"{self.model_name} is invalid.", error)
            @self.ns.response(HTTPStatus.NOT_FOUND, f"{self.model_name} with specified ID was not found.", error)
            @self.ns.response(HTTPStatus.CONFLICT, f"{self.model_name} is duplicate.", error)
            @self.ns.expect(self.updated_model)
            def put(_self, id):
                return Response.put(lambda: self.service.update(id, request.get_json()))

            methods["put"] = put

        Endpoint = type(str(Api._endpoint_uid), (Resource,), methods)
        Api._endpoint_uid += 1
        self.ns.add_resource(Endpoint, path)