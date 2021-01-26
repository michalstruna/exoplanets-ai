import uuid
import requests
import os
from mimetypes import guess_extension

from constants.File import FileType

class FileService:

    Type = FileType

    def generate_name(self, ext):
        return str(uuid.uuid4()) + ext

    def save_from_storage(self, storage, tag):
        name = self.save(storage.read(), tag, storage.content_type)
        storage.close()
        return name

    def save_from_url(self, url, tag):
        res = requests.get(url)
        return self.save(res.content, tag, res.headers["Content-Type"])

    def save(self, file, tag, content_type):
        extension = guess_extension(content_type)
        name = self.generate_name(extension)
        path = os.path.join("public", tag if type(tag) == str else tag.value, name)

        with open(path, "wb") as f:
            f.write(file)

        f.close()

        return name

    def delete(self, name, tag):
        path = os.path.join("public", tag.value, name)
        os.remove(path)