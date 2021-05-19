from flask_restx import fields, Resource

from service.Stats import GlobalStatsService
from utils.http import Api

api = Api("global_stats", description="Global statistics.")

logged_item = api.ns.model("LoggedItem", {
    "created": fields.Integer(description="Timestamp of creation."),
    "modified": fields.Integer(description="Timestamp of last update.")
})

stat_int_item = api.ns.model("StatIntItem", {
    "value": fields.Integer(required=True, min=0, default=0, description="Value of statistic."),
    "diff": fields.Integer(required=True, default=0, description="Change of statistic."),
})

stat_float_item = api.ns.model("StatFloatItem", {
    "value": fields.Float(required=True, min=0, default=0, description="Value of statistic."),
    "diff": fields.Float(required=True, default=0, description="Change of statistic."),
})

stats_aggregated = api.ns.model("StatsAggregated", {
    "planets": fields.Nested(stat_int_item, required=True),
    "time": fields.Nested(stat_float_item, required=True),
    "data": fields.Nested(stat_float_item, required=True),
    "items": fields.Nested(stat_int_item, required=True)
})

global_stats_aggregated = api.ns.inherit("GlobalStatsAggregated", stats_aggregated, {
    "volunteers": fields.Nested(stat_int_item, required=True),
    "stars": fields.Nested(stat_int_item, required=True)
})

axis = api.ns.model("ChartAxis", {
    "min": fields.Float(description="Min value in graph along this axis."),
    "max": fields.Float(description="Max value in graph along this axis."),
    "log": fields.Boolean(description="Axis has log scale."),
    "ticks": fields.List(fields.String),
    "vals": fields.List(fields.Float)
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
    "star_type_count": fields.Nested(chart, required=True),
    "distance_count": fields.Nested(chart, required=True),
    "progress": fields.Nested(chart, required=True)
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
        return global_stat_service.get_plot_data()
        """return {
            "smax_mass": {
                "x": {"min": 10e-3, "max": 10e4, "log": True},
                "y": {"min": 10e-2, "max": 10e5, "log": True},
                "image": "SmaxMass.png"
            },
            "type_count": {
                "x": {"ticks": ["mercury", "earth", "superearth", "neptune", "jupiter"]},
                "y": {"min": 0, "max": 762},
                "image": "TypeCount.svg"
            },
            "distance_count": {
                "x": {"ticks": ["< 50", "50-200", "200-500", "500-2k", "> 2k"]},
                "y": {"min": 0, "max": 1659},
                "image": "DistanceCount.svg"
            },
            "progress": {
                "y": {"vals": [18.194567, 82.456]},
                "image": "Progress.svg"
            }
        }"""


global_stat_service = GlobalStatsService()

api.init(
    full_model=global_stats_aggregated,
    new_model=global_stats_aggregated,
    service=global_stat_service,
    model_name="GlobalStats",
    resource_type=Api.CUSTOM_RESOURCE
)
