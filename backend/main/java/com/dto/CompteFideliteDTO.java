// Loyalty DTOs
public class CompteFideliteDTO {
    private Long id;
    private String clientPhoneNumber;
    private String programmeName;
    private Integer pointsTotaux;
    private Integer pointsDisponibles;
    private Integer pointsUtilises;
    private NiveauFidelite niveau;
    private LocalDateTime dateCreation;
    private List<TransactionFideliteDTO> recentTransactions;

    // constructors, getters, setters
}