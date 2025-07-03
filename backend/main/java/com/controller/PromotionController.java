
@RestController
@RequestMapping("/api/promotions")
@CrossOrigin
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private EligibilityService eligibilityService;

    @Autowired
    private StatistiqueService statistiqueService;

    // Get all active promotions
    @GetMapping
    @PreAuthorize("hasRole('CONSULTANT') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<PromotionDTO>> getAllPromotions(
            @RequestParam(defaultValue = "true") boolean activeOnly) {
        List<Promotion> promotions = promotionService.getAllPromotions(activeOnly);
        return ResponseEntity.ok(promotions.stream()
                .map(PromotionMapper::toDTO)
                .collect(Collectors.toList()));
    }

    // Get promotion by code
    @GetMapping("/{code}")
    @PreAuthorize("hasRole('CONSULTANT') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PromotionDTO> getPromotionByCode(@PathVariable String code) {
        try {
            Promotion promotion = promotionService.findByCode(code);
            return ResponseEntity.ok(PromotionMapper.toDTO(promotion));
        } catch (PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Activate promotion for a client (Manual activation by consultant)
    @PostMapping("/{code}/activate")
    @PreAuthorize("hasRole('CONSULTANT') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ActivationPromotionDTO> activatePromotion(
            @PathVariable String code,
            @RequestBody @Valid ActivationRequest request) {
        try {
            Client client = clientService.findByPhoneNumber(request.getPhoneNumber());
            Promotion promotion = promotionService.findByCode(code);
            Admin admin = getCurrentAdmin();

            // Check eligibility
            if (!eligibilityService.isEligible(client, promotion)) {
                return ResponseEntity.badRequest()
                        .header("Error-Message", "Client not eligible for this promotion")
                        .build();
            }

            // Check usage limits
            if (promotionService.hasExceededUsageLimit(client, promotion)) {
                return ResponseEntity.badRequest()
                        .header("Error-Message", "Usage limit exceeded for this promotion")
                        .build();
            }

            ActivationPromotion activation = promotionService.activatePromotion(
                    client, promotion, admin, request.getMontantRecharge());

            return ResponseEntity.ok(ActivationPromotionMapper.toDTO(activation));

        } catch (ClientNotFoundException | PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (PromotionNotActiveException e) {
            return ResponseEntity.badRequest()
                    .header("Error-Message", "Promotion is not active")
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("Error-Message", "Internal server error")
                    .build();
        }
    }

    // Check promotion eligibility for a client
    @PostMapping("/{code}/check-eligibility")
    @PreAuthorize("hasRole('CONSULTANT') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<EligibilityCheckResponse> checkEligibility(
            @PathVariable String code,
            @RequestBody @Valid EligibilityCheckRequest request) {
        try {
            Client client = clientService.findByPhoneNumber(request.getPhoneNumber());
            Promotion promotion = promotionService.findByCode(code);

            EligibilityResult result = eligibilityService.checkEligibilityDetailed(client, promotion);

            return ResponseEntity.ok(new EligibilityCheckResponse(
                    result.isEligible(),
                    result.getFailedCriteria(),
                    result.getReasons()
            ));

        } catch (ClientNotFoundException | PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get promotion statistics
    @GetMapping("/{code}/statistics")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PromotionStatisticsDTO> getPromotionStatistics(
            @PathVariable String code,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        try {
            Promotion promotion = promotionService.findByCode(code);
            PromotionStatistics stats = statistiqueService.getPromotionStatistics(
                    promotion, dateDebut, dateFin);

            return ResponseEntity.ok(PromotionStatisticsMapper.toDTO(stats));

        } catch (PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Create new promotion (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody @Valid CreatePromotionRequest request) {
        try {
            Promotion promotion = promotionService.createPromotion(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(PromotionMapper.toDTO(promotion));
        } catch (DuplicatePromotionCodeException e) {
            return ResponseEntity.badRequest()
                    .header("Error-Message", "Promotion code already exists")
                    .build();
        }
    }

    // Update promotion (Admin only)
    @PutMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionDTO> updatePromotion(
            @PathVariable String code,
            @RequestBody @Valid UpdatePromotionRequest request) {
        try {
            Promotion promotion = promotionService.updatePromotion(code, request);
            return ResponseEntity.ok(PromotionMapper.toDTO(promotion));
        } catch (PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Deactivate promotion (Admin only)
    @DeleteMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivatePromotion(@PathVariable String code) {
        try {
            promotionService.deactivatePromotion(code);
            return ResponseEntity.noContent().build();
        } catch (PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Admin getCurrentAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return adminService.findByUsername(auth.getName());
    }
}
