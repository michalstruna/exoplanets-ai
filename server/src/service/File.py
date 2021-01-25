import uuid
import requests
import os

from constants.File import FileType

class FileService:

    Type = FileType

    def generate_name(self, ext="png"):
        return str(uuid.uuid4()) + "." + ext

    def from_url(self, url):
        return requests.get(url).content

    def save(self, file, file_type, name=None):
        if type(file) == str:
            file = self.from_url(file)

        if not name:
            name = self.generate_name()

        path = os.path.join("public", file_type.value, name)

        with open(path, "wb") as f:
            f.write(file)

        return name

    def delete(self, name, file_type):
        path = os.path.join("public", file_type.value, name)
        os.remove(path)