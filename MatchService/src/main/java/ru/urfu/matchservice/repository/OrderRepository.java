package ru.urfu.matchservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.urfu.matchservice.models.DriverLegInfo;
import ru.urfu.matchservice.models.OrderDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderDTO, Integer> {
    @Query("select new ru.urfu.matchservice.models.DriverLegInfo(o.assignedDriverId, o.destinationLatitude, o.destinationLongitude, o.deliveryDate) " +
            "from OrderDTO o " +
            "where o.deliveryDate = (select max(o2.deliveryDate) from OrderDTO o2 where o2.assignedDriverId = o.assignedDriverId and o2.deliveryDate < :targetDateTime)")
    List<DriverLegInfo> findLastLegsBefore(@Param("targetDateTime") LocalDateTime targetDateTime);
}
