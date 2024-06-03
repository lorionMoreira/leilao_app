package com.nelioalves.cursomc.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.nelioalves.cursomc.domain.Message;



@Controller
public class ChatMessage {
	
	 @Autowired
	private SimpMessagingTemplate brokerMessagingTemplate;

    @MessageMapping("/chat.register")
    @SendTo("/topic/public")
    public Message register(@Payload Message Message) {
     //   headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return Message;
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public Message sendMessage(@Payload Message message) {
    	System.out.println(message.toString());
        return message;
    }
    
    @MessageMapping("/chat.send2")
    public Message sendMessage2(@Payload Message message) {
    	System.out.println(message.toString());
    	brokerMessagingTemplate.convertAndSendToUser(message.getRoomId(),"/private",message);
        
    	return message;
    }
    
    /*
    @MessageMapping("/private-message")
    public ChatMessage recMessage(@Payload ChatMessage message){
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
        System.out.println(message.toString());
        return message;
    }
     stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
    */


}
