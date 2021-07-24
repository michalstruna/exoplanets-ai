class Dict:

    @staticmethod
    def is_set(dict, *args, zeros=False):
        for key in args:
            if key not in dict or dict[key] == None or (not zeros and dict[key] == 0):
                return False
                
        return True

    @staticmethod
    def include_keys(dict, *keys):
        result = {}

        for key in keys:
            if key in dict:
                result[key] = dict[key]

        return result

    @staticmethod
    def exclude_keys(dict, *keys):
        result = {**dict}

        for key in keys:
            if key in result:
                del result[key]

        return result