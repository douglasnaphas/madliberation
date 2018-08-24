package com.madliberationgame.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.madliberationgame.GatewayResponse;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Handler for requests to Lambda function.
 */
public class PrintAuthCodeHandler implements RequestHandler<Map<String, Object>, Object> {
    public static final String AUTH_CODE = "auth-code";
    public static final String QUERY_STRING_PARAMETERS = "queryStringParameters";

    public Object handleRequest(final Map<String, Object> input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        JSONObject responseJSON = new JSONObject();
        String authCode = null;
        if(input.containsKey(QUERY_STRING_PARAMETERS)) {
            Map<String, Object> queryStringParameters = (HashMap<String, Object>)
                    input.get(QUERY_STRING_PARAMETERS);
            authCode = (String) queryStringParameters.getOrDefault(AUTH_CODE, null);
            responseJSON.put(AUTH_CODE, authCode);
        }
        return new GatewayResponse(responseJSON.toString(), headers,
                200);
    }
}
