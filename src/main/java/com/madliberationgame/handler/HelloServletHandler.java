package com.madliberationgame.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.madliberationgame.GatewayResponse;
import javax.servlet.http.HttpServletResponse;

import com.madliberationgame.MultiHeaderResponse;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.Map;

import com.madliberationgame.AWSLambdaResponseEntity;
import org.springframework.util.MultiValueMap;

/**
 * Handler for requests to Lambda function.
 */
public class HelloServletHandler implements RequestHandler<Map<String, Object>, Object> {
    public static final String AUTH_CODE = "auth-code";
    public static final String QUERY_STRING_PARAMETERS = "queryStringParameters";

    public Object handleRequest(final Map<String, Object> input, final Context context) {
//        Map<String, String> headers = new HashMap<>();
//        headers.put("Content-Type", "application/json");
//        headers.put("Access-Control-Allow-Origin", "*");
//        headers.put("location", "http://localhost:3000");
//        for(String k : input.keySet()) {
//            System.out.println("***** there is a key: " + k);
//        }
//        if(input.containsKey(QUERY_STRING_PARAMETERS)) {
//            Map<String, Object> queryStringParameters = (HashMap<String, Object>)
//                    input.get(QUERY_STRING_PARAMETERS);
//            for(String p : queryStringParameters.keySet()) {
//                System.out.println("***** there is a param: " + p + ", value: "
//                    + queryStringParameters.get(p));
//            }
//        }
//        return new GatewayResponse("", headers,
//                303);
        String body = new JSONObject().put("Output", "Hello World!!!").toString();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        headers.add("Access-Control-Allow-Origin", "*");
//        return new AWSLambdaResponseEntity(body, headers, HttpStatus.OK);
        MultiHeaderResponse response = new MultiHeaderResponse(body, headers, 200);
        System.out.println("response:");
        System.out.println(response.toString());
        System.out.println(new JSONObject(response).toString());
        return response;
    }
}
