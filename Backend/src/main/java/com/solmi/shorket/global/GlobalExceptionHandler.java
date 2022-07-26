package com.solmi.shorket.global;

import com.solmi.shorket.global.exception.EmailLoginFailedCException;
import com.solmi.shorket.global.exception.UserSignupFailedCException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private final MessageSource messageSource;

    @ExceptionHandler(EmailLoginFailedCException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ExceptionResponse emailLoginFailedException(HttpServletRequest request, EmailLoginFailedCException e) {
        log.info(String.valueOf(e));
        return new ExceptionResponse(
                getMessage("emailLoginFailed.code"),
                getMessage("emailLoginFailed.message")
        );
    }

    @ExceptionHandler(UserSignupFailedCException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ExceptionResponse userSignupFailedException(HttpServletRequest request, UserSignupFailedCException e) {
        log.info(String.valueOf(e));
        return new ExceptionResponse(
                getMessage("userSignupFailed.code"),
                getMessage("userSignupFailed.message")
        );
    }

    private String getMessage(String code) {
        return getMessage(code, null);
    }

    private String getMessage(String code, Object[] args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
