package ru.urfu.matchservice.service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
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
import java.util.stream.Collectors;

@Service
@Slf4j
public class DriverService {
    private final OrderRepository orderRepository;
    private final RouteTimeClient routeTimeClient;

    public DriverService(OrderRepository orderRepository, RouteTimeClient routeTimeClient) {
        this.orderRepository = orderRepository;
        this.routeTimeClient = routeTimeClient;
    }

    public List<Driver> getDrivers(CoordinatesDateDTO coordinatesDateDTO){
        List<DriverLegInfo> lastLegs = orderRepository.findLastLegsBefore(coordinatesDateDTO.getLocalDateTime());
        log.info("The list of drivers is: {}", lastLegs.toString());
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
            log.info("Driver {}: gapHours = {}, deliveryDate = {}",
                    leg.getDriverId(), gapHours, leg.getDeliveryDate());
            if (gapHours > 24) {
                log.info("Driver {} filtered by time gap", leg.getDriverId());
                continue;
            }

            double haversineKm = ru.urfu.matchservice.utils.GeoUtils.haversineKm(bLat, bLon, aLat, aLon);
            if (haversineKm > 300.0) {
                log.info("Driver {} filtered: haversineKm = {}, getDestinationLongitude = {}",
                        leg.getDriverId(), haversineKm, leg.getDestinationLongitude());
                continue;
            }

            long apiSeconds = routeTimeClient.getTravelTimeSeconds(bLat, bLon, aLat, aLon);
            long adjustedTravelSeconds = Math.round(apiSeconds * 1.25);

            LocalDateTime earliestDeparture = leg.getDeliveryDate().plusHours(3);
            LocalDateTime arrivalAtA = earliestDeparture.plusSeconds(adjustedTravelSeconds);

            if (arrivalAtA.isAfter(targetTime)) {
                log.info("Driver {} filtered by afterTargetTime", leg.getDriverId());
                continue;
            }

            long rankingSeconds = adjustedTravelSeconds + (6L * 3600L);
            Candidate candidate = new Candidate(leg.getDriverId(), rankingSeconds, leg.getOriginLatitude(), leg.getOriginLongitude());
            candidate.setDestinationLongitude(leg.getDestinationLongitude());
            candidate.setDestinationLatitude(leg.getDestinationLatitude());
            candidate.setDeliveryDate(leg.getDeliveryDate());
            candidates.add(candidate);
        }

        candidates.sort(Comparator.comparingLong(c -> c.rankingSeconds));

        List<Driver> result = new ArrayList<>();
        for (Candidate c : candidates) {
            result.add(new Driver(c.driverId, c.getDeliveryDate(), c.getOriginLatitude(), c.getOriginLongitude()));
        }

        //TODO temporary solution. bug twice answer
        return result
                .stream()
                .distinct()
                .collect(Collectors.toList());
    }

    @Data
    private static class Candidate {
        private final Integer driverId;
        private final long rankingSeconds;
        private String destinationLatitude;
        private String destinationLongitude;
        private LocalDateTime deliveryDate;
        private final String originLatitude;
        private final String originLongitude;

        private Candidate(Integer driverId, long rankingSeconds, String originLatitude, String originLongitude) {
            this.driverId = driverId;
            this.rankingSeconds = rankingSeconds;
            this.originLatitude = originLatitude;
            this.originLongitude = originLongitude;
        }
    }
}
