package com.nelioalves.cursomc.services;

import java.awt.image.BufferedImage;
import java.net.URI;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.nelioalves.cursomc.domain.Produto;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.domain.enums.Perfil;
import com.nelioalves.cursomc.domain.enums.TipoCliente;
import com.nelioalves.cursomc.dto.ClienteDTO;
import com.nelioalves.cursomc.dto.ClienteNewDTO;
import com.nelioalves.cursomc.repositories.ClienteRepository;
import com.nelioalves.cursomc.security.UserSS;
import com.nelioalves.cursomc.services.exceptions.AuthorizationException;
import com.nelioalves.cursomc.services.exceptions.DataIntegrityException;
import com.nelioalves.cursomc.services.exceptions.ObjectNotFoundException;

@Service
public class ClienteService {

	@Autowired
	private ClienteRepository repo;
	
	@Autowired
	private ProdutoService produtoservice;

	@Autowired
	private BCryptPasswordEncoder pe;


	@Value("${img.prefix.client.profile}")
	private String prefix;

	@Value("${img.profile.size}")
	private Integer size;

	public User find(Integer id) {

		UserSS user = UserService.authenticated();
		/*
		if (user == null || !user.hasRole(Perfil.ADMIN) && !id.equals(user.getId())) {
			throw new AuthorizationException("Acesso negado");
		}
		*/
		Optional<User> obj = repo.findById(id);
		return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + User.class.getName()));
	}
	
    public Float getUserMoney(Integer userId) {
        User user = repo.findById(userId).orElse(null);
        if (user != null) {
            return user.getDinheiro();
        }
        return null; // Or handle the case when the user is not found
    }
    
    public User debitOnClient(Produto produto,User mySelf) {
    	
    	Float ProdutoCusto = produto.getPrecoMinimo();
    	Float mymoney = mySelf.getDinheiro();
    	
        if(mymoney> ProdutoCusto) {
        	mySelf.setDinheiro(mymoney-ProdutoCusto);
        	User mySelfPoor= this.saveUpdate(mySelf);
        	
        	return mySelfPoor;
        }else {
        	throw new RuntimeException("Salario menor que o valor do produto");
        }
        
         // Or handle the case when the user is not found
    }

	@Transactional
	public User insert(User obj) {
		obj.setId(null);
		obj = repo.save(obj);
		return obj;
	}
	
	@Transactional
	public User saveUpdate(User obj) {
		obj = repo.save(obj);
		return obj;
	}
	
	public User updateSession(User obj,String session) {
		User newObj = find(obj.getId());
		
		newObj.setSession(session);
		newObj.setHashsocket(null);
		newObj.setSession_ev(null);
		
		return repo.save(newObj);
	}
	public User updateEvent(User obj,String eventString) {
		User newObj = find(obj.getId());
		
		newObj.setSession_ev(eventString);

		return repo.save(newObj);
	}

	public User update(User obj) {
		User newObj = find(obj.getId());
		updateData(newObj, obj);
		return repo.save(newObj);
	}
	
	public User updatehash(User obj) {
		User newObj = find(obj.getId());
		updateDataHash(newObj, obj);
		return repo.save(newObj);
	}

	public void delete(Integer id) {
		find(id);
		try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException("Não é possível excluir porque há pedidos relacionados");
		}
	}

	public List<User> findAll() {
		UserSS user = UserService.authenticated();
		Integer myId = user.getId();
		
		return repo.findAll();
	}
	public User findMySelf() {
		UserSS user = UserService.authenticated();
		Integer myId = user.getId();
		User usuario =this.find(myId);
		return usuario;
	}
	/*
	public User getLoggedInUser() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String username = authentication.getName();
	    return service.findByUsername(username);
	}
*/
	public UserSS myself() {
		UserSS user = UserService.authenticated();
		

		return user;
	}

	public User findByEmail(String email) {
		UserSS user = UserService.authenticated();
		if (user == null || !user.hasRole(Perfil.ADMIN) && !email.equals(user.getUsername())) {
			throw new AuthorizationException("Acesso negado");
		}

		User obj = repo.findByEmail(email);
		if (obj == null) {
			throw new ObjectNotFoundException(
					"Objeto não encontrado! Id: " + user.getId() + ", Tipo: " + User.class.getName());
		}
		return obj;
	}
	
	public User findByToken(String token) {
		
		User obj = repo.findByHashsocket(token);

		return obj;
	}
	
	public User findBySession(String sessionId) {
		
		User obj = repo.findBySession(sessionId);

		return obj;
	}
	
	public User findByEmailByJWT(String email) {
		User obj = repo.findByEmail(email);
		if (obj == null) {
			throw new ObjectNotFoundException(
					"Objeto não encontrado! Id: " );
		}
		return obj;
	}

	public List<User> findAllOrderedByUser(User loggedInUser) {
	    List<User> userList = repo.findAll();
	    userList.sort(Comparator.comparing(user -> user.equals(loggedInUser) ? 0 : 1)); // Logged-in user first
	    return userList;
	}
	
	public Page<User> findPage(Integer page, Integer linesPerPage, String orderBy, String direction,Integer loggedId) {
		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		return repo.findOrderedByName(loggedId, pageRequest);
	}

	public User fromDTO(ClienteDTO objDto) {
		return new User(null, objDto.getNome(), objDto.getEmail(), 
				TipoCliente.toEnum(objDto.getTipo()), pe.encode(objDto.getSenha()),objDto.getIsAdmin());
	}

	public User fromDTO(ClienteNewDTO objDto) {
		User cli = new User(null, objDto.getNome(), objDto.getEmail(), 
				TipoCliente.toEnum(objDto.getTipo()), pe.encode(objDto.getSenha()),objDto.getIsAdmin());

		return cli;
	}

	private void updateData(User newObj, User obj) {
		newObj.setNome(obj.getNome());
		newObj.setEmail(obj.getEmail());
	}
	
	private void updateDataHash(User newObj, User obj) {
		newObj.setHashsocket(obj.getHashsocket());
	}
	public String hashWithSHA256(String input) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(input);
    }
	
	public User makeTransaction(Integer produtoId) {
		Produto produto  = produtoservice.find2(produtoId);
		
		if (produto != null && produto.getVendido() != null &&  produto.getVendido() == 1) {
			User theUser= this.find(produto.getUser().getId());
			
			theUser.setDinheiro(theUser.getDinheiro()-produto.getPrecoVendido());
			User mySelfPoor= this.saveUpdate(theUser);
			
			
			return mySelfPoor;
		}else {
			return null;
		}

	}
	/*

	public URI uploadProfilePicture(MultipartFile multipartFile) {
		UserSS user = UserService.authenticated();
		if (user == null) {
			throw new AuthorizationException("Acesso negado");
		}

		BufferedImage jpgImage = imageService.getJpgImageFromFile(multipartFile);
		jpgImage = imageService.cropSquare(jpgImage);
		jpgImage = imageService.resize(jpgImage, size);

		String fileName = prefix + user.getId() + ".jpg";

		return s3Service.uploadFile(imageService.getInputStream(jpgImage, "jpg"), fileName, "image");
	}
	*/
}
