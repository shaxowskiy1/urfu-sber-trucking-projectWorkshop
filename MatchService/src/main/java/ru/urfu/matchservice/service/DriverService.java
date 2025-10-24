package ru.urfu.matchservice.service;

import org.springframework.stereotype.Service;
import ru.urfu.matchservice.models.CoordinatesDateDTO;
import ru.urfu.matchservice.models.Driver;
import ru.urfu.matchservice.repository.DriverRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {
    private DriverRepository driverRepository;

    public List<Driver> getDrivers(CoordinatesDateDTO coordinatesDateDTO){
//        driverRepository.
        List<Driver> drivers = null;
        solveMatch(coordinatesDateDTO, drivers);
        return drivers;
//                .orElseThrow(() -> new RuntimeException("Failed get driver. Drivers is null"));
    }

    private void solveMatch(CoordinatesDateDTO coordinatesDateDTO, List<Driver> drivers) {

    }
}
