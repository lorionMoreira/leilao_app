package com.nelioalves.cursomc.mapper;

import org.springframework.stereotype.Component;

import com.nelioalves.cursomc.domain.Produto;
import com.nelioalves.cursomc.dto.ProdutoDTO;

@Component
public class ProdutoMapper {

    public ProdutoDTO convertToDto(Produto produto) {
        ProdutoDTO dto = new ProdutoDTO();

        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setDataInsercao(produto.getDataInsercao());
        dto.setPrecoMinimo(produto.getPrecoMinimo());
        dto.setPrecoVendido(produto.getPrecoVendido());
        dto.setDescricao(produto.getDescricao());
        
        return dto;
    }

}
