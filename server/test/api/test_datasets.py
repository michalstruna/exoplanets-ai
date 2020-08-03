import pytest
from http import HTTPStatus
from uuid import uuid4

from app_factory import create_app
from constants.Database import DatasetType


@pytest.fixture
def app():
    app, api, socket = create_app("test")
    return app


def create_dataset(name=None, type=DatasetType.STAR_PROPERTIES):
    name = name if name else uuid4().hex[:10]

    if type == DatasetType.STAR_PROPERTIES:
        return {
            "name": name,
            "fields": {
                "temperature": {"name": "teff"},
                "mass": {"name": "mass"},
                "diameter": {"name": "radius"},
                "name": {"name": "kepid", "prefix": "KIC "},
                "distance": {"name": "dist"}
            },
            "items_getter": "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=q1_q17_dr25_stellar&select=kepid,teff,radius,mass,dist&where=kepid%20like%20'10000800'%20or%20kepid%20like%20'10001116'",
            "type": DatasetType.STAR_PROPERTIES.name
        }


def test_get_all_datasets_empty(client):
    res = client.get("/api/datasets")

    assert res.json == []
    assert res.status_code == HTTPStatus.OK


def test_get_all_datasets(client):
    dataset1 = client.post("/api/datasets", json=create_dataset()).json
    dataset2 = client.post("/api/datasets", json=create_dataset()).json

    res = client.get("/api/datasets")
    res_data = res.json

    assert len(res_data) == 2
    assert dataset1 in res_data
    assert dataset2 in res_data


def test_add_star_properties_dataset(client):
    dataset = create_dataset()
    res = client.post("/api/datasets", json=dataset)
    dataset["_id"], dataset["total_size"], dataset["current_size"], dataset["fields"] = res.json["_id"], res.json["total_size"], res.json["current_size"], res.json["fields"]
    res_stars = client.get("/api/stars")
    res_dataset = client.get(f"/api/datasets/{res.json['_id']}")

    assert dataset == res.json
    assert res.status_code == HTTPStatus.CREATED
    assert len(res_stars.json) == 2
    assert res_stars.json[0]["properties"][0]["dataset"] == res.json["name"]
    assert res_dataset.json == res.json
