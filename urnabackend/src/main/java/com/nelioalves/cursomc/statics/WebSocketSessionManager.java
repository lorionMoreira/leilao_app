package com.nelioalves.cursomc.statics;

import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebSocketSessionManager {
	
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public static void addSession(String sessionId, WebSocketSession session) {
        sessions.put(sessionId, session);
    }

    public static void removeSession(String sessionId) {
        sessions.remove(sessionId);
    }

    public static WebSocketSession getSession(String sessionId) {
        return sessions.get(sessionId);
    }
}
