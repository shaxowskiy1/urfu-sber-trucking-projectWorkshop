package ru.urfu.matchservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.urfu.matchservice.models.CoordinatesDateDTO;
import ru.urfu.matchservice.models.OrderDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderDTO, Integer> {
    Optional<OrderDTO> findfkByDeliveryDateBefore(LocalDateTime timeOrder);

    @Query("SELECT o.fkDriver, o.destinationLatitude, o.destinationLongitude " +
            "FROM OrderDTO o " +
            "WHERE o.deliveryDate < :targetDateTime")
    Optional<List<CoordinatesDateDTO>> findDriversAndDestinationsBeforeDateTime(@Param("targetDateTime") LocalDateTime targetDateTime);
}
