package ru.urfu.dailystatusupdateservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.urfu.dailystatusupdateservice.repository.DailyStatusRepository;

@Service
@RequiredArgsConstructor
public class DailyStatusService {

    private final RestTemplate restTemplate;
    private final DailyStatusRepository dailyStatusRepository;

    public void updateStatus() {
        //TODO запрос к датчикам
        restTemplate
                .get
        //TODO update set sql query for updating
    }
}
