package com.nelioalves.cursomc.services;

import java.util.UUID;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.nelioalves.cursomc.domain.Sala;

import com.nelioalves.cursomc.dto.SalaDTO;
import com.nelioalves.cursomc.repositories.SalaRepository;
import com.nelioalves.cursomc.resources.utils.UUIDUtils;
import com.nelioalves.cursomc.services.exceptions.ObjectNotFoundException;

@Service
public class SalaService {

    @Autowired
    private SalaRepository repo;
    
	public Sala find(Integer id) {
		
		Optional<Sala> obj = repo.findById(id);
		return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado! Id: " ));
		
	}
	
    public List<Sala> findAll() {
        return repo.findAll();
    }
	
    public Page<Sala> findWithConditionsAndPagination(int pageNumber, int pageSize,Integer userId) {
        // Create a PageRequest object with pagination parameters
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Sala> result = repo.findWithUserAndPagination(userId,pageRequest);

        return result;
    }
    
    public Page<Sala> findWithPagination(int pageNumber, int pageSize) {
        // Create a PageRequest object with pagination parameters
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Sala> result = repo.findWithPagination(pageRequest);

        return result;
    }
    
	public Sala findByUuid(String uuid) {
		

		Sala obj = repo.findByUuid(uuid);
		if (obj == null) {
			throw new ObjectNotFoundException(
					"Objeto não encontrado!  ");
		}
		return obj;
	}
	
	public Sala updateCurrent(Sala obj, Integer valor) {
		
		Sala newObj = find(obj.getId());
		

		newObj.setNcurrent(newObj.getNcurrent()+ valor);
		
		return repo.save(newObj);
	}
	
	public Sala updateObject(Sala obj) {
		
		return repo.save(obj);
	}
    
    public Sala insert(Sala obj) {
        obj.setId(null);
        // Set the current date/time with the correct time zone (e.g., UTC)
        // Set the current date/time with the correct time zone (e.g., UTC)
        TimeZone timeZone = TimeZone.getTimeZone("UTC");
        Calendar calendar = Calendar.getInstance(timeZone);

        // Subtract 3 hours from the current date and time
        calendar.add(Calendar.HOUR_OF_DAY, -3);

        // Set the adjusted date and time
        obj.setDataCriacao(calendar.getTime());
        obj.setNcurrent(obj.getNmax());
        obj.setEstado("inicio");
        return repo.save(obj);
    }
    /*
    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent event) {
        //log.warn("Client with username {} disconnected", event.getUser().getName());
        // Perform any other actions you need upon disconnection
        System.out.println(event);
    }
    */
}
    


