package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendsDto {
    private String period;
    private String metric;
    private List<TrendDataDto> trends;
}