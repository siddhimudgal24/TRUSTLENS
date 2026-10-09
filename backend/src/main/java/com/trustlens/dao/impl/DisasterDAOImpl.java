package com.trustlens.dao.impl;

import com.trustlens.config.DBConnection;
import com.trustlens.dao.DisasterDAO;
import com.trustlens.model.Disaster;
import com.trustlens.model.AffectedZone;
import com.trustlens.model.AffectedPopulation;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DisasterDAOImpl implements DisasterDAO {

    @Override
    public boolean createDisaster(Disaster disaster) {
        String sql = "INSERT INTO disasters (title, type, severity, status, location_name, latitude, longitude, start_date, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, disaster.getTitle());
            ps.setString(2, disaster.getType());
            ps.setString(3, disaster.getSeverity());
            ps.setString(4, disaster.getStatus() != null ? disaster.getStatus() : "ACTIVE");
            ps.setString(5, disaster.getLocationName());
            ps.setDouble(6, disaster.getLatitude());
            ps.setDouble(7, disaster.getLongitude());
            ps.setTimestamp(8, disaster.getStartDate() != null ? disaster.getStartDate() : new Timestamp(System.currentTimeMillis()));
            ps.setString(9, disaster.getDescription());
            if (disaster.getCreatedBy() > 0) {
                ps.setInt(10, disaster.getCreatedBy());
            } else {
                ps.setNull(10, Types.INTEGER);
            }

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Disaster> getAllDisasters() {
        List<Disaster> list = new ArrayList<>();
        String sql = "SELECT * FROM disasters ORDER BY disaster_id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapDisaster(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<Disaster> getActiveDisasters() {
        List<Disaster> list = new ArrayList<>();
        String sql = "SELECT * FROM disasters WHERE status = 'ACTIVE' ORDER BY disaster_id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapDisaster(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public Disaster getDisasterById(int disasterId) {
        String sql = "SELECT * FROM disasters WHERE disaster_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, disasterId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapDisaster(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean updateDisaster(Disaster disaster) {
        String sql = "UPDATE disasters SET title = ?, type = ?, severity = ?, status = ?, location_name = ?, latitude = ?, longitude = ?, description = ? WHERE disaster_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, disaster.getTitle());
            ps.setString(2, disaster.getType());
            ps.setString(3, disaster.getSeverity());
            ps.setString(4, disaster.getStatus());
            ps.setString(5, disaster.getLocationName());
            ps.setDouble(6, disaster.getLatitude());
            ps.setDouble(7, disaster.getLongitude());
            ps.setString(8, disaster.getDescription());
            ps.setInt(9, disaster.getDisasterId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean deleteDisaster(int disasterId) {
        String sql = "DELETE FROM disasters WHERE disaster_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, disasterId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean addZone(AffectedZone zone) {
        String sql = "INSERT INTO affected_zones (disaster_id, zone_name, risk_level, estimated_affected_count, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, zone.getDisasterId());
            ps.setString(2, zone.getZoneName());
            ps.setString(3, zone.getRiskLevel());
            ps.setInt(4, zone.getEstimatedAffectedCount());
            ps.setDouble(5, zone.getLatitude());
            ps.setDouble(6, zone.getLongitude());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<AffectedZone> getZonesByDisaster(int disasterId) {
        List<AffectedZone> list = new ArrayList<>();
        String sql = "SELECT z.*, d.title as disaster_title FROM affected_zones z JOIN disasters d ON z.disaster_id = d.disaster_id WHERE z.disaster_id = ? ORDER BY z.zone_id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, disasterId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    AffectedZone z = new AffectedZone();
                    z.setZoneId(rs.getInt("zone_id"));
                    z.setDisasterId(rs.getInt("disaster_id"));
                    z.setZoneName(rs.getString("zone_name"));
                    z.setRiskLevel(rs.getString("risk_level"));
                    z.setEstimatedAffectedCount(rs.getInt("estimated_affected_count"));
                    z.setLatitude(rs.getDouble("latitude"));
                    z.setLongitude(rs.getDouble("longitude"));
                    z.setDisasterTitle(rs.getString("disaster_title"));
                    list.add(z);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public boolean deleteZone(int zoneId) {
        String sql = "DELETE FROM affected_zones WHERE zone_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, zoneId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean addPopulationGroup(AffectedPopulation pop) {
        int priority = calculatePriority(pop.getFamilyMembersCount(), pop.getVulnerableMembersCount());
        pop.setPriorityLevel(priority);

        String sql = "INSERT INTO affected_populations (zone_id, family_head_name, contact_number, family_members_count, vulnerable_members_count, priority_level, special_requirements) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, pop.getZoneId());
            ps.setString(2, pop.getFamilyHeadName());
            ps.setString(3, pop.getContactNumber());
            ps.setInt(4, pop.getFamilyMembersCount());
            ps.setInt(5, pop.getVulnerableMembersCount());
            ps.setInt(6, pop.getPriorityLevel());
            ps.setString(7, pop.getSpecialRequirements());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<AffectedPopulation> getPopulationsByZone(int zoneId) {
        List<AffectedPopulation> list = new ArrayList<>();
        String sql = "SELECT p.*, z.zone_name FROM affected_populations p JOIN affected_zones z ON p.zone_id = z.zone_id WHERE p.zone_id = ? ORDER BY p.priority_level ASC, p.population_group_id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, zoneId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapPopulation(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<AffectedPopulation> getAllPopulations() {
        List<AffectedPopulation> list = new ArrayList<>();
        String sql = "SELECT p.*, z.zone_name FROM affected_populations p JOIN affected_zones z ON p.zone_id = z.zone_id ORDER BY p.priority_level ASC, p.population_group_id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapPopulation(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public int calculatePriority(int totalMembers, int vulnerableMembers) {
        // Priority 1 (Highest) to Priority 5 (Lowest)
        if (vulnerableMembers >= 3 || (totalMembers > 0 && ((double) vulnerableMembers / totalMembers) >= 0.5)) {
            return 1; // Highest Priority
        } else if (vulnerableMembers >= 1) {
            return 2;
        } else if (totalMembers >= 5) {
            return 3;
        } else if (totalMembers >= 3) {
            return 4;
        } else {
            return 5; // Standard Priority
        }
    }

    private Disaster mapDisaster(ResultSet rs) throws SQLException {
        Disaster d = new Disaster();
        d.setDisasterId(rs.getInt("disaster_id"));
        d.setTitle(rs.getString("title"));
        d.setType(rs.getString("type"));
        d.setSeverity(rs.getString("severity"));
        d.setStatus(rs.getString("status"));
        d.setLocationName(rs.getString("location_name"));
        d.setLatitude(rs.getDouble("latitude"));
        d.setLongitude(rs.getDouble("longitude"));
        d.setStartDate(rs.getTimestamp("start_date"));
        d.setEndDate(rs.getTimestamp("end_date"));
        d.setDescription(rs.getString("description"));
        d.setCreatedBy(rs.getInt("created_by"));
        return d;
    }

    private AffectedPopulation mapPopulation(ResultSet rs) throws SQLException {
        AffectedPopulation p = new AffectedPopulation();
        p.setPopulationGroupId(rs.getInt("population_group_id"));
        p.setZoneId(rs.getInt("zone_id"));
        p.setFamilyHeadName(rs.getString("family_head_name"));
        p.setContactNumber(rs.getString("contact_number"));
        p.setFamilyMembersCount(rs.getInt("family_members_count"));
        p.setVulnerableMembersCount(rs.getInt("vulnerable_members_count"));
        p.setPriorityLevel(rs.getInt("priority_level"));
        p.setSpecialRequirements(rs.getString("special_requirements"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        p.setZoneName(rs.getString("zone_name"));
        return p;
    }
}
