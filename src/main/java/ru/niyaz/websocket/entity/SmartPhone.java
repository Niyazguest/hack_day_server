package ru.niyaz.websocket.entity;

import javax.persistence.*;

/**
 * Created by user on 29.04.2016.
 */

@Entity
@Table(name="smart_phones")
public class SmartPhone {

    @Id
    @SequenceGenerator(name = "smart_phones_seq", sequenceName = "smart_phones_id_seq", allocationSize = 0)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "smart_phones_seq")
    @Column(name = "id")
    private Integer id;

    @Column(name = "smart_phone_id")
    private Integer smartPhoneID;

    public SmartPhone() {
    }

    public SmartPhone(Integer smartPhoneID) {
        this.smartPhoneID = smartPhoneID;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSmartPhoneID() {
        return smartPhoneID;
    }

    public void setSmartPhoneID(Integer smartPhoneID) {
        this.smartPhoneID = smartPhoneID;
    }
}
