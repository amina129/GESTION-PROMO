public class PointsCalculationRequest {
    @NotBlank
    @Pattern(regexp = "^\\d{8}$", message = "Phone number must be 8 digits")
    private String phoneNumber;

    @NotNull
    @DecimalMin(value = "0.001")
    private BigDecimal montant;

    // constructors, getters, setters
}