package com.nelioalves.cursomc.resources;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nelioalves.cursomc.domain.Message;
import com.nelioalves.cursomc.domain.Message.MessageType;
import com.nelioalves.cursomc.domain.Sala;
import com.nelioalves.cursomc.services.ClienteService;
import com.nelioalves.cursomc.services.CountdownService;
import com.nelioalves.cursomc.services.SalaService;
import com.nelioalves.cursomc.statics.CountdownInfo;

@Controller
public class CountdownResource {

    @Autowired
    private CountdownService service;
    
    @Autowired
    private ClienteService clienteservice;
    
    @Autowired
    private SalaService salaservice;
    
    private static final int COUNTDOWN_DURATION = 60;
    
    private Map<String, CountdownInfo> countdowns = new HashMap<>();
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/startcountdown")
    public synchronized void startcountdown(@Payload Map<String, Object> data ) {
    	//donebyscriptpython the first time
    	Object uuidValue = data.get("uuid");
    	Object managerValue = data.get("manager");
    	Object produtoIdValue = data.get("produtoId");
    	
    	
    	String uuid = (String) uuidValue;
    	Sala mysala =  salaservice.findByUuid(uuid);
    	String manager2 = mysala.getEstado();
    	String manager = (String) managerValue;   
    	
    	Integer produtoId = (Integer) produtoIdValue;   
    	System.out.println(manager);
    	
        synchronized (uuid.intern()) {
            CountdownInfo countdownInfo = countdowns.get(uuid);
            
            // put this in a new service
            Date currentDate = Calendar.getInstance().getTime();
            MessageType messageType = MessageType.CHAT;
            Sala sala = salaservice.findByUuid(uuid);
            long timestamp = System.currentTimeMillis();
            
            if(manager.equals("first")) {
                Message message = new Message(timestamp,uuid,"Server","A primeira rodada começou!",currentDate.toString(),messageType);
                messagingTemplate.convertAndSendToUser(uuid,"/server",message);
                sala.setEstado(manager);
                salaservice.updateObject(sala);
            }else if(manager.equals("second")) {
                Message message = new Message(timestamp,uuid,"Server","Uma nova rodada começou!",currentDate.toString(),messageType);
                messagingTemplate.convertAndSendToUser(uuid,"/server",message);
                sala.setEstado(manager);
                salaservice.updateObject(sala);
            }else if (manager.equals("final")) {
                Message message = new Message(timestamp,uuid,"Server","As rodadas acabaram. obrigado a todos!",currentDate.toString(),messageType);
                messagingTemplate.convertAndSendToUser(uuid,"/server",message);
                sala.setEstado(manager);
                salaservice.updateObject(sala);

                return;
            }
            //
            
            if (countdownInfo == null) {
                // contador renovou
                CountdownInfo countdownInfo2 = new CountdownInfo(COUNTDOWN_DURATION,true,uuid);
                countdowns.put(uuid, countdownInfo2);
                            
                ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
                executor.scheduleAtFixedRate(() -> updateCountdown(uuid,produtoId), 0, 1, TimeUnit.SECONDS);
                countdownInfo2.setExecutor(executor); 	
            }else {
                // lançou novo sem contador ter renovado

                countdownInfo.setCurrentCountdown(COUNTDOWN_DURATION);
            }
        }
    }
    
    @MessageMapping("/handlemore30")
    public void handleMore30(@Payload Map<String, Object> data ) {
    	
    	Object uuidValue = data.get("uuid");
    	String uuid = (String) uuidValue;
    	        
        CountdownInfo countdownInfo = countdowns.get(uuid);
        System.out.println(uuid);
        if (countdownInfo != null) {
        	Integer currentTime = countdownInfo.getCurrentCountdown()+30;
        	if(currentTime<=60) {
        		countdownInfo.setCurrentCountdown(countdownInfo.getCurrentCountdown()+30);
        	}else {
        		countdownInfo.setCurrentCountdown(60);
        	}	
        }
        
    }
    
    private void updateCountdown(String room,Integer produtoId) {
        CountdownInfo countdownInfo = countdowns.get(room);
        if (countdownInfo != null) {
            int currentCountdown = countdownInfo.getCurrentCountdown();
            if (currentCountdown >= 0) {
                // Update countdown for the specified room
                countdownInfo.setCurrentCountdown(currentCountdown - 1);
                // Send countdown update to the room
                System.out.println("aqui foi1");
                 messagingTemplate.convertAndSend("/topic/countdown/" + room, currentCountdown);
                 
                 if(currentCountdown == 0) {
                	 System.out.println("aqui foi0");
                	 System.out.println(room);
                	 System.out.println(produtoId);
                	 clienteservice.makeTransaction(produtoId);
                 }
            } else {
            	System.out.println("aqui foi");
            	
                // Countdown finished, shut down executor
            	
            	System.out.println(room);
            	System.out.println(produtoId);
                countdownInfo.getExecutor().shutdown();
                countdowns.remove(room);
                
                // fazer serviços aqui
            }
        }
    }
    

    
    /*
    @MessageMapping("/add30Seconds")
    public void add30Seconds() {
    	service.add30Seconds();
    }
    */
    /*
    @GetMapping("/add30Seconds")
    public ResponseEntity<String> add30Seconds() {
    	service.add30Seconds();
        return ResponseEntity.ok("Added 30 seconds to the countdown.");
    }
    */
    /*
    @GetMapping("/startcountdown")
    public ResponseEntity<String> startCountdown() {
    	service.startCountdown();
        return ResponseEntity.ok("Countdown started.");
    }
	*/

}
