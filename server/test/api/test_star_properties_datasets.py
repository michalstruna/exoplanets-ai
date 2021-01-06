import pytest

from constants.Dataset import DatasetPriority
from utils.test import Comparator, Creator, Res, KEPIDS, FIELDS, app
from utils import time


def test_get(client):
    Res.list(client.get("/api/datasets"), [])  # There is no dataset.

    dataset1, dataset2 = Creator.save_dataset(), Creator.save_dataset()
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # There are 2 datasets.
    Res.item(client.get("/api/datasets/" + dataset1["_id"]), dataset1)  # Dataset 1.
    Res.not_found(client.get("/api/datasets/invalid_id"))  # Dataset with invalid ID.
    Res.not_found(client.get("/api/datasets/" + Creator.rand_str(len(dataset1["_id"]))))  # Dataset with non-existing ID.
    Res.item(client.get("/api/datasets/" + dataset2["_id"]), dataset2)  # Dataset 2.


def test_add(client):
    Res.list(client.get("/api/datasets"), [])  # There is no dataset.
    Res.list(client.get("/api/stars"), [])  # There is no star.

    dataset1 = Res.created(client.post("/api/datasets", json=Creator.dataset())).json  # Add first dataset.
    Res.list(client.get("/api/datasets"), [dataset1])  # There is 1 dataset.
    assert dataset1["size"] == 2

    Comparator.is_in(client.get("/api/stars").json["content"], [  # There are 2 stars from 1 dataset.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}]}
    ])

    dataset2 = Res.created(client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1], KEPIDS[2]]))).json  # Add second dataset.
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # There are two datasets.
    assert dataset2["size"] == 2

    Comparator.is_in(client.get("/api/stars").json["content"], [  # There are 3 stars from 2 datasets.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])


def test_update(client):
    dataset1 = client.post("/api/datasets", json=Creator.dataset()).json  # Add first dataset.
    dataset2 = client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1], KEPIDS[2]])).json  # Add second dataset.
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # Check there are two datasets.

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])

    dataset1_new = Creator.dataset(update=True, priority=DatasetPriority.HIGHEST)
    dataset1_updated = Res.updated(client.put("/api/datasets/" + dataset1["_id"], json=dataset1_new)).json

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1_updated["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1_updated["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])


def test_delete(client):
    dataset1 = client.post("/api/datasets", json=Creator.dataset(new=True)).json  # Add first dataset.
    dataset2 = client.post("/api/datasets", json=Creator.dataset(new=True, kepids=[KEPIDS[1], KEPIDS[2]])).json  # Add second dataset.
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # Check there are two datasets.

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])

    Res.deleted(client.delete("/api/datasets/" + dataset1["_id"]))

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])

    Res.deleted(client.delete("/api/datasets/" + dataset2["_id"]))

    Comparator.is_in(client.get("/api/stars").json["content"], [])


def test_reset(client):
    dataset1 = client.post("/api/datasets", json=Creator.dataset(new=True)).json  # Add first dataset.
    dataset2 = client.post("/api/datasets", json=Creator.dataset(new=True, kepids=[KEPIDS[1], KEPIDS[2]])).json  # Add second dataset.
    stars = client.get("/api/stars").json["content"]

    Comparator.is_in(client.get("/api/stars").json["content"], [  # 3 stars from 2 datasets.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"], "diameter": stars[0]["properties"][0]["diameter"], "mass": stars[0]["properties"][0]["mass"]}]},
        {"properties": [
            {"name": KEPIDS[1], "dataset": dataset1["name"], "diameter": stars[1]["properties"][0]["diameter"], "mass": stars[1]["properties"][0]["mass"]},
            {"name": KEPIDS[1], "dataset": dataset2["name"], "diameter": stars[1]["properties"][1]["diameter"], "mass": stars[1]["properties"][1]["mass"]}
        ]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"], "diameter": stars[2]["properties"][0]["diameter"], "mass": stars[2]["properties"][0]["mass"]}]}
    ])

    dataset1_new = Creator.dataset(update=True, name=dataset1["name"] + "updated", fields={**FIELDS, "name": "{kepid}", "mass": "{radius*2}", "diameter": "{mass}"})  # Switch mass and diameter.
    dataset1_updated = Res.updated(client.put("/api/datasets/" + dataset1["_id"], json=dataset1_new)).json

    Comparator.is_in(client.get("/api/stars").json["content"], [  # Only dataset name is different, diameter and mass should be still same.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1_updated["name"], "diameter": stars[0]["properties"][0]["diameter"], "mass": stars[0]["properties"][0]["mass"]}]},
        {"properties": [
            {"name": KEPIDS[1], "dataset": dataset1_updated["name"], "diameter": stars[1]["properties"][0]["diameter"], "mass": stars[1]["properties"][0]["mass"]},
            {"name": KEPIDS[1], "dataset": dataset2["name"], "diameter": stars[1]["properties"][1]["diameter"], "mass": stars[1]["properties"][1]["mass"]}
        ]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"], "diameter": stars[2]["properties"][0]["diameter"], "mass": stars[2]["properties"][0]["mass"]}]}
    ])

    Res.updated(client.put("/api/datasets/" + dataset1["_id"] + "/reset", json=dataset1_new)).json  # Reset dataset data.

    Comparator.is_in(client.get("/api/stars").json["content"], [  # Now, mass and diameter should be switched.
        {"properties": [
            {"name": KEPIDS[1], "dataset": dataset2["name"], "diameter": stars[1]["properties"][1]["diameter"], "mass": stars[1]["properties"][1]["mass"]},
            {"name": KEPIDS[1], "dataset": dataset1_updated["name"], "diameter": stars[1]["properties"][0]["mass"], "mass": stars[1]["properties"][0]["diameter"]}
        ]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"], "diameter": stars[2]["properties"][0]["diameter"], "mass": stars[2]["properties"][0]["mass"]}]},
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1_updated["name"], "diameter": stars[0]["properties"][0]["mass"], "mass": stars[0]["properties"][0]["diameter"]}]}
    ])


def test_stats(client):
    t1 = time.now()
    client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1]])).json  # Add first dataset.
    t2 = time.now()
    client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1], KEPIDS[2]])).json  # Add second dataset.
    t3 = time.now()

    datasets = Res.list(client.get("/api/datasets"), [Creator.stats(planets=0, items=1), Creator.stats(planets=0, items=2)]).json["content"]

    assert datasets[0]["stats"]["time"]["value"] == pytest.approx(t2 - t1, rel=0.1)  # Time diff is max 10 %.
    assert datasets[1]["stats"]["time"]["value"] == pytest.approx(t3 - t2, rel=0.1)


def test_fields(client):
    pass


def test_crud(client):
    pass
