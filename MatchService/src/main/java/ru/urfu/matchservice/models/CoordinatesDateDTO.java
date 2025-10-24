package ru.urfu.matchservice.models;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CoordinatesDateDTO {
    private LocalDateTime localDateTime;
    private BigDecimal longitute;
    private BigDecimal latitude;
}
