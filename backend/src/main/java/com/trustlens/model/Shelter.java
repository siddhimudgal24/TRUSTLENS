package com.trustlens.model;

public class Shelter {
    private int shelterId;
    private String name;
    private String locationAddress;
    private double latitude;
    private double longitude;
    private int totalCapacity;
    private int currentOccupancy;
    private String status; // OPERATIONAL, NEAR_CAPACITY, FULL, UNSAFE, CLOSED
    private int waterSupplyRating;
    private int foodCapacityDays;
    private int medicalFacilityRating;
    private double structuralSafetyScore;
    private double readinessScore;
    private Integer managerId;

    public Shelter() {}

    public int getShelterId() { return shelterId; }
    public void setShelterId(int shelterId) { this.shelterId = shelterId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public int getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(int currentOccupancy) { this.currentOccupancy = currentOccupancy; }

    public int getAvailableCapacity() { return totalCapacity - currentOccupancy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getWaterSupplyRating() { return waterSupplyRating; }
    public void setWaterSupplyRating(int waterSupplyRating) { this.waterSupplyRating = waterSupplyRating; }

    public int getFoodCapacityDays() { return foodCapacityDays; }
    public void setFoodCapacityDays(int foodCapacityDays) { this.foodCapacityDays = foodCapacityDays; }

    public int getMedicalFacilityRating() { return medicalFacilityRating; }
    public void setMedicalFacilityRating(int medicalFacilityRating) { this.medicalFacilityRating = medicalFacilityRating; }

    public double getStructuralSafetyScore() { return structuralSafetyScore; }
    public void setStructuralSafetyScore(double structuralSafetyScore) { this.structuralSafetyScore = structuralSafetyScore; }

    public double getReadinessScore() { return readinessScore; }
    public void setReadinessScore(double readinessScore) { this.readinessScore = readinessScore; }

    public Integer getManagerId() { return managerId; }
    public void setManagerId(Integer managerId) { this.managerId = managerId; }
}
