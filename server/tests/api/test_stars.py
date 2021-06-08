from utils.test import Comparator, Creator, Res, KEPIDS, app

# TODO: Auth


def test_get(client):
    Res.list(client.get("/api/stars"), [])  # There is no stars.

    dataset1, dataset2 = Creator.add_datasets(client, 2)  # Add two datasets.

    stars = Comparator.is_in(client.get("/api/stars").json["content"], [  # There are 2 stars from 2 datasets.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}, {"name": KEPIDS[0], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]}
    ])

    Res.list(client.get("/api/stars"), stars)  # List stars.
    Res.item(client.get("/api/stars/" + stars[0]["_id"]), stars[0])  # First star,
    Res.item(client.get("/api/stars/" + stars[1]["_id"]), stars[1])  # Second star,
    Res.not_found(client.get("/api/stars/invalid_id"))  # Star with invalid ID.
    Res.not_found(client.get("/api/stars/" + Creator.rand_str(len(stars[0]["_id"]))))  # Star with non-existing ID.


def test_delete_props(client):
    dataset1, dataset2 = Creator.add_datasets(client, 2)  # Add two datasets.

    stars = Comparator.is_in(client.get("/api/stars").json["content"], [  # There are 2 stars from 2 datasets.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}, {"name": KEPIDS[0], "dataset": dataset2["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]}
    ])

    Res.deleted(client.delete(f"/api/stars/{stars[0]['_id']}/selection", json={"properties": [dataset2["name"]]}), client.get("/api/stars/" + stars[0]["_id"]).json, body=True)

    Comparator.is_in(client.get("/api/datasets").json["content"], [
        {"deleted_items": []},
        {"deleted_items": [stars[0]["properties"][1]["name"]]}
    ])

    updated_stars = Comparator.is_in(client.get("/api/stars").json["content"], [  # There should be 2 stars, but first star has only 1 prop data.
        {"properties": [{"name": KEPIDS[0], "dataset": dataset1["name"]}]},
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]}
    ])

    Res.not_found(client.delete(f"/api/stars/{stars[0]['_id']}/selection", json={"properties": [dataset1["name"] + "_"]}))  # Delete non-existing dataset from star1.
    Res.not_found(client.delete(f"/api/stars/{stars[0]['_id']}_/selection", json={"properties": [dataset1["name"]]}))  # Delete dataset1 from non-existing star.
    Res.not_found(client.delete(f"/api/stars/{stars[0]['_id']}/selection", json={"properties": [dataset1["name"], dataset1["name"] + "_"]}))  # Delete existing and non-existing dataset from star1.
    assert updated_stars == client.get("/api/stars").json["content"]  # Stars should be still same - either entire selection will be deleted or nothing.
    Res.deleted(client.delete(f"/api/stars/{stars[0]['_id']}/selection", json={"properties": [dataset1["name"]]}))  # Delete dataset1 from star1.

    Comparator.is_in(client.get("/api/datasets").json["content"], [
        {"deleted_items": [stars[0]["properties"][1]["name"]]},
        {"deleted_items": [stars[0]["properties"][0]["name"]]}
    ])

    Comparator.is_in(client.get("/api/stars").json["content"], [  # There should be only 1 star.
        {"properties": [{"name": KEPIDS[1], "dataset": dataset1["name"]}, {"name": KEPIDS[1], "dataset": dataset2["name"]}]}
    ])

    Res.deleted(client.delete(f"/api/stars/{stars[1]['_id']}/selection", json={"properties": [dataset2["name"], dataset1["name"]]}))  # Delete dataset1 and dataset2 from star2.

    Comparator.is_in(client.get("/api/datasets").json["content"], [
        {"deleted_items": [stars[0]["properties"][1]["name"], stars[1]["properties"][0]["name"]]},
        {"deleted_items": [stars[0]["properties"][0]["name"], stars[1]["properties"][1]["name"]]}
    ])

    Comparator.is_in(client.get("/api/stars").json["content"], [])  # There should not be any star.

# TODO: Test non existing star.


def test_add_props(client):
    pass


def test_delete_lcs(client):
    pass


def test_reset_props(client):
    pass


def test_reset_lcs(client):
    pass
