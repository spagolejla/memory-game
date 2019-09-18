package com.comtrade.edit.chat.listener;

import com.comtrade.edit.chat.model.Game;
import com.comtrade.edit.chat.model.Message;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Websocket connected.");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();

        String userCode = (String) (sessionAttributes != null ? sessionAttributes.get("userCode") : null);
        String gameCode = (String) (sessionAttributes != null ? sessionAttributes.get("gameCode") : null);
        
        if (userCode != null) {
            logger.info("User disconnected: " + userCode + gameCode);
            
           Game game = new Game();
           game.setUsername("User disconnected: " + userCode);

           simpMessagingTemplate.convertAndSend("/topic/room"+gameCode, game);
        }
    }
}
