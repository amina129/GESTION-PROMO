package com.codewithamina.gestionpromo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private long totalPromotions;
    private long activePromotions;
    private long totalClients;
    private long activationsToday;
    private long activationsThisWeek;
    private long activationsThisMonth;
}
