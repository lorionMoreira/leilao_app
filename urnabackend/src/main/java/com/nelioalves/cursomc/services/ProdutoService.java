package com.nelioalves.cursomc.services;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nelioalves.cursomc.domain.Produto;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.dto.ProdutoDTO;
import com.nelioalves.cursomc.mapper.ProdutoMapper;
import com.nelioalves.cursomc.repositories.ProdutoRepository;
import com.nelioalves.cursomc.security.UserSS;
import com.nelioalves.cursomc.services.exceptions.AuthorizationException;
import com.nelioalves.cursomc.services.exceptions.ObjectNotFoundException;

@Service
public class ProdutoService {

	@Autowired
	private ProdutoRepository repo;
	
    @Autowired
    private SalaService salaService;

	@Autowired
    private ClienteService clienteService;

	@Autowired
    private ProdutoMapper produtoMapper;
    
    
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
    
    public List<ProdutoDTO> findProdutosBySalaId2(Integer salaId) {
        List<Produto> produtos = repo.findBySalaId(salaId);
		return produtos.stream().map(produtoMapper::convertToDto).collect(Collectors.toList());
    }
    
	@Transactional
	public Produto saveUpdate(Produto obj) {
		obj = repo.save(obj);
		return obj;
	}

	@Transactional
    public void deleteById(Integer id) {

        Produto produto = find(id);

        User user = clienteService.findMySelf();
        if (!produto.getUser().equals(user)) {
            throw new AuthorizationException("You are not authorized to delete this Produto.");
        }

        try {
            repo.delete(produto);
        } catch (Exception e) {
            throw new AuthorizationException("An error occurred while trying to delete the Produto.", e);
        }
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
