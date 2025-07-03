public class EligibilityCheckRequest {
    @NotBlank
    @Pattern(regexp = "^\\d{8}$", message = "Phone number must be 8 digits")
    private String phoneNumber;

    // constructors, getters, setters
}