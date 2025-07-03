// 1. CLIENT MANAGEMENT CONTROLLER

@RestController
@RequestMapping("/api/clients")
@PreAuthorize("hasRole('CONSULTANT') or hasRole('MANAGER') or hasRole('ADMIN')")
@CrossOrigin
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private EligibilityService eligibilityService;

    // Get client by phone number
    @GetMapping("/{phoneNumber}")
    public ResponseEntity<ClientDTO> getClient(@PathVariable String phoneNumber) {
        try {
            Client client = clientService.findByPhoneNumber(phoneNumber);
            return ResponseEntity.ok(ClientMapper.toDTO(client));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get client's eligible promotions
    @GetMapping("/{phoneNumber}/eligible-promotions")
    public ResponseEntity<List<PromotionDTO>> getEligiblePromotions(@PathVariable String phoneNumber) {
        try {
            Client client = clientService.findByPhoneNumber(phoneNumber);
            List<Promotion> eligiblePromotions = eligibilityService.getEligiblePromotions(client);
            return ResponseEntity.ok(eligiblePromotions.stream()
                    .map(PromotionMapper::toDTO)
                    .collect(Collectors.toList()));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update client balance (for recharge simulation)
    @PutMapping("/{phoneNumber}/balance")
    public ResponseEntity<ClientDTO> updateBalance(
            @PathVariable String phoneNumber,
            @RequestBody @Valid BalanceUpdateRequest request) {
        try {
            Client client = clientService.updateBalance(phoneNumber, request.getMontant());

            // Check for automatic promotions after recharge
            List<Promotion> autoPromotions = promotionService.getAutomaticPromotions(client, request.getMontant());

            // Activate eligible automatic promotions
            for (Promotion promo : autoPromotions) {
                if (eligibilityService.isEligible(client, promo)) {
                    promotionService.activatePromotion(client, promo, getCurrentAdmin(), request.getMontant());
                }
            }

            return ResponseEntity.ok(ClientMapper.toDTO(client));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get client's active promotions
    @GetMapping("/{phoneNumber}/active-promotions")
    public ResponseEntity<List<ActivationPromotionDTO>> getActivePromotions(@PathVariable String phoneNumber) {
        try {
            List<ActivationPromotion> activePromotions = clientService.getActivePromotions(phoneNumber);
            return ResponseEntity.ok(activePromotions.stream()
                    .map(ActivationPromotionMapper::toDTO)
                    .collect(Collectors.toList()));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get client's loyalty account
    @GetMapping("/{phoneNumber}/loyalty")
    public ResponseEntity<CompteFideliteDTO> getLoyaltyAccount(@PathVariable String phoneNumber) {
        try {
            CompteFidelite compte = clientService.getLoyaltyAccount(phoneNumber);
            return ResponseEntity.ok(CompteFideliteMapper.toDTO(compte));
        } catch (ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Search clients (for consultants)
    @GetMapping("/search")
    public ResponseEntity<List<ClientDTO>> searchClients(
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) ClientSegment segment,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Client> clients = clientService.searchClients(phoneNumber, fullName, segment, pageable);

        return ResponseEntity.ok(clients.getContent().stream()
                .map(ClientMapper::toDTO)
                .collect(Collectors.toList()));
    }

    private Admin getCurrentAdmin() {
        // Get current authenticated admin from SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return adminService.findByUsername(auth.getName());
    }
}






// EXCEPTION HANDLER

