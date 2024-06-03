package com.nelioalves.cursomc.config;

import java.net.URI;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.services.ClienteService;

public class HttpHandshakeInterceptor implements HandshakeInterceptor {
	


    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
 
    	
        URI uri = request.getURI();
        String token = getTokenFromUri(uri);
        System.out.println(request.toString());
        // You can add the token or other attributes to the WebSocket session attributes
        if (token != null) {
        	/*
        	User user = clienteService.findByToken(token);
            System.out.println("Tokenfromhttp: " + token);
            System.out.println("Usserfromfromhttp: " + user);
            */
        	
            attributes.put("token", token);
        }
        

         
        // You can add the token or other attributes to the WebSocket session attributes
    	
    	
    	//System.out.println(response);
    	//System.out.println(wsHandler);
    	//System.out.println(attributes);
        //attributes.put("token", token);
        return true;
    }

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Exception exception) {
		// TODO Auto-generated method stub
		

	}
	
	private String getTokenFromUri(URI uri) {
	    String query = uri.getQuery();
	    if (query != null) {
	        String[] queryParams = query.split("&");
	        for (String param : queryParams) {
	            String[] keyValue = param.split("=");
	            if (keyValue.length == 2 && "token".equals(keyValue[0])) {
	                return keyValue[1];
	            }
	        }
	    }
	    return null;
	}

}
