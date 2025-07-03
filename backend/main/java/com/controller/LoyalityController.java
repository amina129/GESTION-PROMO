@RestController
@RequestMapping("/api/loyalty")
@PreAuthorize("hasRole('CONSULTANT') or hasRole('MANAGER') or hasRole('ADMIN')")
@CrossOrigin
public class LoyaltyController {

    @Autowired
    private FideliteService fideliteService;

    // Get loyalty account details
    @GetMapping("/account/{phoneNumber}")
    public ResponseEntity<CompteFideliteDTO> getLoyaltyAccount(@PathVariable String phoneNumber) {
        try {
            CompteFidelite compte = fideliteService.getCompteFidelite(phoneNumber);
            return ResponseEntity.ok(CompteFideliteMapper.toDTO(compte));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get loyalty transaction history
    @GetMapping("/transactions/{phoneNumber}")
    public ResponseEntity<List<TransactionFideliteDTO>> getLoyaltyTransactions(
            @PathVariable String phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<TransactionFidelite> transactions = fideliteService.getTransactionHistory(phoneNumber, pageable);

            return ResponseEntity.ok(transactions.getContent().stream()
                    .map(TransactionFideliteMapper::toDTO)
                    .collect(Collectors.toList()));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Redeem loyalty points
    @PostMapping("/redeem")
    public ResponseEntity<TransactionFideliteDTO> redeemPoints(@RequestBody @Valid RedeemPointsRequest request) {
        try {
            TransactionFidelite transaction = fideliteService.redeemPoints(
                    request.getPhoneNumber(),
                    request.getPoints(),
                    request.getDescription(),
                    getCurrentAdmin()
            );

            return ResponseEntity.ok(TransactionFideliteMapper.toDTO(transaction));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (InsufficientPointsException e) {
            return ResponseEntity.badRequest()
                    .header("Error-Message", "Insufficient points")
                    .build();
        }
    }

    // Calculate points for a transaction
    @PostMapping("/calculate-points")
    public ResponseEntity<PointsCalculationResponse> calculatePoints(@RequestBody @Valid PointsCalculationRequest request) {
        try {
            int points = fideliteService.calculatePoints(request.getPhoneNumber(), request.getMontant());
            return ResponseEntity.ok(new PointsCalculationResponse(points));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get loyalty program details
    @GetMapping("/program/{programId}")
    public ResponseEntity<ProgrammeFideliteDTO> getLoyaltyProgram(@PathVariable Long programId) {
        try {
            ProgrammeFidelite programme = fideliteService.getProgrammeFidelite(programId);
            return ResponseEntity.ok(ProgrammeFideliteMapper.toDTO(programme));
        } catch (ProgrammeNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Admin getCurrentAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return adminService.findByUsername(auth.getName());
    }
}