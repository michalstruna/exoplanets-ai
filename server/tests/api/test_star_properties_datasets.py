from pytest import approx

from constants.Dataset import DatasetPriority
from constants.User import UserRole
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
    auth_admin, auth = Creator.auth(role=UserRole.ADMIN), Creator.auth(role=UserRole.AUTH)

    Res.list(client.get("/api/datasets"), [])  # There is no dataset.
    Res.list(client.get("/api/stars"), [])  # There is no star.

    Res.unauth(client.post("/api/datasets", json=Creator.dataset()))  # Unauth - fail.
    Res.unauth(client.post("/api/datasets", json=Creator.dataset(), headers=auth))  # Normal user - fail.
    dataset1 = Res.created(client.post("/api/datasets", json=Creator.dataset(), headers=auth_admin)).json  # Add first dataset.
    Res.list(client.get("/api/datasets"), [dataset1])  # There is 1 dataset.
    assert dataset1["size"] == 2

    Comparator.is_in(client.get("/api/stars").json["content"], [  # There are 2 stars from 1 dataset.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}]}
    ])

    dataset2 = Res.created(client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1], KEPIDS[2]]), headers=auth_admin)).json  # Add second dataset.
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # There are two datasets.
    assert dataset2["size"] == 2

    Comparator.is_in(client.get("/api/stars").json["content"], [  # There are 3 stars from 2 datasets.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])


def test_update(client):
    auth_admin, auth = Creator.auth(role=UserRole.ADMIN), Creator.auth(role=UserRole.AUTH)

    dataset1 = client.post("/api/datasets", json=Creator.dataset(), headers=auth_admin).json  # Add first dataset.
    dataset2 = client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1], KEPIDS[2]]), headers=auth_admin).json  # Add second dataset.
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # Check there are two datasets.

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])

    dataset1_new = Creator.dataset(update=True, priority=DatasetPriority.HIGHEST)
    Res.unauth(client.put("/api/datasets/" + dataset1["_id"], json=dataset1_new))  # Unauth - fail.
    Res.unauth(client.put("/api/datasets/" + dataset1["_id"], json=dataset1_new, headers=auth))  # Normal user - fail.
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # Check datasets are unchanged.
    dataset1_updated = Res.updated(client.put("/api/datasets/" + dataset1["_id"], json=dataset1_new, headers=auth_admin)).json
    Res.list(client.get("/api/datasets"), [dataset1_new, dataset2])  # Check datasets are changed.

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1_updated["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1_updated["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])


def test_delete(client):
    auth_admin, auth = Creator.auth(role=UserRole.ADMIN), Creator.auth(role=UserRole.AUTH)

    dataset1 = client.post("/api/datasets", json=Creator.dataset(new=True), headers=auth_admin).json  # Add first dataset.
    dataset2 = client.post("/api/datasets", json=Creator.dataset(new=True, kepids=[KEPIDS[1], KEPIDS[2]]), headers=auth_admin).json  # Add second dataset.
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # Check there are two datasets.

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])

    Res.unauth(client.delete("/api/datasets/" + dataset1["_id"]))
    Res.unauth(client.delete("/api/datasets/" + dataset1["_id"], headers=auth))
    Res.list(client.get("/api/datasets"), [dataset1, dataset2])  # Check dataset is not deleted.
    Res.deleted(client.delete("/api/datasets/" + dataset1["_id"], headers=auth_admin))
    Res.list(client.get("/api/datasets"), [dataset2])  # Check dataset is deleted.

    Comparator.is_in(client.get("/api/stars").json["content"], [
        {"properties": [{"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"]}]}
    ])

    Res.deleted(client.delete("/api/datasets/" + dataset2["_id"], headers=auth_admin))
    Res.list(client.get("/api/datasets"), [])  # Check dataset is deleted.
    Comparator.is_in(client.get("/api/stars").json["content"], [])


