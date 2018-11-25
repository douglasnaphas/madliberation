package com.madliberationgame.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.madliberationgame.GatewayResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * Handler for requests to Lambda function.
 */
public class CookieHandler implements RequestHandler<Map<String, Object>, Object> {
    public static final String AUTH_CODE = "auth-code";
    public static final String QUERY_STRING_PARAMETERS = "queryStringParameters";

    public Object handleRequest(final Map<String, Object> input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("location", "http://localhost:3000");
        headers.put("set-cookie", "c1=cook 1");
        headers.put("set-cookiE", "c2=cook 2");

        for(String k : input.keySet()) {
            System.out.println("***** there is a key: " + k);
            System.out.println("**** value: " + input.get(k));
        }
        if(input.containsKey(QUERY_STRING_PARAMETERS)) {
            Map<String, Object> queryStringParameters = (HashMap<String, Object>)
                    input.get(QUERY_STRING_PARAMETERS);
            if(queryStringParameters != null) {
                for (String p : queryStringParameters.keySet()) {
                    System.out.println("***** there is a param: " + p + ", value: "
                            + queryStringParameters.get(p));
                }
            }
        }
        return new GatewayResponse("{}", headers,
                303);
    }
}
