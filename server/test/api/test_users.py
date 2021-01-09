from utils.test import Comparator, Creator, Res, app


def test_local_sign_up(client):
    for i in range(3):
        cr, exp_usr = Creator.local_credentials(i, new=True), Creator.user(i)
        usr = Res.created(client.post("/api/users/sign-up", json=cr), exp_usr).json
        assert "username" not in usr and "password" not in usr  # Credentials should not be in user.
        assert "token" in usr  # There should be login token.

    cr1 = Creator.local_credentials(1, new=True)
    Res.duplicate(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, username=cr1["username"])))  # Duplicate username.
    Res.duplicate(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, name=cr1["name"])))  # Duplicate name.
    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, username="invalid")))  # Invalid username.
    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, username="")))  # Empty username.
    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, name="")))  # Empty name.
    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, name="a" * 21)))  # Long name.
    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, password="")))  # Empty password.
    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, password="a" * 5)))  # Short password.
    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, password="a" * 51)))  # Long password.

    Res.created(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True)), Creator.user(5))  # User 5 should not exist yet.


def test_local_login(client):
    cr1, cr2 = Creator.local_credentials(1, new=True), Creator.local_credentials(2, new=True)  # Create two users.
    usr1, usr2 = Res.created(client.post("/api/users/sign-up", json=cr1)).json, Res.created(client.post("/api/users/sign-up", json=cr2)).json

    res1 = Res.bad_credentials(client.post("/api/users/login", json={"username": cr1["username"], "password": cr2["password"]}))
    res2 = Res.bad_credentials(client.post("/api/users/login", json={"username": cr2["username"], "password": cr1["password"]}))
    res3 = Res.bad_credentials(client.post("/api/users/login", json={"username": "invalid", "password": "non-existing"}))

    assert res1.json["message"] == res2.json["message"] == res3.json["message"] == "Bad credentials."  # There should not be specified if username or password is invalid.

    Res.bad_request(client.post("/api/users/login"))

    login2 = Res.item(client.post("/api/users/login", json=cr2), usr2).json
    login1 = Res.item(client.post("/api/users/login", json=cr1), usr1).json

    Comparator.is_in([login1, login2], [usr1, usr2])

    Res.item(client.post("/api/users/login", json=cr1), usr1).json  # User can login second time.


def test_facebook_sign_up(client):
    pass


def test_facebook_login(client):
    pass


def test_google_sign_up(client):
    pass


def test_google_login(client):
    pass


def test_get(client):  # TODO: Add Facebook and Google users.
    Res.list(client.get("/api/users"), [])  # There is no user.

    Res.invalid(client.post("/api/users/sign-up", json=Creator.local_credentials(5, new=True, username="invalid")))  # Invalid username."""

    usr1 = Res.created(client.post("/api/users/sign-up", json=Creator.local_credentials(1, new=True))).json
    usr2 = Res.created(client.post("/api/users/sign-up", json=Creator.local_credentials(2, new=True))).json
    Res.duplicate(client.post("/api/users/sign-up", json=Creator.local_credentials(1, new=True)))  # Duplicate user.

    usrs = Res.list(client.get("/api/users"), [usr1, usr2]).json["content"]  # There are two users.
    assert "username" not in usrs[0] and "password" not in usrs[0] and "token" not  in usrs[0]  # Credentials should not be in user.

    Res.item(client.get("/api/users/" + usr1["_id"]), usr1)
    Res.item(client.get("/api/users/" + usr2["_id"]), usr2)
    Res.not_found(client.get("/api/users/invalid"))


def test_aggregate_stats(client):
    Creator.save_user(id=1, stats=[  # User with both old and new stats.
        Creator.stats_item(planets=10, items=20, time=30000, data=50000),
        Creator.stats_item(days=6, planets=5, items=30, time=10000, data=20000),
        Creator.stats_item(days=1, planets=15, items=40, time=5000, data=15000)
    ])

    Creator.save_user(id=2)  # User without stats.

    Creator.save_user(id=3, stats=[  # User with old stats only.
        Creator.stats_item(planets=1, items=6, time=7000, data=3000),
        Creator.stats_item(days=50, planets=2, items=5, time=8000, data=2000),
        Creator.stats_item(days=7, planets=3, items=4, time=9000, data=1000),
    ])

    Creator.save_user(id=4, stats=[  # User with new stats only.
        Creator.stats_item(days=6, planets=1, items=6, time=7000, data=3000),
        Creator.stats_item(days=1, planets=2, items=5, time=8000, data=2000),
        Creator.stats_item(days=0, planets=3, items=4, time=9000, data=1000),
    ])

    Res.list(client.get("/api/users"), [
        Creator.stats(True, planets=[30, 20], items=[90, 70], time=[45000, 15000], data=[85000, 35000]),
        Creator.stats(True, planets=0, items=0, time=0, data=0),
        Creator.stats(True, planets=[6, 0], items=[15, 0], time=[24000, 0], data=[6000, 0]),
        Creator.stats(True, planets=[6, 6], items=[15, 15], time=[24000, 24000], data=[6000, 6000])
    ])


def test_edit_profile(client):
    pass


def test_admin_edit(client):
    pass
