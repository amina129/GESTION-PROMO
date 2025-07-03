@RestController
@RequestMapping("/api/system")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin
public class SystemController {

    @Autowired
    private SystemService systemService;

    // Get all system parameters
    @GetMapping("/parameters")
    public ResponseEntity<List<ParametreSystemeDTO>> getSystemParameters() {
        List<ParametreSysteme> parametres = systemService.getAllParameters();
        return ResponseEntity.ok(parametres.stream()
                .map(ParametreSystemeMapper::toDTO)
                .collect(Collectors.toList()));
    }

    // Update system parameter
    @PutMapping("/parameters/{key}")
    public ResponseEntity<ParametreSystemeDTO> updateParameter(
            @PathVariable String key,
            @RequestBody @Valid UpdateParameterRequest request) {
        try {
            ParametreSysteme parametre = systemService.updateParameter(key, request.getValue());
            return ResponseEntity.ok(ParametreSystemeMapper.toDTO(parametre));
        } catch (ParameterNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (ParameterNotEditableException e) {
            return ResponseEntity.badRequest()
                    .header("Error-Message", "Parameter is not editable")
                    .build();
        }
    }

    // Get system health check
    @GetMapping("/health")
    public ResponseEntity<SystemHealthDTO> getSystemHealth() {
        SystemHealth health = systemService.getSystemHealth();
        return ResponseEntity.ok(SystemHealthMapper.toDTO(health));
    }
}