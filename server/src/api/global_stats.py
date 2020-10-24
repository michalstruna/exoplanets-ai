from flask_restx import fields, Resource

from service.Stats import GlobalStatsService
from utils.http import Api

api = Api("global_stats", description="Global statistics.")

global_stats_item = api.ns.model("GlobalStatsItem", {
    "planets": fields.Integer(required=True, min=0, default=0, description="Count of discovered planets."),
    "volunteers": fields.Integer(required=True, min=0, default=0, description="Count of registered volunteers."),
    "hours": fields.Float(required=True, min=0, default=0, description="Count of hours."),
    "stars": fields.Integer(required=True, min=0, default=0, description="Count of processed stars."),
    "gibs": fields.Float(required=True, min=0, default=0, description="Count of processed GiB."),
    "curves": fields.Integer(required=True, min=0, default=0, description="Count of processed curves."),
})

global_stats = api.ns.model("GlobalStats", {
    "date": fields.String(required=True, description="Day of stats [DD-MM-YYYY]."),
    "stats": fields.Nested(global_stats_item)
})

stat_int_item = api.ns.model("StatIntItem", {
    "value": fields.Integer(required=True, min=0, default=0, description="Value of statistic."),
    "diff": fields.Integer(required=True, default=0, description="Change of statistic."),
})

stat_float_item = api.ns.model("StatFloatItem", {
    "value": fields.Float(required=True, min=0, default=0, description="Value of statistic."),
    "diff": fields.Float(required=True, default=0, description="Change of statistic."),
})

global_stats_aggregated = api.ns.model("GlobalStatsAggregatedItem", {
    "planets": fields.Nested(stat_int_item, required=True),
    "volunteers": fields.Nested(stat_int_item, required=True),
    "hours": fields.Nested(stat_float_item, required=True),
    "stars": fields.Nested(stat_int_item, required=True),
    "gibs": fields.Nested(stat_float_item, required=True),
    "curves": fields.Nested(stat_int_item, required=True)
})

@api.ns.route("/aggregated")
class AggregatedGlobalStats(Resource):

    @api.ns.marshal_with(global_stats_aggregated, description="Get aggregated stats (value + interval diff).")
    def get(self):
        return global_stat_service.get_aggregated()


global_stat_service = GlobalStatsService()

api.init(
    full_model=global_stats,
    new_model=global_stats,
    service=global_stat_service,
    model_name="GlobalStats",
    resource_type=Api.CUSTOM_RESOURCE
)
