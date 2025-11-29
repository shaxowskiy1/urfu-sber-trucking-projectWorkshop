package ru.urfu.dailystatusupdateservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.urfu.dailystatusupdateservice.repository.DailyStatusRepository;

@Service
@RequiredArgsConstructor
public class DailyStatusService {

    private final DailyStatusRepository dailyStatusRepository;

    public void updateStatus() {
        //TODO запрос к датчикам

        //TODO update set sql query for updating
    }
}
