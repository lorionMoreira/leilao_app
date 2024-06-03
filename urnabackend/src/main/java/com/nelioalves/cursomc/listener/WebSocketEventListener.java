package com.nelioalves.cursomc.listener;

import java.io.IOException;
import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SessionConnectEvent;

import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.services.ClienteService;
import com.nelioalves.cursomc.statics.WebSocketSessionManager;


@Component
public class WebSocketEventListener {
	
    @Autowired
    private ClienteService clienteservice;
    

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("lorion");
        String token  = (String) headers.getSessionAttributes().get("token");
        String sessionId = headers.getSessionId();
       // System.out.println(headers.toString());			
        User user = clienteservice.findByToken(token);
        System.out.println(user);
        System.out.println("lorion2");
        
        WebSocketSession session = WebSocketSessionManager.getSession(sessionId);   
        
        if(user == null) {
        	try {
				session.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
        
      clienteservice.updateSession(user, sessionId);
      
    }
    
}
