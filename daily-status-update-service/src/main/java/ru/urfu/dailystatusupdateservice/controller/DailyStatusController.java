package ru.urfu.dailystatusupdateservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.urfu.dailystatusupdateservice.service.DailyStatusService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/status")
public class DailyStatusController {
    private final DailyStatusService dailyStatusService;
    @GetMapping
    public ResponseEntity<?> updateStatus(){
        dailyStatusService.updateStatus();
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
