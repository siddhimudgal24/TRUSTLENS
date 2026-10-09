package com.trustlens.model;

import java.sql.Timestamp;

public class AffectedPopulation {
    private int populationGroupId;
    private int zoneId;
    private String familyHeadName;
    private String contactNumber;
    private int familyMembersCount;
    private int vulnerableMembersCount;
    private int priorityLevel; // 1 (Highest priority) to 5
    private String specialRequirements;
    private Timestamp createdAt;
    private String zoneName;

    public AffectedPopulation() {}

    public int getPopulationGroupId() { return populationGroupId; }
    public void setPopulationGroupId(int populationGroupId) { this.populationGroupId = populationGroupId; }

    public int getZoneId() { return zoneId; }
    public void setZoneId(int zoneId) { this.zoneId = zoneId; }

    public String getFamilyHeadName() { return familyHeadName; }
    public void setFamilyHeadName(String familyHeadName) { this.familyHeadName = familyHeadName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public int getFamilyMembersCount() { return familyMembersCount; }
    public void setFamilyMembersCount(int familyMembersCount) { this.familyMembersCount = familyMembersCount; }

    public int getVulnerableMembersCount() { return vulnerableMembersCount; }
    public void setVulnerableMembersCount(int vulnerableMembersCount) { this.vulnerableMembersCount = vulnerableMembersCount; }

    public int getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(int priorityLevel) { this.priorityLevel = priorityLevel; }

    public String getSpecialRequirements() { return specialRequirements; }
    public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }
}
