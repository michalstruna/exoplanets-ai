from service.Service import Service


class PipelineService(Service):

    def get(self, id):
        return self.db.Pipeline.objects.get(id=id)

    def get_all(self):
        return list(self.db.Pipeline.objects())

    def add(self, pipeline):
        return self.db.Pipeline(**pipeline).save()

    def delete(self, id):
        return self.db.Pipeline(id=id).delete()

    def update(self, id, pipeline):
        return self.db.Pipeline.objects(id=id).update_one(**pipeline)
