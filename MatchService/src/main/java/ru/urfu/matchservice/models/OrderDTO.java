package ru.urfu.matchservice.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

import java.time.LocalDateTime;

//TODO add foreign key to driver for check free transport on time
@Entity
@Data
public class OrderDTO {
    @Id
    private Integer id;
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
    private LocalDateTime pickupDate;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryDate;
    private LocalDateTime deliveryTime;
    private Double transportationCost;
    private String status;
    private String cargoType;
    private String specialRequirements;
    private String length;
    private String width;
    private String height;
    private String assignedDriverId;
    private String externalOrderNumber;

//    @OneToOne()
    private Integer fkDriver;
}
