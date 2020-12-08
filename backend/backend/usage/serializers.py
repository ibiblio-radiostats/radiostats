from rest_framework import serializers
from backend.usage.models import Report
from backend.usage.models import Station

class ReportSerializer(serializers.ModelSerializer):
    stations = serializers.CharField(source='sid.station_name',read_only=True)             
    class Meta:
        model = Report
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
            "report",
        )

class StationSerializer(serializers.ModelSerializer):
    station_name = serializers.StringRelatedField()

    class Meta:
        model = Station
        fields = '__all__'

class ReportIdSerializer(serializers.Serializer):
    reports = serializers.ListField(
        child=serializers.IntegerField()
    )

