package ru.urfu.matchservice.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "drivers")
public class Driver {
    @Id
    private Integer id;

    private String name;

    public Driver(Integer driverId) {
        this.id = driverId;
    }
}
