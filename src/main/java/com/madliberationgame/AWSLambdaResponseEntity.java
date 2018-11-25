package com.madliberationgame;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.http.HttpStatus;

import java.util.Map;

public class AWSLambdaResponseEntity {

    private ResponseEntity<String> responseEntity;

    /**
     * Create a new {@code ResponseEntity} with the given status code, and no body nor headers,
     * wrapped by this AWSLambdaResponseEntity.
     *
     * @param status the status code
     */
    public AWSLambdaResponseEntity(HttpStatus status) {
        this.responseEntity = new ResponseEntity<String>(status);
    }

    /**
     * Create a new {@code ResponseEntity} with the given body and status code, and no headers,
     * wrapped by this AWSLambdaResponseEntity.
     *
     * @param body   the entity body
     * @param status the status code
     */
    public AWSLambdaResponseEntity(String body, HttpStatus status) {
        this.responseEntity = new ResponseEntity<String>(body, status);
    }

    /**
     * Create a new {@code HttpEntity} with the given headers and status code, and no body,
     * wrapped by this AWSLambdaResponseEntity.
     *
     * @param headers the entity headers
     * @param status  the status code
     */
    public AWSLambdaResponseEntity(MultiValueMap headers, HttpStatus status) {
        this.responseEntity = new ResponseEntity<String>(headers, status);
    }

    /**
     * Create a new {@code HttpEntity} with the given body, headers, and status code,
     * wrapped by this AWSLambdaResponseEntity.
     *
     * @param body    the entity body
     * @param headers the entity headers
     * @param status  the status code
     */
    public AWSLambdaResponseEntity(String body, MultiValueMap headers, HttpStatus status) {
        this.responseEntity = new ResponseEntity<String>(body, headers, status);
    }

    public AWSLambdaResponseEntity(final String body, final Map<String, String> headers, final int statusCode) {
        this(body, (MultiValueMap) headers, HttpStatus.valueOf(statusCode));
    }

    public String getBody() {
        return this.responseEntity.getBody();
    }

    public MultiValueMap<String, String> getHeaders() {
        return this.responseEntity.getHeaders();
    }

    public int getStatusCode() {
        return this.responseEntity.getStatusCodeValue();
    }

}
