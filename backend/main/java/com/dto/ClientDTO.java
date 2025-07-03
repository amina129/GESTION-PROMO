public class ClientDTO {
    private Long id;
    private String phoneNumber;
    private String fullName;
    private ClientType type;
    private BigDecimal balance;
    private ClientSegment segment;
    private LocalDate registrationDate;
    private LocalDateTime lastRechargeDate;
    private Boolean isActive;
    private CompteFideliteDTO compteFidelite;
}