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

axis = api.ns.model("ChartAxis", {
    "min": fields.Float(description="Min value in graph along this axis."),
    "max": fields.Float(description="Max value in graph along this axis."),
    "log": fields.Boolean(description="Axis has log scale."),
    "ticks": fields.List(fields.String)
})

color_axis = api.ns.model("ChartColorAxis", {

})

chart = api.ns.model("Chart", {
    "x": fields.Nested(axis, required=True),
    "y": fields.Nested(axis, required=True),
    "colors": fields.Raw(description="Map color => label."),
    "image": fields.String(required="Server path of plotted image.")
})

plots_stats = api.ns.model("PlotsStats", {
    "smax_mass": fields.Nested(chart, required=True),
    "type_count": fields.Nested(chart, required=True),
    "star_type_count": fields.Nested(chart, required=True)
})

@api.ns.route("/aggregated")
class AggregatedGlobalStats(Resource):

    @api.ns.marshal_with(global_stats_aggregated, description="Get aggregated stats (value + interval diff).")
    def get(self):
        return global_stat_service.get_aggregated()


@api.ns.route("/plots")
class PlotStats(Resource):

    @api.ns.marshal_with(plots_stats, description="Get plot stats.")
    def get(self):
        return {
            "smax_mass": {
                "x": {"min": 10e-3, "max": 10e4, "log": True},
                "y": {"min": 10e-2, "max": 10e5, "log": True},
                "image": "SmaxMass.png"
            },
            "type_count": {
                "x": {"ticks": ["mercury", "earth", "superearth", "neptune", "jupiter"]},
                "y": {"min": 0, "max": 762},
                "image": "TypeCount.png"
            },
            "star_type_count": {
                "image": "StarTypeCount.png"
            }
        }


global_stat_service = GlobalStatsService()

api.init(
    full_model=global_stats_aggregated,
    new_model=global_stats_aggregated,
    service=global_stat_service,
    model_name="GlobalStats",
    resource_type=Api.CUSTOM_RESOURCE
)
