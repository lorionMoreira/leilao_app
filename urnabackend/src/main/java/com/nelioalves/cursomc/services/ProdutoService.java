package com.nelioalves.cursomc.services;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nelioalves.cursomc.domain.Produto;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.repositories.ProdutoRepository;
import com.nelioalves.cursomc.security.UserSS;
import com.nelioalves.cursomc.services.exceptions.ObjectNotFoundException;

@Service
public class ProdutoService {

	@Autowired
	private ProdutoRepository repo;
	
    @Autowired
    private SalaService salaService;
    
    
	public Produto find(Integer id) {

		Optional<Produto> obj = repo.findById(id);
		
		return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! " ));
	}
	
	public Produto find2(Integer id) {
	    Optional<Produto> obj = repo.findById(id);
	    
	    return obj.orElse(null);
	}
	
    public Produto saveProduct(
    		String nome, 
    		String especificacao,
    		Float valor,
    		Integer salaId
    		) {
    	
    	Produto product = new Produto();
    	
        TimeZone timeZone = TimeZone.getTimeZone("UTC");
        Calendar calendar = Calendar.getInstance(timeZone);

        // Subtract 3 hours from the current date and time
        calendar.add(Calendar.HOUR_OF_DAY, -3);
    	
    	product.setSala(salaService.find(salaId));
    	product.setNome(nome);
    	product.setDataInsercao(calendar.getTime());
    	product.setPrecoMinimo(valor);
    	product.setDescricao(especificacao);
    	
    	return  repo.save(product);


    }
    
    public List<Produto> findProdutosBySalaId(Integer salaId) {
        return repo.findBySalaId(salaId);
    }
    
	@Transactional
	public Produto saveUpdate(Produto obj) {
		obj = repo.save(obj);
		return obj;
	}
	
	public Produto confProduto(Produto obj,User user) {
		
    	Float produtoCusto = obj.getPrecoMinimo();
    	Float mymoney = user.getDinheiro();
    	
    	if(mymoney> produtoCusto) {
    		    		
    		obj.setVendido(1);
    		obj.setPrecoVendido(produtoCusto);
    		obj.setUser(user);
    	}
      
		obj = repo.save(obj);
		return obj;
	}
	
	public Produto confProdutoNewLance(Produto obj,User user,Float novoLance) {
		
    	
    	Float mymoney = user.getDinheiro();
    	
    	if(mymoney> novoLance) {
    		    		// tratar valor para saber se é um numero
    		obj.setVendido(1);
    		obj.setPrecoVendido(novoLance);
    		obj.setUser(user);
    	}
      
		obj = repo.save(obj);
		return obj;
	}
    
}
