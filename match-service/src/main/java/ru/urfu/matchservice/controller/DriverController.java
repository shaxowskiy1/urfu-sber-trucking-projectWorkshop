package ru.urfu.matchservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.urfu.matchservice.models.CoordinatesDateDTO;
import ru.urfu.matchservice.models.DriverResponseDTO;
import ru.urfu.matchservice.service.DriverService;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:3003",
        "http://localhost:3001"
}, maxAge = 3600)
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

    @PostMapping("/api/calculate/assign")
    public ResponseEntity<String> assignDriver(
    ){
        return ResponseEntity.ok("ok");
    }
}
