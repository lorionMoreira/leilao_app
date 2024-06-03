package com.nelioalves.cursomc.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;

import com.nelioalves.cursomc.domain.User;

@Service
public class WebSocketUserService {

    @Autowired
    private ClienteService clienteservice;
    
    public User handleIdentify(SimpMessageHeaderAccessor headerAccessor,String eventString) {
		
    	String sessionId = headerAccessor.getSessionId();
    	
    	User user = clienteservice.findBySession(sessionId);
    	
    	User updatedUser  = clienteservice.updateEvent(user,eventString);
    	
    	return updatedUser;
    	
    }
}
