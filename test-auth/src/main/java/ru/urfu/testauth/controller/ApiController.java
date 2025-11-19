package ru.urfu.testauth.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.urfu.testauth.models.GeocodingResponse;
import ru.urfu.testauth.models.Order;
import ru.urfu.testauth.models.User;
import ru.urfu.testauth.service.AuthService;
import ru.urfu.testauth.service.OpenStreetApi;
import ru.urfu.testauth.service.OrderService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3003",
        "http://localhost:3001"
}, maxAge = 3600)
@Slf4j
public class ApiController {
    private final AuthService authService;
    private final OrderService orderService;
    private final OpenStreetApi openStreetApi;

    static String validateFields(User user, boolean isLogin) {
        if (user.getInn() == null || user.getInn().isEmpty() || user.getPassword() == null || user.getPassword().isEmpty()) {
            return "ИНН и пароль обязательны";
        }
        if (!isLogin && (user.getCompany() == null || user.getCompany().isEmpty())) {
            return "Заполните все поля для регистрации";
        }
        return null;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        String err = validateFields(user, true);
        if (err != null) {
            return ResponseEntity.badRequest().body(Map.of("message", err));
        }
        User found = authService.login(user.getInn(), user.getPassword());
        if (found == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Неверный ИНН или пароль"));
        }
        return ResponseEntity.ok(Map.of("user", found));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String err = validateFields(user, false);
        if (err != null) {
            return ResponseEntity.badRequest().body(Map.of("message", err));
        }
        try {
            User newUser = authService.register(user);
            return ResponseEntity.ok(newUser);
        } catch (Exception ex) {
            return ResponseEntity.status(409).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/orders/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        log.info("Запрос дошёл");
        List<String> required = List.of("shipperName", "managerName", "origin", "destination", "pickupDate", "deliveryDate", "transportationCost", "vehicleCount");
        List<String> missing = new ArrayList<>();
        for (String f : required)
            if (!request.containsKey(f) || request.get(f) == null || request.get(f).toString().isEmpty())
                missing.add(f);
        if (!missing.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("message", "Заполните все обязательные поля: " + String.join(", ", missing)));
        Double cost;
        Integer vehicleCount;
        try {
            cost = Double.parseDouble(request.get("transportationCost").toString());
            vehicleCount = Integer.parseInt(request.get("vehicleCount").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message","Стоимость и количество транспорта должны быть числами"));
        }
        if (cost <= 0) return ResponseEntity.badRequest().body(Map.of("message", "Стоимость должна быть положительным числом"));
        if (vehicleCount < 1 || vehicleCount > 5) return ResponseEntity.badRequest().body(Map.of("message", "Количество транспорта должно быть от 1 до 5"));
        try {
            LocalDate pickupDate = LocalDate.parse(request.get("pickupDate").toString());
            LocalDate deliveryDate = LocalDate.parse(request.get("deliveryDate").toString());
            if (pickupDate.isAfter(deliveryDate)) {
                return ResponseEntity.badRequest().body(Map.of("message","Дата погрузки не может быть позже даты доставки"));
            }
            List<Order> orders = new ArrayList<>();
            for (int i = 0; i < vehicleCount; i++) {
                Order.OrderBuilder builder = Order.builder()
                        .shipperName((String) request.get("shipperName"))
                        .managerName((String) request.get("managerName"))
                        .origin((String) request.get("origin"))
                        .destination((String) request.get("destination"))
                        .originLatitude(request.get("originLatitude")==null?null:Double.valueOf(request.get("originLatitude").toString()))
                        .originLongitude(request.get("originLongitude")==null?null:Double.valueOf(request.get("originLongitude").toString()))
                        .destinationLatitude(request.get("destinationLatitude")==null?null:Double.valueOf(request.get("destinationLatitude").toString()))
                        .destinationLongitude(request.get("destinationLongitude")==null?null:Double.valueOf(request.get("destinationLongitude").toString()))
                        .trailerType((String) request.getOrDefault("trailerType", null))
                        .volume(request.get("volume") == null ? 0.0 : Double.valueOf(request.get("volume").toString().replaceAll("[^\\d.-]", "")))                        .weight(request.get("weight")==null?null:Double.valueOf(request.get("weight").toString()))
                        .pickupDate(pickupDate)
                        .pickupTime(request.get("pickupTime")==null?null:LocalTime.parse(request.get("pickupTime").toString()))
                        .deliveryDate(deliveryDate)
                        .deliveryTime(request.get("deliveryTime")==null?null: LocalTime.parse(request.get("deliveryTime").toString()))
                        .cargoType((String) request.getOrDefault("cargoType", null))
                        .specialRequirements((String) request.getOrDefault("specialRequirements", ""))
                        .transportationCost(cost)
                        .length(request.get("length")==null?null:Double.valueOf(request.get("length").toString()))
                        .width(request.get("width")==null?null:Double.valueOf(request.get("width").toString()))
                        .height(request.get("height")==null?null:Double.valueOf(request.get("height").toString()))
                        .vehicleCount(1)
                        .externalOrderNumber((String) request.getOrDefault("externalOrderNumber", null))
                        .status("Ожидает")
                        .assignedDriverId(null);
                orders.add(orderService.createOrder(builder.build()));
            }
            return ResponseEntity.status(201).body(Map.of(
                    "order", orders.get(0),
                    "createdCount", orders.size()
            ));
        } catch (Exception e) {
            log.error("Ошибка при создании заказа: ", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Ошибка сервера при создании заказа"));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(Map.of("orders", orders));
    }

    @PostMapping("/orders/{id}/status")
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok("ok");
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Заказ удален"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", "Заказ не найден"));
        }
    }
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(Map.of("users", users));
    }

    @GetMapping("/test")
    public ResponseEntity<GeocodingResponse> testController(@RequestParam String address){
        return ResponseEntity.ok(openStreetApi.getCoordinates(address));
    }
}
