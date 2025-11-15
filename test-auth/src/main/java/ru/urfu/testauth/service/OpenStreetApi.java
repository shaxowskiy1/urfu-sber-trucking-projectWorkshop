package ru.urfu.testauth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OpenStreetApi {
    private final String BASE_URL = "https://api.opencagedata.com/geocode/v1/json";
    private final RestTemplate restTemplate;



}
