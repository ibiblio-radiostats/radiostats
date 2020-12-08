from django.db import models

# Create your models here.

class AuditStatus(models.TextChoices):
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    UNUSABLE = 'UNUSABLE',


class Station(models.Model):
    station_name = models.CharField(max_length=100)
    
    def __str__(self):
       return self.station_name

class Report(models.Model):
    report_dtm = models.DateTimeField(null=True,blank=True)
    bill_start = models.DateTimeField(null=True)
    bill_end = models.DateTimeField(null=True)
    audit_status = models.CharField(max_length=100,choices=AuditStatus.choices,default=AuditStatus.PENDING_APPROVAL)
    bill_transit = models.DecimalField(default=0,decimal_places=10,max_digits=30)
    cost_mult = models.DecimalField(default=0,decimal_places=10,max_digits=30)
    sid = models.ForeignKey(Station,related_name='stations',on_delete=models.CASCADE)
    report = models.FileField(blank=True)
