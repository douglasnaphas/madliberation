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
public class RedirectHandler implements RequestHandler<Object, Object> {

    public Object handleRequest(final Object input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("location", "http://localhost:3000");
        return new GatewayResponse("", headers,
                303);
    }
}
