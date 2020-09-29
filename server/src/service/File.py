import uuid


class FileService:

    def generate_name(self, ext="png"):
        return str(uuid.uuid4()) + "." + ext

    def save(self, data, dir):
        name = self.generate_name()

        with open(dir + name, "wb") as f:
            f.write(data)

        return name

    def save_lc(self, lc):
        return self.save(lc, "public/lc/")

    def save_lv(self, lc):
        return self.save(lc, "public/lv/")

    def save_gv(self, lc):
        return self.save(lc, "public/gv/")