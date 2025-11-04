package ru.urfu.matchservice.service;

import org.springframework.stereotype.Service;
import ru.urfu.matchservice.models.CoordinatesDateDTO;
import ru.urfu.matchservice.models.DriverLegInfo;
import ru.urfu.matchservice.models.Driver;
import ru.urfu.matchservice.repository.OrderRepository;
import ru.urfu.matchservice.service.route.RouteTimeClient;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DriverService {
    private final OrderRepository orderRepository;
    private final RouteTimeClient routeTimeClient;

    public DriverService(OrderRepository orderRepository, RouteTimeClient routeTimeClient) {
        this.orderRepository = orderRepository;
        this.routeTimeClient = routeTimeClient;
    }

    public List<Driver> getDrivers(CoordinatesDateDTO coordinatesDateDTO){
        List<DriverLegInfo> lastLegs = orderRepository.findLastLegsBefore(coordinatesDateDTO.getLocalDateTime());
        if (lastLegs.isEmpty()) {
            throw new RuntimeException("No drivers are free.");
        }

        return solveMatch(coordinatesDateDTO, lastLegs);
    }

    private List<Driver> solveMatch(CoordinatesDateDTO coordinatesDateDTO, List<DriverLegInfo> lastLegs) {
        BigDecimal targetLat = coordinatesDateDTO.getLatitude();
        BigDecimal targetLon = coordinatesDateDTO.getLongitute();
        LocalDateTime targetTime = coordinatesDateDTO.getLocalDateTime();

        double aLat = targetLat.doubleValue();
        double aLon = targetLon.doubleValue();

        List<Candidate> candidates = new ArrayList<>();

        for (DriverLegInfo leg : lastLegs) {
            double bLat;
            double bLon;
            try {
                bLat = Double.parseDouble(leg.getDestinationLatitude());
                bLon = Double.parseDouble(leg.getDestinationLongitude());
            } catch (Exception e) {
                continue;
            }

            long gapHours = Duration.between(leg.getDeliveryDate(), targetTime).toHours();
            if (gapHours > 24) {
                continue;
            }

            double haversineKm = ru.urfu.matchservice.utils.GeoUtils.haversineKm(bLat, bLon, aLat, aLon);
            if (haversineKm > 300.0) {
                continue;
            }

            long apiSeconds = routeTimeClient.getTravelTimeSeconds(bLat, bLon, aLat, aLon);
            long adjustedTravelSeconds = Math.round(apiSeconds * 1.25);

            LocalDateTime earliestDeparture = leg.getDeliveryDate().plusHours(3);
            LocalDateTime arrivalAtA = earliestDeparture.plusSeconds(adjustedTravelSeconds);

            if (arrivalAtA.isAfter(targetTime)) {
                continue;
            }

            long rankingSeconds = adjustedTravelSeconds + (6L * 3600L);
            candidates.add(new Candidate(leg.getDriverId(), rankingSeconds));
        }

        candidates.sort(Comparator.comparingLong(c -> c.rankingSeconds));

        List<Driver> result = new ArrayList<>();
        for (Candidate c : candidates) {
            result.add(new Driver(c.driverId));
        }
        return result;
    }

    private static class Candidate {
        private final Integer driverId;
        private final long rankingSeconds;

        private Candidate(Integer driverId, long rankingSeconds) {
            this.driverId = driverId;
            this.rankingSeconds = rankingSeconds;
        }
    }
}
