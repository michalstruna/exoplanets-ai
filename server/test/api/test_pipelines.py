import pytest
from http import HTTPStatus
from uuid import uuid4

from app_factory import create_app
from db import Pipeline


@pytest.fixture
def app():
    app, api, socket = create_app("test")
    return app


def create_pipeline(name=None):
    name = name if name else uuid4().hex[:10]

    return {
        "name": name,
        "star_dataset": {"name": "sd", "map_fields": {"a": "b"}, "url_getter": "https://lc.com?name={#}"},
        "light_curve_dataset": {"name": "lcd", "map_fields": {"a": "b"}, "url_getter": "https://lc.com?name={#}"},
    }


def test_empty_pipelines(client):
    res = client.get("/api/pipelines")

    assert res.get_json() == []
    assert res.status_code == HTTPStatus.OK


def test_add_pipeline(client):
    pipeline = create_pipeline()
    res = client.post("/api/pipelines", json=pipeline)
    post_pipeline = res.get_json()

    res2 = client.get(f"/api/pipelines/{post_pipeline['id']}")
    get_pipeline = res2.get_json()
    pipeline["id"] = get_pipeline["id"]

    assert res.status_code == HTTPStatus.CREATED
    assert type(post_pipeline["id"]) == type(get_pipeline["id"]) == str
    assert post_pipeline == get_pipeline == pipeline


def test_add_duplicate_pipeline(client):
    pipeline = create_pipeline()
    client.post("/api/pipelines", json=pipeline)
    res = client.post("/api/pipelines", json=pipeline)

    assert res.get_json()["type"] == "DUPLICATE"
    assert res.status_code == HTTPStatus.CONFLICT


def test_get(client):
    pipelines = []

    for i in range(5):
        pipelines.append(Pipeline(**create_pipeline()).save())

    res = client.get(f"/api/pipelines/{pipelines[1]['id']}")
    res_data = res.get_json()

    assert res.status_code == HTTPStatus.OK
    assert res_data["name"] == pipelines[1]["name"]


def test_get_non_existing(client):
    res = client.get("/api/pipelines/nonexistingid")

    assert res.get_json()["type"] == "NOT_FOUND"
    assert res.status_code == HTTPStatus.NOT_FOUND


# TODO: Filter, paginator, order.
def test_get_all(client):
    pipelines = []

    for i in range(5):
        pipelines.append(Pipeline(**create_pipeline()).save()["name"])

    res = client.get("/api/pipelines")
    res_data = list(map(lambda item: item["name"], res.get_json()))

    for pipeline in pipelines:
        assert pipeline in res_data

    assert res.status_code == HTTPStatus.OK
    assert len(res_data) == len(pipelines)


def test_get_all_empty(client):
    res = client.get("/api/pipelines")

    assert res.get_json() == []
    assert res.status_code == HTTPStatus.OK


# TODO: Implement.
def test_update(client):
    pass


def test_update_duplicate(client):
    pass


def test_update_non_existing(client):
    pass
