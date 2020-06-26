import pytest
from http import HTTPStatus
from uuid import uuid4

from app_factory import create_app
from db import Dataset
from constants.Dataset import DatasetType


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
            "items_getter": "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=q1_q17_dr25_stellar&select=kepid,teff,radius,mass,dist&where=kepid%20like%20'10000800'",
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

    assert dataset == res.json
    assert res.status_code == HTTPStatus.CREATED

    assert len(res_stars.json) == 1
    assert res_stars.json[0]["properties"][0]["dataset"] == res.json["name"]



"""
def test_add_dataset(client):
    dataset = create_dataset()
    res = client.post("/api/datasets", json=dataset)
    post_dataset = res.get_json()

    res2 = client.get(f"/api/datasets/{post_dataset['id']}")
    get_dataset = res2.get_json()
    dataset["id"] = get_dataset["id"]

    assert res.status_code == HTTPStatus.CREATED
    assert type(post_dataset["id"]) == type(get_dataset["id"]) == str
    assert post_dataset == get_dataset == dataset


def test_add_duplicate_dataset(client):
    dataset = create_dataset()
    client.post("/api/datasets", json=dataset)
    res = client.post("/api/datasets", json=dataset)

    assert res.get_json()["type"] == "DUPLICATE"
    assert res.status_code == HTTPStatus.CONFLICT


def test_get(client):
    datasets = []

    for i in range(5):
        datasets.append(Dataset(**create_dataset()).save())

    res = client.get(f"/api/datasets/{datasets[1]['id']}")
    res_data = res.get_json()

    assert res.status_code == HTTPStatus.OK
    assert res_data["name"] == datasets[1]["name"]


def test_get_non_existing(client):
    res = client.get("/api/datasets/nonexistingid")

    assert res.get_json()["type"] == "NOT_FOUND"
    assert res.status_code == HTTPStatus.NOT_FOUND


# TODO: Filter, paginator, order.
def test_get_all(client):
    datasets = []

    for i in range(5):
        datasets.append(Dataset(**create_dataset()).save()["name"])

    res = client.get("/api/datasets")
    res_data = list(map(lambda item: item["name"], res.get_json()))

    for dataset in datasets:
        assert dataset in res_data

    assert res.status_code == HTTPStatus.OK
    assert len(res_data) == len(datasets)


# TODO: Implement.
def test_update(client):
    pass


def test_update_duplicate(client):
    pass


def test_update_non_existing(client):
    pass
"""
