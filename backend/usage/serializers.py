from rest_framework import serializers
from backend.usage.models import Reports
from backend.usage.models import Station

class ReportsSerializer(serializers.ModelSerializer):
    stations = serializers.CharField(source='sid.station_name',read_only=True)
    class Meta:
        model = Reports
        fields = (
            "id",
            "report_dtm",
            "bill_start",
            "bill_end",
            "audit_status",
            "bill_transit",
            "cost_mult",
            "sid",
            "stations",
        )

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = (
            "id",
            "station_name",
        )
