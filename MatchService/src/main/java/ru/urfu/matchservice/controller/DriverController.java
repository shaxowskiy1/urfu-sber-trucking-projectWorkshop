package ru.urfu.matchservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.urfu.matchservice.models.CoordinatesDateDTO;
import ru.urfu.matchservice.models.DriverResponseDTO;
import ru.urfu.matchservice.service.DriverService;

import java.util.List;

@RestController
public class DriverController {
    private DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping("/api/calculate")
    public ResponseEntity<List<DriverResponseDTO>> getPriorityDrivers(
            @RequestBody CoordinatesDateDTO coordinatesDateDTO
    ){
        return ResponseEntity.ok(driverService.getDrivers(coordinatesDateDTO));
    }
}
