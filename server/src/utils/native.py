class Dict:

    @staticmethod
    def is_set(dict, *args, zeros=False):
        for key in args:
            if key not in dict or dict[key] == None or (not zeros and dict[key] == 0):
                return False
                
        return True