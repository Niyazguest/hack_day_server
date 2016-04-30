package ru.niyaz.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.thymeleaf.context.WebContext;
import ru.niyaz.websocket.dto.MessageDTO;
import ru.niyaz.websocket.service.AuthenticationService;
import ru.niyaz.websocket.util.ThymeleafTemplateUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by user on 18.04.2016.
 */

@Controller
public class MainController {

    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public void get3D(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("text/html;charset=UTF-8");
            WebContext webContext = new WebContext(request, response, request.getSession().getServletContext());
            ThymeleafTemplateUtil.getTemplateEngine().process("index", webContext, response.getWriter());
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /* For Android */
    @RequestMapping(value = "/angles", method = RequestMethod.POST)
    public void angles(@RequestParam(value = "xy", required = false) Integer xy,
                       @RequestParam(value = "xz", required = false) Integer xz,
                       @RequestParam(value = "zy", required = false) Integer zy,
                       @RequestParam(value = "speed", required = false) Integer speed,
                       HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("text/html;charset=UTF-8");
            response.setStatus(200);
            MessageDTO messageDTO = new MessageDTO(0, xy, xz, zy, speed);
            broadcastUpdatedMessages(messageDTO);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /* For Android */
    @RequestMapping(value = "/reg", method = RequestMethod.GET)
    public void registration(HttpServletRequest request, HttpServletResponse response) {
        try {
            Integer clientID = authenticationService.registrationSmartPhone();
            response.setHeader("id", clientID.toString());
            response.setStatus(200);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Autowired
    public void setSimpMessagingTemplate(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    /* Send to client browser */
    private void broadcastUpdatedMessages(MessageDTO message) {
        simpMessagingTemplate.convertAndSend("/topic/message", message);
    }

}
