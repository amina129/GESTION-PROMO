package com.codewithamina.gestionpromo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class EligibilityResult {


    private boolean eligible;

    private List<String> failedCriteria;

    private List<String> reasons;

    public EligibilityResult(boolean eligible, List<String> failedCriteria, List<String> reasons) {
        this.eligible = eligible;
        this.failedCriteria = failedCriteria;
        this.reasons = reasons;
    }

}
