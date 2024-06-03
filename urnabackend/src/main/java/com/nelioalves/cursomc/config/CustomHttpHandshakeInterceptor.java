package com.nelioalves.cursomc.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class CustomHttpHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // Extract the token from the URI
        String token = getTokenFromUri(request);
        // You can add the token or other attributes to the WebSocket session attributes
        attributes.put("token", token);
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {
        // After handshake logic (if needed)
    }

    private String getTokenFromUri(ServerHttpRequest request) {
        // Extract the token from the URI (query parameter in this case)
        String uri = request.getURI().toString();
        String[] parts = uri.split("\\?");
        if (parts.length > 1) {
            String query = parts[1];
            String[] queryParams = query.split("&");
            for (String param : queryParams) {
                String[] keyValue = param.split("=");
                if (keyValue.length > 1 && keyValue[0].equals("token")) {
                    return keyValue[1];
                }
            }
        }
        return null;
    }
}
