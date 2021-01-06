from http import HTTPStatus
from uuid import uuid4
import pytest

from app_factory import create_app
from constants.Dataset import DatasetPriority, DatasetType
from constants.Error import ErrorType
from constants.User import UserRole
from service.Dataset import DatasetService

dataset_service = DatasetService()


class Res:

    @staticmethod
    def item(res, expected=None, ignore=["index", "token"]):
        assert res.status_code == HTTPStatus.OK

        if expected:
            Comparator.is_in(res.json, expected, ignore=ignore)

        return res

    @staticmethod
    def list(res, expected, ignore=["index", "token"]):
        assert res.json["count"] == len(res.json["content"])
        assert res.status_code == HTTPStatus.OK

        if expected:
            Comparator.is_in(res.json["content"], expected, ignore=ignore)

        return res

    @staticmethod
    def created(res, expected=None, ignore=["index", "token"]):
        assert res.data != b""
        assert res.status_code == HTTPStatus.CREATED

        if expected:
            Comparator.is_in(res.json, expected, ignore=ignore)

        return res

    @staticmethod
    def updated(res, expected=None, ignore=["index", "token"]):
        assert res.status_code == HTTPStatus.OK

        if expected:
            Comparator.is_in(res.json, expected, ignore=ignore)

        return res

    @staticmethod
    def deleted(res, expected=None, ignore=["index", "token"], body=False):
        if body or expected:
            assert res.data != b""
            assert res.status_code == HTTPStatus.OK
        else:
            assert res.data == b""
            assert res.status_code == HTTPStatus.NO_CONTENT

        if expected:
            Comparator.is_in(res.json, expected, ignore=ignore)

        return res

    @staticmethod
    def not_found(res):
        assert res.json["type"] == ErrorType.NOT_FOUND.value
        assert res.status_code == HTTPStatus.NOT_FOUND
        return res

    @staticmethod
    def invalid(res):
        assert res.json["type"] == ErrorType.INVALID.value
        assert res.status_code == HTTPStatus.BAD_REQUEST
        return res

    @staticmethod
    def bad_request(res):
        assert res.json["type"] == ErrorType.BAD_REQUEST.value
        assert res.status_code == HTTPStatus.BAD_REQUEST
        return res

    @staticmethod
    def bad_credentials(res):
        assert res.json["type"] == ErrorType.BAD_CREDENTIALS.value
        assert res.status_code == HTTPStatus.BAD_REQUEST
        return res

    @staticmethod
    def duplicate(res):
        assert res.json["type"] == ErrorType.DUPLICATE.value
        assert res.status_code == HTTPStatus.CONFLICT
        return res


KEPIDS = ["10000800", "11904151", "10874614"]
FIELDS = {
    "name": "{kepid}",
    "surface_temperature": "{teff}",
    "diameter": "{radius*2}",
    "mass": "{mass}",
    "ra": "{ra}",
    "dec": "{dec}",
    "distance": "{dist}",
    "apparent_magnitude": "{kepmag}",
    "metallicity": "{feh}"
}


class Comparator:

    # Recursively check if all values in expected are also in actual.
    # Path is list of keys for better orientation in nested objects and arrays.
    @staticmethod
    def is_in(actual, expected, path=[], ignore=[]):
        #assert type(actual) == type(expected)  # TODO: bson.int64 is not int

        if isinstance(expected, dict):
            for i in expected:
                if i not in ignore:
                    _ignore = ignore[i] if i in ignore else []
                    Comparator.is_in(actual[i], expected[i], path=[*path, i], ignore=_ignore)
        elif isinstance(expected, list):
            assert len(actual) == len(expected)

            for i in range(len(expected)):
                Comparator.is_in(actual[i], expected[i], path=[*path, i], ignore=ignore)
        else:
            assert actual == expected

        return actual


class Creator:

    def stats(box=True, **kwargs):
        result = {}

        for stat in kwargs:
            val = kwargs[stat] if type(kwargs[stat]) == int else kwargs[stat][0]
            diff = 0#kwargs[stat] if type(kwargs[stat]) == int else kwargs[stat][0]
            result[stat] = {"value": val, "diff": diff}

        return {"stats": result} if box else result

    @staticmethod
    def rand_str(length=10):
        return uuid4().hex[:length]

    @staticmethod
    def local_credentials(id=1, new=False, username=None, password=None, name=None):
        result = {
            "username": username if username is not None else f"test_{id}@example.com",
            "password": password if password is not None else f"p4s$w0rd{id}!"
        }

        if new:
            result["name"] = name if name is not None else f"User{id}"

        return result

    @staticmethod
    def user(id=1, role=UserRole.AUTH, with_personal=False, token=None, name=None):
        result = {
            "name": name if name is not None else f"User{id}",
            "role": role.value,
            "score": {},
            "personal": {}
        }

        if with_personal:
            result["personal"] = {"is_male": id % 2 == 0, "country": f"Country{id}", "birth": id}

        if token:
            result["token"] = token

        return result

    @staticmethod
    def dataset(new=False, update=False, name=None, type=DatasetType.STAR_PROPERTIES, priority=DatasetPriority.NORMAL, kepids=[KEPIDS[0], KEPIDS[1]], fields=FIELDS):
        name = name if name else Creator.rand_str(10)

        if type == DatasetType.STAR_PROPERTIES:
            url_filter = "%27%20or%20kepid%20like%20%27".join(kepids)

            result = {
                "name": name,
                "fields": fields,
                "items": [],
                "size": len(kepids),
                "priority": priority.value,
                "items_getter": "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=q1_q17_dr25_stellar&select=kepid,teff,radius,mass,ra,dec,dist,kepmag,feh&where=kepid%20like%20%27" + url_filter + "%27",
                "type": type.value
            }

            if new or update:
                for key in ["_id", "size", "items", "index"]:
                    if key in result:
                        del result[key]

            if update:
                for key in ["type"]:
                    if key in result:
                        del result[key]

            return result

    @staticmethod
    def save_dataset(name=None, type=DatasetType.STAR_PROPERTIES, priority=DatasetPriority.NORMAL, kepids=[KEPIDS[0], KEPIDS[1]]):
        d = Creator.dataset(name=name, type=type, priority=priority, kepids=kepids)
        return Creator._from_mongo(dataset_service.dao.add(d), ignore=["_cls", "fields_meta"])

    @staticmethod
    def add_dataset(client, **kwargs):
        return client.post("/api/datasets", json=Creator.dataset(**kwargs)).json

    @staticmethod
    def add_datasets(client, *args):
        result = []
        data = [{} for i in range(args[0])] if type(args[0]) == int else args

        for kwargs in data:
            result.append(Creator.add_dataset(client, **kwargs))

        return result

    @staticmethod
    def _from_mongo(item, ignore=["_cls"]):
        if "_id" in item:
            item["_id"] = str(item["_id"])

        for key in ignore:
            if key in item:
                del item[key]

        return item


@pytest.fixture
def app():
    app, api, socket = create_app("test")
    return app