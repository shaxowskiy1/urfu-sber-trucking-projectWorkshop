package ru.urfu.matchservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.urfu.matchservice.models.CoordinatesDateDTO;
import ru.urfu.matchservice.models.Driver;
import ru.urfu.matchservice.service.DriverService;

import java.util.List;

@RestController
public class OrderController {
    private DriverService driverService;

    public OrderController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping
    public ResponseEntity<List<Driver>> getPriorityDrivers(
            @RequestBody CoordinatesDateDTO coordinatesDateDTO
    ){
        return ResponseEntity.ok(driverService.getDrivers(coordinatesDateDTO));
    }
}
