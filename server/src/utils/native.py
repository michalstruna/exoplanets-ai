class Dict:

    @staticmethod
    def is_set(dict, *args, zeros=False):
        for key in args:
            if key not in dict or dict[key] == None or (not zeros and dict[key] == 0):
                return False
                
        return True

    @staticmethod
    def exclude_keys(dict, *keys):
        result = {**dict}

        for key in keys:
            if key in result:
                del result[key]

        return result

    @staticmethod
    def by_key(dict, key):
        keys = key.split(".")
        result = dict

        for key in keys:
            if Dict.is_set(result, key):
                result = result[key]
            else:
                return None

        return result

    @staticmethod
    def val(item, prop, key="properties", zeros=False):
        items = Dict.by_key(item, key)

        if not items:
            return None

        for props in items:
            if Dict.is_set(props, prop, zeros=zeros):
                return props[prop]

    @staticmethod
    def vals(item, props, key="properties", zeros=False):
        result = []

        for prop in props:
            result.append(Dict.val(item, prop, key, zeros))

        return tuple(result)