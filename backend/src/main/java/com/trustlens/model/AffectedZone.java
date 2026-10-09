package com.trustlens.model;

public class AffectedZone {
    private int zoneId;
    private int disasterId;
    private String zoneName;
    private String riskLevel; // 'LOW', 'MEDIUM', 'HIGH', 'SEVERE'
    private int estimatedAffectedCount;
    private double latitude;
    private double longitude;
    private String disasterTitle;

    public AffectedZone() {}

    public AffectedZone(int zoneId, int disasterId, String zoneName, String riskLevel, int estimatedAffectedCount, double latitude, double longitude) {
        this.zoneId = zoneId;
        this.disasterId = disasterId;
        this.zoneName = zoneName;
        this.riskLevel = riskLevel;
        this.estimatedAffectedCount = estimatedAffectedCount;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public int getZoneId() { return zoneId; }
    public void setZoneId(int zoneId) { this.zoneId = zoneId; }

    public int getDisasterId() { return disasterId; }
    public void setDisasterId(int disasterId) { this.disasterId = disasterId; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public int getEstimatedAffectedCount() { return estimatedAffectedCount; }
    public void setEstimatedAffectedCount(int estimatedAffectedCount) { this.estimatedAffectedCount = estimatedAffectedCount; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getDisasterTitle() { return disasterTitle; }
    public void setDisasterTitle(String disasterTitle) { this.disasterTitle = disasterTitle; }
}
