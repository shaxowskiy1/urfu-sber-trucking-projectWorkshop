package ru.urfu.matchservice.service;

import org.springframework.stereotype.Service;
import ru.urfu.matchservice.models.CoordinatesDateDTO;
import ru.urfu.matchservice.models.Driver;
import ru.urfu.matchservice.repository.DriverRepository;
import ru.urfu.matchservice.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class DriverService {
    private final OrderRepository orderRepository;
    private DriverRepository driverRepository;

    public DriverService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Driver> getDrivers(CoordinatesDateDTO coordinatesDateDTO){
        orderRepository.
                findDriversAndDestinationsBeforeDateTime(coordinatesDateDTO.getLocalDateTime())
                .orElseThrow(() -> new RuntimeException("No drivers is free." ));
//        driverRepository.
        List<Driver> drivers = null;
        solveMatch(coordinatesDateDTO, drivers);
        return drivers;
//                .orElseThrow(() -> new RuntimeException("Failed get driver. Drivers is null"));
    }

    private void solveMatch(CoordinatesDateDTO coordinatesDateDTO, List<Driver> drivers) {

        //берем точку А
        BigDecimal latitude = coordinatesDateDTO.getLatitude();
        BigDecimal longitute = coordinatesDateDTO.getLongitute();




    }
}
