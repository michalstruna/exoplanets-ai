from http import HTTPStatus
from uuid import uuid4


def list_eq(actual, expected):
    assert len(actual) == len(expected)

    for i in range(len(actual)):
        assert actual[i] in expected


def res_list_eq(res, expected):
    res_items = res.json["content"]

    assert res.json["count"] == len(expected)
    assert len(res_items) == len(expected)
    assert res.status_code == HTTPStatus.OK
    list_eq(res_items, expected)


def rand_str(length = 10):
    return uuid4().hex[:length]