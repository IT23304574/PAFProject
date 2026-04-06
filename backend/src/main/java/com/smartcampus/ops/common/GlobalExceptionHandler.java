package com.smartcampus.ops.common;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.URI;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(NotFoundException.class)
  public ProblemDetail notFound(NotFoundException ex, HttpServletRequest request) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    pd.setInstance(URI.create(request.getRequestURI()));
    return pd;
  }

  @ExceptionHandler(ConflictException.class)
  public ProblemDetail conflict(ConflictException ex, HttpServletRequest request) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    pd.setInstance(URI.create(request.getRequestURI()));
    return pd;
  }

  @ExceptionHandler(BadRequestException.class)
  public ProblemDetail badRequest(BadRequestException ex, HttpServletRequest request) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    pd.setInstance(URI.create(request.getRequestURI()));
    return pd;
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ProblemDetail validation(MethodArgumentNotValidException ex, HttpServletRequest request) {
    var pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
    pd.setTitle("Validation failed");
    pd.setInstance(URI.create(request.getRequestURI()));
    var errors = ex.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(
            FieldError::getField,
            FieldError::getDefaultMessage,
            (a, b) -> a
        ));
    pd.setProperty("errors", errors);
    return pd;
  }

  @ExceptionHandler(Exception.class)
  public ProblemDetail generic(Exception ex) {
    log.error("Unhandled exception caught by global handler", ex);
    String detail = "An unexpected internal error occurred. Please try again later or contact support.";
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, detail);
    pd.setTitle("Internal Server Error");
    pd.setProperty("timestamp", java.time.Instant.now());
    return pd;
  }
}
