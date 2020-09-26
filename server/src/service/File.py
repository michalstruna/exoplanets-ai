import uuid


class FileService:

    def generate_name(self, ext="png"):
        return str(uuid.uuid4()) + "." + ext

    def save_lc(self, lc):
        name = self.generate_name()

        with open("public/lc/" + name, "wb") as f:
            f.write(lc)

        return name
