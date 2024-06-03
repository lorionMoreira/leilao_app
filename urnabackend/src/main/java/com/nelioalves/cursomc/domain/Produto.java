package com.nelioalves.cursomc.domain;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sala_id")
    private Sala sala;

    private String nome;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_insercao")
    private Date dataInsercao;

    @Column(name = "preco_minimo")
    private Float precoMinimo;

    private Integer vendido;

    @Column(name = "preco_vendido")
    private Float precoVendido;

    private String descricao;

    
	@JsonIgnore
    @OneToMany(mappedBy = "produto")
    private List<ProdutoImage> listImage = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    

    // getters and setters

    public Produto(Integer id, Sala sala, String nome, Date dataInsercao, Float precoMinimo, Integer vendido,
			Float precoVendido, String descricao,  User user) {
		super();
		this.id = id;
		this.sala = sala;
		this.nome = nome;
		this.dataInsercao = dataInsercao;
		this.precoMinimo = precoMinimo;
		this.vendido = vendido;
		this.precoVendido = precoVendido;
		this.descricao = descricao;
		this.user = user;
	}
    

	public Produto() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Date getDataInsercao() {
        return dataInsercao;
    }

    public void setDataInsercao(Date dataInsercao) {
        this.dataInsercao = dataInsercao;
    }

    public Float getPrecoMinimo() {
        return precoMinimo;
    }

    public void setPrecoMinimo(Float precoMinimo) {
        this.precoMinimo = precoMinimo;
    }

    public Integer getVendido() {
        return vendido;
    }

    public void setVendido(Integer vendido) {
        this.vendido = vendido;
    }

    public Float getPrecoVendido() {
        return precoVendido;
    }

    public void setPrecoVendido(Float precoVendido) {
        this.precoVendido = precoVendido;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }



    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

