public class BalanceUpdateRequest {
    @NotNull
    @DecimalMin(value = "0.001", message = "Amount must be positive")
    private BigDecimal montant;

    private String description;

    // constructors, getters, setters
}