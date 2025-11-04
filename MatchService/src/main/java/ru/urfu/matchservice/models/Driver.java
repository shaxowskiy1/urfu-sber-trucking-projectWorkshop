package ru.urfu.matchservice.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "drivers")
@AllArgsConstructor
public class Driver {
    @Id
    private Integer id;
    private String originLatitude;
    private String originLongitude;
    private LocalDateTime deliveryDate;

    public Driver(Integer id, LocalDateTime deliveryDate, String destinationLongitude, String destinationLatitude) {
        this.id = id;
        this.deliveryDate = deliveryDate;
        this.originLatitude = destinationLongitude;
        this.originLongitude = destinationLatitude;
    }
}
