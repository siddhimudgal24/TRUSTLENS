package com.trustlens.dao;

import com.trustlens.model.Disaster;
import com.trustlens.model.AffectedZone;
import com.trustlens.model.AffectedPopulation;

import java.util.List;

public interface DisasterDAO {
    boolean createDisaster(Disaster disaster);
    List<Disaster> getAllDisasters();
    List<Disaster> getActiveDisasters();
    Disaster getDisasterById(int disasterId);
    boolean updateDisaster(Disaster disaster);
    boolean deleteDisaster(int disasterId);

    // Zones
    boolean addZone(AffectedZone zone);
    List<AffectedZone> getZonesByDisaster(int disasterId);
    boolean deleteZone(int zoneId);

    // Affected Population
    boolean addPopulationGroup(AffectedPopulation population);
    List<AffectedPopulation> getPopulationsByZone(int zoneId);
    List<AffectedPopulation> getAllPopulations();
    int calculatePriority(int totalMembers, int vulnerableMembers);
}
