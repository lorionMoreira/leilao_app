package com.nelioalves.cursomc.services;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class CountdownService {
	  private static final int COUNTDOWN_DURATION = 60;
	    private int currentCountdown;
	    private ScheduledExecutorService executor;

	    @Autowired
	    private SimpMessagingTemplate messagingTemplate;

	    public void startCountdown() {
	        currentCountdown = COUNTDOWN_DURATION;
	        executor = Executors.newSingleThreadScheduledExecutor();
	        executor.scheduleAtFixedRate(this::updateCountdown, 0, 1, TimeUnit.SECONDS);
	    }

	    public void resetCountdown() {
	        currentCountdown = COUNTDOWN_DURATION;
	       // messagingTemplate.convertAndSend("/topic/countdown", currentCountdown);
	      //  executor.execute(null);
	    }

	    private void updateCountdown() {
	        if (currentCountdown >= 0) {
	            messagingTemplate.convertAndSend("/topic/countdown", currentCountdown);
	            currentCountdown--;
	        } else {
	            executor.shutdown();
	        }
	    }
}
