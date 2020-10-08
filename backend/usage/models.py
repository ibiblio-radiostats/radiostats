from django.db import models

# Create your models here.

class AuditStatus(object):
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"
    APPROVAL = "APPROVAL"


class Station(models.Model):
    station_name = models.CharField(max_length=100,default=models.CASCADE)

class Reports(models.Model):
    report_dtm = models.DateTimeField(null=True,blank=True)
    bill_start = models.DateTimeField(null=True,blank=True)
    bill_end = models.DateTimeField(null=True,blank=True)
    audit_status = models.CharField(max_length=100,default=AuditStatus.APPROVAL)
    bill_transit = models.IntegerField(default=0)
    cost_mult = models.DecimalField(default = 0, decimal_places=4,max_digits =30)
    sid = models.ForeignKey(Station,on_delete=models.CASCADE)
