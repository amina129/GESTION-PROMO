
@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        try {
            AuthResponse response = authService.authenticate(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header("Error-Message", "Invalid credentials")
                    .build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        try {
            AuthResponse response = authService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (InvalidTokenException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header("Error-Message", "Invalid refresh token")
                    .build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody @Valid LogoutRequest request) {
        authService.logout(request.getToken());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CONSULTANT') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<AdminProfileDTO> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Admin admin = adminService.findByUsername(auth.getName());
        return ResponseEntity.ok(AdminProfileMapper.toDTO(admin));
    }
}