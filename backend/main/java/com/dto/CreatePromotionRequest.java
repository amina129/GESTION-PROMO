public class CreatePromotionRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String code;

    @NotBlank
    @Size(min = 3, max = 100)
    private String nom;

    @Size(max = 500)
    private String description;

    @NotNull
    private Long typePromotionId;

    @NotNull
    private LocalDate dateDebut;

    @NotNull
    private LocalDate dateFin;

    @Min(0)
    @Max(1000)
    private Integer bonusPourcentage;
    @DecimalMin(value = "0.0")
    private BigDecimal bonusFixe;

    @DecimalMin(value = "0.001")
    private BigDecimal montantMinRecharge;

    @Min(1)
    private Integer maxUtilisationsParClient;

    private Boolean isAutomatic = false;

    private List<Long> criteresIds;

    // constructors, getters, setters
}