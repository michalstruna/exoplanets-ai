from flask_restx import fields, Namespace

from constants.Error import ErrorType

ns = Namespace("errors", description="Api errors.")

error = ns.model("Error", {
    "type": fields.String(required=True, description="Type of error.", enum=ErrorType.values()),
    "message": fields.String()
})