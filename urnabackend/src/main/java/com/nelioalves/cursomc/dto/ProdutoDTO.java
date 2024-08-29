package com.nelioalves.cursomc.dto;

import java.util.Date;

public class ProdutoDTO {
    private Integer id;
    private String nome;
    private Date dataInsercao;
    private Float precoMinimo;
    private Float precoVendido;
    private String descricao;

    // Getters and Setters
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



}
