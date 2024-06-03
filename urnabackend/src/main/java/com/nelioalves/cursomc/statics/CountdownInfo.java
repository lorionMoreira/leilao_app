package com.nelioalves.cursomc.statics;

import java.util.concurrent.ScheduledExecutorService;

public class CountdownInfo {
	
    private int currentCountdown;
    private boolean initiated = false ;
    private String Room ;
    
    private ScheduledExecutorService executor;
    /*
    public CountdownInfo(int countdownDuration) {
        this.currentCountdown = countdownDuration;
    }
    */
    public CountdownInfo(int currentCountdown, boolean initiated, String room) {
		super();
		this.currentCountdown = currentCountdown;
		this.initiated = initiated;
		this.Room = room;
	}

    public int getCurrentCountdown() {
        return currentCountdown;
    }



	public void setCurrentCountdown(int currentCountdown) {
        this.currentCountdown = currentCountdown;
    }

    public ScheduledExecutorService getExecutor() {
        return executor;
    }

    public void setExecutor(ScheduledExecutorService executor) {
        this.executor = executor;
    }

	public boolean isInitiated() {
		return initiated;
	}

	public void setInitiated(boolean initiated) {
		this.initiated = initiated;
	}

	public String getRoom() {
		return Room;
	}

	public void setRoom(String room) {
		Room = room;
	}
    
}
