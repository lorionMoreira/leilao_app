package com.nelioalves.cursomc.resources;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;

import com.nelioalves.cursomc.domain.Message;
import com.nelioalves.cursomc.domain.Produto;
import com.nelioalves.cursomc.domain.Sala;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.domain.Message.MessageType;
import com.nelioalves.cursomc.dto.ProdutoDTO;
import com.nelioalves.cursomc.dto.ProdutoInformationDTO;
import com.nelioalves.cursomc.services.ProdutoService;
import com.nelioalves.cursomc.services.SalaService;
import com.nelioalves.cursomc.services.exceptions.AuthorizationException;
import com.nelioalves.cursomc.services.ClienteService;
import com.nelioalves.cursomc.services.ProdutoImagemService;

@RestController
@RequestMapping(value = "/api/produtos")
public class ProdutoResource {

    @Autowired
    private ProdutoService service;
    
    @Autowired
    private SalaService salaservice;
    
    @Autowired
    private ProdutoImagemService imageService;
    
    @Autowired
    private ClienteService clienteservice;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
     
    
    @RequestMapping(value = "/salvar2/{salaId}", method = RequestMethod.POST)
    public ResponseEntity<Void> insert2(
    		@RequestParam("nome") String nome,
            @RequestParam("especificacao") String especificacao,
            @RequestParam("valor") Float valor,
            @RequestParam("file") MultipartFile file,
            @PathVariable Integer salaId
    		) {
    	

			String originalName = file.getOriginalFilename();
			String name = file.getName();
			String contentType = file.getContentType();
			long size = file.getSize();
			
	        // Log the variables to the console using System.out.println
	        System.out.println("Original Name: " + originalName);
	        System.out.println("Name: " + name);
	        System.out.println("Content Type: " + contentType);
	        System.out.println("Size: " + size);
	        System.out.println("Salaid: " + salaId);
    	
    	Produto produtoSaved = service.saveProduct(nome,especificacao,valor,salaId);
    	
    	imageService.saveImage(file,produtoSaved);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    
    @GetMapping("/getbysalauuid/{uuid}/{currentFecthProducts}")
    public ResponseEntity<Produto> getByUUID(@PathVariable String uuid, @PathVariable int currentFecthProducts) {
        // Assuming SalaService has a method to fetch SalaDTO by UUID
        Sala sala = salaservice.findByUuid(uuid);

        if (sala  != null) {
           List<Produto> entities = service.findProdutosBySalaId(sala.getId());
           
           // verificar se produto já foi vendido 
           try {
        	   Produto Produto = entities.get(currentFecthProducts);
        	   return ResponseEntity.ok().body(Produto);
        	} catch (IndexOutOfBoundsException e) {
        		throw new RuntimeException("Sala not found for UUID: " + uuid);
        	}
                
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getbysalauuid2/{uuid}")
    public ResponseEntity<List<ProdutoDTO>> getByUUID2(@PathVariable String uuid) {
        // Assuming SalaService has a method to fetch SalaDTO by UUID
        Sala sala = salaservice.findByUuid(uuid);

        if (sala  != null) {
           List<ProdutoDTO> entities = service.findProdutosBySalaId2(sala.getId());
           return ResponseEntity.ok().body(entities);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduto(@PathVariable Integer id) {
        try {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (AuthorizationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @GetMapping("/information/{uuid}")
    public ResponseEntity<ProdutoInformationDTO> getProdutoInformation(@PathVariable String uuid) {
    	Sala sala = salaservice.findByUuid(uuid);
        if (sala == null) {
        	 throw new RuntimeException("Sala not found for UUID: " + uuid);
        }

        List<Produto> entities = service.findProdutosBySalaId(sala.getId());
        int productCount = entities.size();

        ProdutoInformationDTO produtoInformationDTO = new ProdutoInformationDTO(sala, productCount);

        return ResponseEntity.ok(produtoInformationDTO);
    }
    
    @PostMapping("/lanceinicial")
    public ResponseEntity<Void> handleLanceInicialRequest(@RequestBody Map<String, Object> requestMap) {
        String salaRoom = requestMap.get("salaRoom").toString();
        Integer produtoId = Integer.parseInt(requestMap.get("produtoId").toString());
        
        
        // verificar se produto é realmente da salaRoom 
        
        // verificar se o produto já foi dado lance inicial
        
        Produto produto = service.find(produtoId);
        User mySelf = clienteservice.findMySelf();
        
        String nome = mySelf.getNome();
        //  User mySelfPoor= clienteservice.debitOnClient(produto,mySelf);
        
        Produto prodSellFirstTime= service.confProduto(produto,mySelf);
        
        Float lanceInicial = prodSellFirstTime.getPrecoVendido();
        
	     // colocar isso em um serviço de mensagem
	   	 Date currentDate = Calendar.getInstance().getTime();
	   	 MessageType messageType = MessageType.linicio;
   	 
	   	long timestamp = System.currentTimeMillis();
	   		// separar serviço de mensagens de outros serviços
	   	 Message message = new Message(timestamp,salaRoom,"Server","O lance inicial foi dado por:"+nome,currentDate.toString(),messageType);
	   	 message.setPrecoAtual(lanceInicial);
	   	 messagingTemplate.convertAndSendToUser(salaRoom,"/server",message);
	   	 System.out.println(salaRoom);
        
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    
    @PostMapping("/cobrirlance")
    public ResponseEntity<Void> handleCobrirLanceRequest(@RequestBody Map<String, Object> requestMap) {
        String salaRoom = requestMap.get("salaRoom").toString();
        Integer produtoId = Integer.parseInt(requestMap.get("produtoId").toString());
        Float novoLance = Float.parseFloat(requestMap.get("novolance").toString());
        
        
        // verificar se produto é realmente da salaRoom 
        
        // verificar se o produto já foi dado lance inicial
        
        Produto produto = service.find(produtoId);
        User mySelf = clienteservice.findMySelf();
        
        String nome = mySelf.getNome();
        //  User mySelfPoor= clienteservice.debitOnClient(produto,mySelf);
        
        Produto prodSellFirstTime= service.confProdutoNewLance(produto,mySelf,novoLance);
        
        Float lanceCoberto = prodSellFirstTime.getPrecoVendido();
        
	     // colocar isso em um serviço de mensagem
	   	 Date currentDate = Calendar.getInstance().getTime();
	   	 MessageType messageType = MessageType.lsecundario;
   	 
	   	long timestamp = System.currentTimeMillis();
	   		// separar serviço de mensagens de outros serviços
	   	 Message message = new Message(timestamp,salaRoom,"Server",nome+" cobriu o lance dado. quem dá mais!",currentDate.toString(),messageType);
	   	 message.setPrecoAtual(lanceCoberto);
	   	 messagingTemplate.convertAndSendToUser(salaRoom,"/server",message);
	   	 System.out.println(salaRoom);
        
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    		
}



    

