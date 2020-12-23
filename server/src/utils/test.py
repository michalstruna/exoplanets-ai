from http import HTTPStatus
from uuid import uuid4


def multi_ignore_keys(source, keys):
    result = []

    for item in source:
        result.append(ignore_keys(item, keys))

    return result


def ignore_keys(source, keys):
    result = source

    for key in keys:
        result = ignore_key(result, key)

    return result


def ignore_key(source, key):
    result = {**source}

    try:
        del result[key]
    except KeyError:
        pass

    return result


def eq(actual, expected, ignore=[]):
    act = ignore_keys(actual, ignore)
    exp = ignore_keys(expected, ignore)

    return act == exp


def list_eq(actual, expected, ignore=[]):
    act = multi_ignore_keys(actual, ignore)
    exp = multi_ignore_keys(expected, ignore)

    assert len(act) == len(exp)

    for i in range(len(act)):
        assert act[i] in exp


def res_list_eq(res, expected, ignore=["index"]):
    res_items = res.json["content"]

    assert res.json["count"] == len(res_items)
    assert res.status_code == HTTPStatus.OK
    list_eq(res_items, expected, ignore)


def res_eq(res, expected, ignore=["index"]):
    res_item = res.json

    assert res.status_code == HTTPStatus.OK
    eq(res_item, expected, ignore)


def res_not_found(res):
    assert res.json["type"] == "NOT_FOUND"
    assert res.status_code == HTTPStatus.NOT_FOUND


def rand_str(length=10):
    return uuid4().hex[:length]
