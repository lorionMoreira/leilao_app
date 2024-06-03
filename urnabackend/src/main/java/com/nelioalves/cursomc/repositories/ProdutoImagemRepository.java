package com.nelioalves.cursomc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nelioalves.cursomc.domain.ProdutoImage;
import org.springframework.transaction.annotation.Transactional;

public interface ProdutoImagemRepository extends JpaRepository<ProdutoImage, Integer>{

	List<ProdutoImage> findByProdutoId(Integer produtoId);
}
