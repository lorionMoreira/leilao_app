package com.nelioalves.cursomc.domain;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "salas")
public class Sala implements Serializable {

	private static final long serialVersionUID = 1L;
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String uuid;
    
	@NotEmpty(message="Preenchimento obrigatório")
    private String nome;
	
	
    private String descricao;

    
    @Column(name = "data_criacao")
    private Date dataCriacao;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_abertura")
    private Date dataAbertura;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_fechamento")
    private Date dataFechamento;

    private Integer nmax;
    
    private Integer ncurrent;

    private String estado;

	@ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
	
	@JsonIgnore
    @OneToMany(mappedBy = "sala")
    private List<Produto> produtoList = new ArrayList<>();
    

    // getters and setters

    public Sala() {
		super();
		// TODO Auto-generated constructor stub
	}
    

	public Sala(Integer id, String uuid, @NotEmpty(message = "Preenchimento obrigatório") String nome, String descricao,
			Date dataCriacao, Date dataAbertura, Date dataFechamento, Integer nmax, Integer ncurrent, User user) {
		super();
		this.id = id;
		this.uuid = uuid;
		this.nome = nome;
		this.descricao = descricao;
		this.dataCriacao = dataCriacao;
		this.dataAbertura = dataAbertura;
		this.dataFechamento = dataFechamento;
		this.nmax = nmax;
		this.ncurrent = ncurrent;
		this.user = user;
	}






	public Integer getNcurrent() {
		return ncurrent;
	}


	public void setNcurrent(Integer ncurrent) {
		this.ncurrent = ncurrent;
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
	
	

    public String getDescricao() {
		return descricao;
	}


	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}


	public String getEstado() {
		return estado;
	}


	public void setEstado(String estado) {
		this.estado = estado;
	}


	public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
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

    public Integer getNmax() {
        return nmax;
    }

    public void setNmax(Integer nmax) {
        this.nmax = nmax;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) { 
        this.user = user;
    }


	@Override
	public String toString() {
		return "Sala [id=" + id + ", uuid=" + uuid + ", nome=" + nome + ", dataCriacao=" + dataCriacao
				+ ", dataAbertura=" + dataAbertura + ", dataFechamento=" + dataFechamento + ", nmax=" + nmax
				+ ", ncurrent=" + ncurrent + ", user=" + user + "]";
	}
    
}

