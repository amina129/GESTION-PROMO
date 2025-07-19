package com.codewithamina.gestionpromo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private Instant timestamp;
}