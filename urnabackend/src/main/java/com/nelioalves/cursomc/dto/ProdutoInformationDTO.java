package com.nelioalves.cursomc.dto;

import com.nelioalves.cursomc.domain.Sala;

public class ProdutoInformationDTO {
	
    private Sala sala;
    private int productCount;

    public ProdutoInformationDTO(Sala sala, int productCount) {
        this.sala = sala;
        this.productCount = productCount;
    }

	public Sala getSala() {
		return sala;
	}

	public void setSala(Sala sala) {
		this.sala = sala;
	}

	public int getProductCount() {
		return productCount;
	}

	public void setProductCount(int productCount) {
		this.productCount = productCount;
	}
    
    
}
