@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClientNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleClientNotFound(ClientNotFoundException e) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(PromotionNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePromotionNotFound(PromotionNotFoundException e) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException e) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("VALIDATION_ERROR", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception e) {
        return ResponseEntity.internalServerError()
                .body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}