def test_reset(client):
    auth_admin, auth = Creator.auth(role=UserRole.ADMIN), Creator.auth(role=UserRole.AUTH)

    dataset1 = client.post("/api/datasets", json=Creator.dataset(new=True), headers=auth_admin).json  # Add first dataset.
    dataset2 = client.post("/api/datasets", json=Creator.dataset(new=True, kepids=[KEPIDS[1], KEPIDS[2]]), headers=auth_admin).json  # Add second dataset.
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
    dataset1_updated = Res.updated(client.put("/api/datasets/" + dataset1["_id"], json=dataset1_new, headers=auth_admin)).json

    Comparator.is_in(client.get("/api/stars").json["content"], [  # Only dataset name is different, diameter and mass should be still same.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1_updated["name"], "diameter": stars[0]["properties"][0]["diameter"], "mass": stars[0]["properties"][0]["mass"]}]},
        {"properties": [
            {"name": KEPIDS[1], "dataset": dataset1_updated["name"], "diameter": stars[1]["properties"][0]["diameter"], "mass": stars[1]["properties"][0]["mass"]},
            {"name": KEPIDS[1], "dataset": dataset2["name"], "diameter": stars[1]["properties"][1]["diameter"], "mass": stars[1]["properties"][1]["mass"]}
        ]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"], "diameter": stars[2]["properties"][0]["diameter"], "mass": stars[2]["properties"][0]["mass"]}]}
    ])

    Res.unauth(client.put("/api/datasets/" + dataset1["_id"] + "/reset", json=dataset1_new)).json  # Unauth - fail.
    Res.unauth(client.put("/api/datasets/" + dataset1["_id"] + "/reset", json=dataset1_new, headers=auth)).json  # Normal user - fail.

    Comparator.is_in(client.get("/api/stars").json["content"], [  # No change.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1_updated["name"], "diameter": stars[0]["properties"][0]["diameter"], "mass": stars[0]["properties"][0]["mass"]}]},
        {"properties": [
            {"name": KEPIDS[1], "dataset": dataset1_updated["name"], "diameter": stars[1]["properties"][0]["diameter"], "mass": stars[1]["properties"][0]["mass"]},
            {"name": KEPIDS[1], "dataset": dataset2["name"], "diameter": stars[1]["properties"][1]["diameter"], "mass": stars[1]["properties"][1]["mass"]}
        ]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"], "diameter": stars[2]["properties"][0]["diameter"], "mass": stars[2]["properties"][0]["mass"]}]}
    ])

    Res.updated(client.put("/api/datasets/" + dataset1["_id"] + "/reset", json=dataset1_new, headers=auth_admin)).json  # Reset dataset data.

    Comparator.is_in(client.get("/api/stars").json["content"], [  # Now, mass and diameter should be switched.
        {"properties": [
            {"name": KEPIDS[1], "dataset": dataset2["name"], "diameter": stars[1]["properties"][1]["diameter"], "mass": stars[1]["properties"][1]["mass"]},
            {"name": KEPIDS[1], "dataset": dataset1_updated["name"], "diameter": stars[1]["properties"][0]["mass"], "mass": stars[1]["properties"][0]["diameter"]}
        ]},
        {"properties": [{"name": KEPIDS[2], "dataset": dataset2["name"], "diameter": stars[2]["properties"][0]["diameter"], "mass": stars[2]["properties"][0]["mass"]}]},
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1_updated["name"], "diameter": stars[0]["properties"][0]["mass"], "mass": stars[0]["properties"][0]["diameter"]}]}
    ])


def test_stats(client):
    auth_admin = Creator.auth(role=UserRole.ADMIN)

    t1 = time.now()
    dataset1 = client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1]]), headers=auth_admin).json  # Add first dataset.
    t2 = time.now()
    dataset2 = client.post("/api/datasets", json=Creator.dataset(kepids=[KEPIDS[1], KEPIDS[2]]), headers=auth_admin).json  # Add second dataset.
    t3 = time.now()

    size1 = int(client.head(dataset1["items_getter"]).headers["content-length"])
    size2 = int(client.head(dataset2["items_getter"]).headers["content-length"])

    Res.list(client.get("/api/datasets"), [
        {"size": 1, "stats": Creator.stats(planets=0, items=1, time=approx(t2 - t1, rel=0.1), data=approx(size1, rel=0.2))},
        {"size": 2, "stats": Creator.stats(planets=0, items=2, time=approx(t3 - t2, rel=0.1), data=approx(size2, rel=0.2))}
    ]).json["content"]


def test_fields(client):
    auth_admin = Creator.auth(role=UserRole.ADMIN)

    fields1 = {"name": "{kepid}"}
    dataset1 = client.post("/api/datasets", json=Creator.dataset(new=True, fields=fields1, kepids=[KEPIDS[0]]), headers=auth_admin).json  # Add first dataset.

    Res.list(client.get("/api/stars"), [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
    ]).json["content"]

    client.post("/api/datasets", json=Creator.dataset(new=True, fields={}, kepids=[KEPIDS[0], KEPIDS[1]]), headers=auth_admin).json  # Empty field.

    Res.list(client.get("/api/stars"), [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]}
    ]).json["content"]

    fields2 = {
        "name": "KIC {kepid}.",
        "surface_temperature": "{teff+2}",
        "diameter": "{radius}",
        "mass": "{mass*2+100}",
        "ra": "{ra+10}",
        "dec": "{dec+20/2}",
        "distance": "{dist*3.14}",
        "apparent_magnitude": "{kepmag/2-3}",
        "metallicity": "{feh}"
    }

    dataset2 = client.post("/api/datasets", json=Creator.dataset(new=True, fields=FIELDS, kepids=[KEPIDS[1]]), headers=auth_admin).json  # All default fields.
    dataset3 = client.post("/api/datasets", json=Creator.dataset(new=True, fields=fields2, kepids=[KEPIDS[1]]), headers=auth_admin).json  # All modified fields.
    props = client.get("/api/stars").json["content"][1]["properties"][0]

    Res.list(client.get("/api/stars"), [
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset2["name"]}]},
        {"properties": [{
            "name": f"KIC {KEPIDS[1]}.",
            "dataset": dataset3["name"],
            "surface_temperature": props["surface_temperature"] + 2,
            "diameter": props["diameter"] / 2,
            "mass": props["mass"] * 2 + 100,
            "ra": props["ra"] + 10,
            "dec": (props["dec"] + 20) / 2,
            "distance": props["distance"] * 3.14,
            "apparent_magnitude": props["apparent_magnitude"] / 2 - 3,
            "metallicity": props["metallicity"]
        }]}
    ]).json["content"]


