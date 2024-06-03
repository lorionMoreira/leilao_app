package com.nelioalves.cursomc.listener;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.nelioalves.cursomc.domain.Sala;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.services.ClienteService;
import com.nelioalves.cursomc.services.SalaService;
import com.nelioalves.cursomc.statics.WebSocketSessionManager;

import org.springframework.messaging.core.AbstractMessageSendingTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class WebSocketDisconnectEventListener implements ApplicationListener<SessionDisconnectEvent>{
    
	

    
    @Autowired
    private ClienteService clienteservice;
    
    @Autowired
    private SalaService salaservice;
    

    
    @Autowired
	private SimpMessagingTemplate brokerMessagingTemplate;
	
	@Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // Perform actions when a WebSocket session is disconnected
        // For example, update your backend based on the disconnected session
        updateBackendOnDisconnect(sessionId,event);
    }

    private void updateBackendOnDisconnect(String sessionId,SessionDisconnectEvent event) {
    	StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());

        // Add your logic here to handle backend updates on disconnection
        // This method will be called whenever a WebSocket session is disconnected
        System.out.println("WebSocket session disconnected: " + sessionId);
    	WebSocketSessionManager.removeSession(sessionId); 
    
    	User user =clienteservice.findBySession(sessionId);
    	
    	if(user != null ) {
    		String eventString = user.getSession_ev();
    		
            switch (eventString) {
            case "BeLeilaoPart":
            	String uuid  = (String) headers.getSessionAttributes().get("uuid");
                System.out.println(uuid);
                
                clienteservice.updateSession(user, null);
                
                Sala sala = salaservice.findByUuid(uuid);
                int valor = +1 ;
                Sala obj = salaservice.updateCurrent(sala,valor);
                
                List<Sala> salaList = salaservice.findAll();
                System.out.println("salaList");
                System.out.println(salaList);
              
                this.brokerMessagingTemplate.convertAndSend("/topic/salas",salaList);
                
                break;
                
            }
            
    		
    	}
    	
    	
    }
}
