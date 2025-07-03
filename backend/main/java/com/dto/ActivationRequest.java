public class ActivationRequest {
    @NotBlank
    @Pattern(regexp = "^\\d{8}$", message = "Phone number must be 8 digits")
    private String phoneNumber;

    @DecimalMin(value = "0.001", message = "Recharge amount must be positive")
    private BigDecimal montantRecharge;

    private String notes;

    // constructors, getters, setters
}