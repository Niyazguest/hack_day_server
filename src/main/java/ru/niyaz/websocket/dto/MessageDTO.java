package ru.niyaz.websocket.dto;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by user on 16.04.2016.
 */
public class MessageDTO implements Serializable {

    private Integer clientID;
    private Integer xy;
    private Integer xz;
    private Integer zy;
    private Integer speed;

    public MessageDTO() {

    }

    public MessageDTO(Integer clientID, Integer xy, Integer xz, Integer zy, Integer speed) {
        this.clientID = clientID;
        this.xy = xy;
        this.xz = xz;
        this.zy = zy;
        this.speed = speed;
    }

    public Integer getClientID() {
        return clientID;
    }

    public void setClientID(Integer clientID) {
        this.clientID = clientID;
    }

    public Integer getXy() {
        return xy;
    }

    public void setXy(Integer xy) {
        this.xy = xy;
    }

    public Integer getXz() {
        return xz;
    }

    public void setXz(Integer xz) {
        this.xz = xz;
    }

    public Integer getZy() {
        return zy;
    }

    public void setZy(Integer zy) {
        this.zy = zy;
    }

    public Integer getSpeed() {
        return speed;
    }

    public void setSpeed(Integer speed) {
        this.speed = speed;
    }
}
