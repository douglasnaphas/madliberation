package com.madliberationgame.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.madliberationgame.GatewayResponse;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Handler for requests to Lambda function.
 */
public class SignedCookiesHandler implements RequestHandler<Map<String, Object>, Object> {
    public static final String AUTH_CODE = "auth-code";
    public static final String QUERY_STRING_PARAMETERS = "queryStringParameters";

    public Object handleRequest(final Map<String, Object> input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.put("Access-Control-Allow-Credentials", "true");
        headers.put("location", "http://localhost:3000");
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:m:s.n a");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime later = LocalDateTime.now();
        headers.put("set-cookie", "sc1=" + now.format(dateTimeFormatter));
        headers.put("set-cookiE", "sc2=" + later.format(dateTimeFormatter));

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
        String body = new JSONObject().put("result", "cookies sent").toString();
        return new GatewayResponse(body, headers, 200);
    }
}
