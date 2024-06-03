package com.nelioalves.cursomc.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.nelioalves.cursomc.domain.Sala;
import com.nelioalves.cursomc.domain.User;

public interface SalaRepository  extends JpaRepository<Sala, Integer> {

	
    @Query("SELECT s FROM Sala s WHERE s.user.id = :userId ORDER BY s.nome")
    Page<Sala> findWithUserAndPagination(@Param("userId") Integer userId,Pageable pageable);
    
	@Transactional(readOnly=true)
	Sala findByUuid(String uuid);
	
    
    @Query("SELECT s FROM Sala s ORDER BY s.nome")
    Page<Sala> findWithPagination(Pageable pageable);
}
