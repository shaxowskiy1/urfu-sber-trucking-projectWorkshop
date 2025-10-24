package ru.urfu.matchservice.models;

import lombok.Data;

@Data
public class OrderDTO {
    private String id;
    private String shipperName;
    private String managerName;
    private String origin;
    private String destination;
    private String originLatitude;
    private String originLongitude;
    private String destinationLatitude;
    private String destinationLongitude;
    private String trailerType;
    private String volume;
    private String weight;
    private String pickupDate;
    private String pickupTime;
    private String deliveryDate;
    private String deliveryTime;
    private Double transportationCost;
    private String status;
    private String cargoType;
    private String specialRequirements;
    private String length;
    private String width;
    private String height;
    private String assignedDriverId;
    private String externalOrderNumber;
}
