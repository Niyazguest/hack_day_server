package ru.niyaz.websocket.repository;

import ru.niyaz.websocket.entity.SmartPhone;

import java.util.List;
import java.util.Set;

/**
 * Created by user on 29.04.2016.
 */
public interface SmartPhoneRepository {
    Integer getClientCount();
    void saveSmartPhone(SmartPhone smartPhone);
    List<SmartPhone> getAllSmartPhones();
}
