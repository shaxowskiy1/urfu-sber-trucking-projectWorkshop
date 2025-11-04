package ru.urfu.matchservice.models;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
public class DriverLegInfo {
    private final Integer driverId;
    private final String destinationLatitude;
    private final String destinationLongitude;
    private final LocalDateTime deliveryDate;

    public DriverLegInfo(Integer driverId, String destinationLatitude, String destinationLongitude, LocalDateTime deliveryDate) {
        this.driverId = driverId;
        this.destinationLatitude = destinationLatitude;
        this.destinationLongitude = destinationLongitude;
        this.deliveryDate = deliveryDate;
    }
}


