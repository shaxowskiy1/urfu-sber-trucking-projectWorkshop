package ru.urfu.matchservice.models;

import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
public class DriverLegInfo {
    private final Integer driverId;
    private final String destinationLatitude;
    private final String destinationLongitude;
    private final String originLatitude;
    private final String originLongitude;
    private final LocalDateTime deliveryDate;

    public DriverLegInfo(Integer driverId, String destinationLatitude, String destinationLongitude, String originLatitude, String originLongitude, LocalDateTime deliveryDate) {
        this.driverId = driverId;
        this.destinationLatitude = destinationLatitude;
        this.destinationLongitude = destinationLongitude;
        this.originLatitude = originLatitude;
        this.originLongitude = originLongitude;
        this.deliveryDate = deliveryDate;
    }

    @Override
    public String toString() {
        return "DriverLegInfo{" +
                "driverId=" + driverId +
                ", destinationLatitude='" + destinationLatitude + '\'' +
                ", destinationLongitude='" + destinationLongitude + '\'' +
                ", deliveryDate=" + deliveryDate +
                '}';
    }
}


