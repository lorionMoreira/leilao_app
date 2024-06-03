package com.nelioalves.cursomc.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.services.ClienteService;
import com.nelioalves.cursomc.statics.WebSocketSessionManager;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


public class OneWebSocketHandlerDecorator  extends WebSocketHandlerDecorator {
	
    @Autowired
    private ClienteService clienteservice; 
    


	public OneWebSocketHandlerDecorator(WebSocketHandler delegate) {
		super(delegate);
		// TODO Auto-generated constructor stub
	}

    @Override
    public void afterConnectionEstablished(final WebSocketSession session) throws Exception {
        String token = (String) session.getAttributes().get("token");
        String sessionId = session.getId();
        
        System.out.println("fromthing");
        System.out.println(token);

        
        //User user = clienteservice.findByToken(token);
        //System.out.println(user);
        // Offload the user retrieval to a separate thread
        
        WebSocketSessionManager.addSession(sessionId, session);
        super.afterConnectionEstablished(session);
        

        // 客户端与服务器端建立连接后，此处记录谁上线了
        //logger.info("WebSocket Online, Principal Id[{}], Session Id[{}]", principalId, sessionId);
        //SocketSessionRegistry.registerSessionId(principalId, sessionId);

        
    } 
    
 

}
