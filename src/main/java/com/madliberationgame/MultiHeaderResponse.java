package com.madliberationgame;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.util.MultiValueMap;

/**
 * POJO containing response object for API Gateway.
 */
public class MultiHeaderResponse {

    private final String body;
    private final MultiValueMap<String, String> headers;
    private final int statusCode;

    public MultiHeaderResponse(final String body, final MultiValueMap<String, String> headers, final int statusCode) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }

    public String getBody() {
        return body;
    }

    public Map<String, String> getHeaders() {
        Map<String, String> headers = new HashMap();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("set-cookie", "ax=ay ex");
        headers.put("Set-cookie", "bx=bee exx");
        return headers;
    }

//    public String getHeaders() {
//        return "{\"Access-Control-Allow-Origin\":\"*\",\"Content-Type\":\"application/json\"}";
//    }

    public int getStatusCode() {
        return statusCode;
    }
}
