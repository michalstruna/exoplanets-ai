import pytest
from http import HTTPStatus

from app_factory import create_app
from constants.Dataset import DatasetType, DatasetPriority
import utils.test as test


@pytest.fixture
def app():
    app, api, socket = create_app("test")
    return app


def create_dataset(name=None, type=DatasetType.STAR_PROPERTIES, priority=DatasetPriority.NORMAL):
    name = name if name else test.rand_str(10)

    if type == DatasetType.STAR_PROPERTIES:
        return {
            "name": name,
            "fields": {
                "name": "KIC {kepid}",
                "surface_temperature": "{teff}",
                "diameter": "{radius*2}",
                "mass": "{mass}",
                "ra": 45,
                "dec": 60,
                "distance": "{dist}",
                "apparent_magnitude": "{kepmag}",
                "metallicity": "{feh}"
            },
            "items_getter": "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=q1_q17_dr25_stellar&select=kepid,teff,radius,mass,dist&where=kepid%20like%20'10000800'%20or%20kepid%20like%20'10001116'",
            "type": type.value,
            "priority": priority.value
        }


def test_get_all_datasets_empty(client):
    res = client.get("/api/datasets")
    test.res_list_eq(res, [])


def test_get_datasets(client):
    dataset1 = client.post("/api/datasets", json=create_dataset()).json
    dataset2 = client.post("/api/datasets", json=create_dataset()).json

    res = client.get("/api/datasets")
    res_data = res.json

    test.list_eq(res_data, [dataset1, dataset2])


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
