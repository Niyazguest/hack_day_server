package ru.niyaz.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.niyaz.websocket.dto.MessageDTO;
import ru.niyaz.websocket.service.AuthenticationService;


/**
 * Created by user on 16.04.2016.
 */

@Controller
public class MessageController {

    @Autowired
    private AuthenticationService authenticationService;

    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/addMessage")
    public void addStock(MessageDTO messageDTO) throws Exception {

    }

    @Autowired
    public void setSimpMessagingTemplate(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    private void broadcastUpdatedMessages(MessageDTO message) {
        simpMessagingTemplate.convertAndSend("/topic/message", message);
    }

}
