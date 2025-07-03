public class PromotionDTO {
    private Long id;
    private String code;
    private String nom;
    private String description;
    private String typePromotion;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer bonusPourcentage;
    private BigDecimal bonusFixe;
    private BigDecimal montantMinRecharge;
    private Integer maxUtilisationsParClient;
    private Boolean isActive;
    private Boolean isAutomatic;
    private List<CritereEligibiliteDTO> criteres;

    // constructors, getters, setters
}