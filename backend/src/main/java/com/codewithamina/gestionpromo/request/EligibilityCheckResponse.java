package com.codewithamina.gestionpromo.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class EligibilityCheckResponse {

    private boolean eligible;
    private List<String> failedCriteria;
    private List<String> reasons;

    public EligibilityCheckResponse(boolean eligible, List<String> failedCriteria, List<String> reasons) {
        this.eligible = eligible;
        this.failedCriteria = failedCriteria;
        this.reasons = reasons;
    }

}
