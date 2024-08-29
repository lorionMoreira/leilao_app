package com.nelioalves.cursomc.resources;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.nelioalves.cursomc.domain.Sala;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.dto.SalaDTO;
import com.nelioalves.cursomc.resources.utils.GenerateUUID;
import com.nelioalves.cursomc.services.ClienteService;
import com.nelioalves.cursomc.services.SalaService;

import com.nelioalves.cursomc.services.WebSocketUserService;
import com.nelioalves.cursomc.services.exceptions.AuthorizationException;

import org.springframework.context.ApplicationEventPublisher;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.domain.Message;
import com.nelioalves.cursomc.domain.Message.MessageType;

import java.util.Date;
import java.util.Calendar;

@RestController
@RequestMapping(value = "/api/salas")
public class SalaResource {
	
    @Autowired
    private SalaService service;
    
    @Autowired
    private ClienteService clienteservice;

    @Autowired
    private WebSocketUserService websocketuserservice;
    
	 @Autowired
	private SimpMessagingTemplate brokerMessagingTemplate;

 // comunicação via htttps 
    /*
    @PostMapping("/salvar")
    public ResponseEntity<Sala> insert(@Valid @RequestBody SalaDTO objDto) {
    	
    	User user  = clienteservice.findMySelf();
    	
        SalaDTO objDtoComplete = service.insertUuid(objDto);
        Sala obj = service.fromDTO(objDtoComplete);
        
        obj = service.insert(obj);
        return ResponseEntity.ok().body(obj);
    }
   */
    @PostMapping("/salvar")
    public ResponseEntity<Sala> insert(@Valid @RequestBody Sala obj) {
    	
    	User user  = clienteservice.findMySelf();
    	
        String uuidString = GenerateUUID.getUUIDSTRING();
                
        obj.setUuid(uuidString);
        obj.setUser(user);
        
        obj = service.insert(obj);
        return ResponseEntity.ok().body(obj);
    }
    
    @GetMapping("/buscar/mypages")
    public ResponseEntity<Page<Sala>> getEntitiesWithPaginationMyPages(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "2") int pageSize) {
    	
    	User user  = clienteservice.findMySelf();
    	
        Page<Sala> entities = service.findWithConditionsAndPagination(pageNumber, pageSize,user.getId());
        return ResponseEntity.ok().body(entities);
    }
    
    @GetMapping("/buscar/all")
    public ResponseEntity<Page<Sala>> getEntitiesWithPaginationAll(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "2") int pageSize) {
    	
    	
        Page<Sala> entities = service.findWithPagination(pageNumber, pageSize);
        return ResponseEntity.ok().body(entities);
    }

    @DeleteMapping("/delete/{uuid}")
    public ResponseEntity<String> deleteSala(@PathVariable String uuid) {
        try {
            service.deleteByUuid(uuid);
            return ResponseEntity.noContent().build();
        } catch (AuthorizationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @GetMapping("/getbyuuid/{uuid}")
    public ResponseEntity<Sala> getByUUID(@PathVariable String uuid) {
        // Assuming SalaService has a method to fetch SalaDTO by UUID
        Sala sala = service.findByUuid(uuid);

        if (sala  != null) {
            return ResponseEntity.ok(sala);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/teste/{produtoId}")
    public ResponseEntity<Void> getByUUID2(@PathVariable Integer produtoId) {
        // Assuming SalaService has a method to fetch SalaDTO by UUID
    	clienteservice.makeTransaction(produtoId);
    	
    	return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    } 
	
    // comunicação via sockets 
    
    @MessageMapping("/getListLeiloes")
    @SendTo("/topic/salas")
    public List<Sala> receiveMessage(SimpMessageHeaderAccessor headerAccessor){

    	String EventStringName = "getListLeiloes";
    	
    	User user  = websocketuserservice.handleIdentify(headerAccessor, EventStringName);

    	List<Sala> salaList = service.findAll();


        return salaList;
    }
    
    @MessageMapping("/BeLeilaoPart")
    @SendTo("/topic/salas")
    public List<Sala> receiveMessage2(SimpMessageHeaderAccessor headerAccessor,@Payload Map<String, Object> data ){

    	
    	
    	String EventStringName = "BeLeilaoPart";
    	
    	User user  = websocketuserservice.handleIdentify(headerAccessor, EventStringName);
    	
        Object uuidValue = data.get("uuid");

        // Check if the uuidValue is not null and is a String
        if (uuidValue != null && uuidValue instanceof String) {
            String uuid = (String) uuidValue;
            headerAccessor.getSessionAttributes().put("uuid", uuid);
            Sala sala = service.findByUuid(uuid);
            
            if(sala.getNcurrent() == 0) {
            	 throw new RuntimeException("An error occurred.");
            }else {
            	Integer valor = -1;
                Sala obj = service.updateCurrent(sala,valor);
                System.out.println("Received UUID: " + sala);
            }

        } else {
            System.out.println("UUID not found or not a valid String");
        }
        
    	List<Sala> salaList = service.findAll();
        //Page<Sala> entities = service.findWithPagination(pageNumber, pageSize);
       // Map<String, Object> response = new HashMap<>();
       // response.put("productId", "salaList");

        return salaList;
    }
    
    // comes from python 
    
    @GetMapping("/send-message/{uuid}")
    public ResponseEntity<Void> sendMessage(@PathVariable String uuid) {
        // No processing needed for this example
    	String algo = uuid;
    	System.out.println(algo);
    	
    	 Date currentDate = Calendar.getInstance().getTime();
    	 MessageType messageType = MessageType.SERVICE1;
    	 
 	   	long timestamp = System.currentTimeMillis();
    	 
    	Message message = new Message(timestamp,uuid,"Server","O leilão já vai começar!",currentDate.toString(),messageType);
    	brokerMessagingTemplate.convertAndSendToUser(uuid,"/server",message);
        // Return a response with status 200 OK and no response body
        return ResponseEntity.ok().build();
    }
}
