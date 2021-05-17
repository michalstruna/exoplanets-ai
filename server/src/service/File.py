import uuid
import requests
import os
from mimetypes import guess_extension

from constants.File import FileType, ContentType
from utils.patterns import Enum

class FileService:

    Type = FileType
    ContentType = ContentType

    def generate_name(self, ext):
        return str(uuid.uuid4()) + ext

    def save_from_storage(self, storage, tag):
        name = self.save(storage.read(), tag, storage.content_type)
        storage.close()
        return name

    def save_from_url(self, url, tag):
        res = requests.get(url)
        return self.save(res.content, tag, res.headers["Content-Type"])

    def save(self, file, tag, name=None, content_type=ContentType.PNG):
        extension = guess_extension(Enum.get(content_type))
        name = f"{name}{extension}" if name else self.generate_name(extension)
        path = os.path.join("public", Enum.get(tag), name)

        with open(path, "wb") as f:
            f.write(file)

        f.close()

        return name

    def delete(self, name, tag):
        path = os.path.join("public", tag.value, name)
        os.remove(path)