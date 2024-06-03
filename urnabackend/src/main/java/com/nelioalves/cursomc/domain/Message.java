package com.nelioalves.cursomc.domain;

import java.util.Date;

public class Message {
	
	private Long id;
	private String roomId;
    private String sender;
	private String message;
	private String time;
	private Float precoAtual;
	
    private MessageType type;

	public Message() {
		super();
		// TODO Auto-generated constructor stub
	}


	
    public Message(Long id, String roomId, String sender, String message, String time, MessageType type) {
		super();
		this.id = id;
		this.roomId = roomId;
		this.sender = sender;
		this.message = message;
		this.time = time;
		this.type = type;
	}



	public enum MessageType {
        CHAT, LEAVE, JOIN, SERVICE1,linicio,lsecundario
    }

    public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}



    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}



	public String getMessage() {
		return message;
	}



	public void setMessage(String message) {
		this.message = message;
	}



	public String getTime() {
		return time;
	}



	public void setTime(String time) {
		this.time = time;
	}



	public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

	public Float getPrecoAtual() {
		return precoAtual;
	}

	public void setPrecoAtual(Float precoAtual) {
		this.precoAtual = precoAtual;
	}



	@Override
	public String toString() {
		return "ChatMessage [id=" + id + ", roomId=" + roomId + ", sender=" + sender + ", message=" + message
				+ ", time=" + time + ", type=" + type + "]";
	}


    
    
}
