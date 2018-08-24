package com.madliberationgame.handler;

import com.amazonaws.serverless.proxy.internal.testutils.MockLambdaContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.madliberationgame.GatewayResponse;
import org.json.JSONObject;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Tests for {@link HelloWorldHandler}. Modify the tests in order to support your use case as you build your project.
 */
@DisplayName("Tests for HelloWorldHandler")
public class PrintAuthCodeHandlerTest {

    private static final String EXPECTED_CONTENT_TYPE = "application/json";
    private static final String EXPECTED_RESPONSE_VALUE = "abc";
    private static final int EXPECTED_STATUS_CODE_SUCCESS = 200;

    // A mock class for com.amazonaws.services.lambda.runtime.Context
    private final MockLambdaContext mockLambdaContext = new MockLambdaContext();
    private final Map<String, Object> input = new HashMap<String, Object>()
            {{put(PrintAuthCodeHandler.AUTH_CODE, EXPECTED_RESPONSE_VALUE);}};

    /**
     * Initializing variables before we run the tests.
     * Use @BeforeAll for initializing static variables at the start of the test class execution.
     * Use @BeforeEach for initializing variables before each test is run.
     */
    @BeforeAll
    static void setup() {
        // Use as needed.
    }

    /**
     * De-initializing variables after we run the tests.
     * Use @AfterAll for de-initializing static variables at the end of the test class execution.
     * Use @AfterEach for de-initializing variables at the end of each test.
     */
    @AfterAll
    static void tearDown() {
        // Use as needed.
    }

    /**
     * Basic test to verify the result obtained when calling {@link PrintAuthCodeHandler} successfully.
     */
    @Test
    @DisplayName("Basic test for request handler")
    void testHandleRequest() throws IOException {
        final ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> value = mapper.readValue(new File(
                "target/test-classes/com/madliberationgame/handler/input1.json"),
                HashMap.class);
        final Map<String, Object> input = (Map<String, Object>) ((HashMap<String, Object>) value).clone();
        GatewayResponse response = (GatewayResponse) new PrintAuthCodeHandler().handleRequest(input,
                mockLambdaContext);

        // Verify the response obtained matches the values we expect.
        JSONObject jsonObjectFromResponse = new JSONObject(response.getBody());
        assertEquals(EXPECTED_RESPONSE_VALUE, jsonObjectFromResponse.get(PrintAuthCodeHandler.AUTH_CODE));
        assertEquals(EXPECTED_CONTENT_TYPE, response.getHeaders().get("Content-Type"));
        assertEquals(EXPECTED_STATUS_CODE_SUCCESS, response.getStatusCode());
    }
}
