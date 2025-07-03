public class RedeemPointsRequest {
    @NotBlank
    @Pattern(regexp = "^\\d{8}$", message = "Phone number must be 8 digits")
    private String phoneNumber;

    @NotNull
    @Min(1)
    private Integer points;

    @NotBlank
    private String description;

    // constructors, getters, setters
}