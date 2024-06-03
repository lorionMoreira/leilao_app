package com.nelioalves.cursomc.dto;

import java.io.Serializable;
import java.util.Date;



import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

public class SalaDTO implements Serializable {
	
    private static final long serialVersionUID = 1L;
    
    private Integer id;
    
    private String uuid;
    
	@NotEmpty(message="Preenchimento obrigatório")
    private String nome;
	
	@NotNull(message = "The validade field must not be null")
	@JsonFormat(pattern = "dd/MM/yyyy")
    private Date dataCriacao;

	@NotNull(message = "The validade field must not be null")
	@JsonFormat(pattern = "dd/MM/yyyy")
    private Date dataAbertura;

	@NotNull(message = "The validade field must not be null")
	@JsonFormat(pattern = "dd/MM/yyyy")
    private Date dataFechamento;

    private Boolean ativa;

	public SalaDTO() {
		super();
		// TODO Auto-generated constructor stub
	}



	public String getUuid() {
		return uuid;
	}



	public void setUuid(String uuid) {
		this.uuid = uuid;
	}



	public SalaDTO(Integer id, String uuid, @NotEmpty(message = "Preenchimento obrigatório") String nome,
			@NotNull(message = "The validade field must not be null") Date dataCriacao,
			@NotNull(message = "The validade field must not be null") Date dataAbertura,
			@NotNull(message = "The validade field must not be null") Date dataFechamento, Boolean ativa) {
		super();
		this.id = id;
		this.uuid = uuid;
		this.nome = nome;
		this.dataCriacao = dataCriacao;
		this.dataAbertura = dataAbertura;
		this.dataFechamento = dataFechamento;
		this.ativa = ativa;
	}



	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Date getDataCriacao() {
		return dataCriacao;
	}

	public void setDataCriacao(Date dataCriacao) {
		this.dataCriacao = dataCriacao;
	}

	public Date getDataAbertura() {
		return dataAbertura;
	}

	public void setDataAbertura(Date dataAbertura) {
		this.dataAbertura = dataAbertura;
	}

	public Date getDataFechamento() {
		return dataFechamento;
	}

	public void setDataFechamento(Date dataFechamento) {
		this.dataFechamento = dataFechamento;
	}

	public Boolean getAtiva() {
		return ativa;
	}

	public void setAtiva(Boolean ativa) {
		this.ativa = ativa;
	}
    
    

}
