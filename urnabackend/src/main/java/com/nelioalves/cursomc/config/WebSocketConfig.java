package com.nelioalves.cursomc.config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;

import com.nelioalves.cursomc.listener.WebSocketDisconnectEventListener;



@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer  {
	
    @Bean
    public WebSocketDisconnectEventListener webSocketDisconnectEventListener() {
        return new WebSocketDisconnectEventListener();
    }
    
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker to send messages to clients
        config.enableSimpleBroker("/topic","/user");
        // Set the application prefix for destinations handled through the message broker
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/websocket" endpoint for clients to connect to WebSocket
        registry.addEndpoint("/websocket").setAllowedOrigins("*")
        .addInterceptors(new HttpHandshakeInterceptor()).withSockJS();
        
  
    }
    
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
    	
        registration.addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
            @Override
            public WebSocketHandler decorate(WebSocketHandler handler) {
                return new OneWebSocketHandlerDecorator(handler);
            }
        });
    }
    

}
