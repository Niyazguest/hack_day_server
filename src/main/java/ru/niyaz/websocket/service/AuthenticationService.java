package ru.niyaz.websocket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.niyaz.websocket.entity.SmartPhone;
import ru.niyaz.websocket.repository.SmartPhoneRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by user on 20.04.2016.
 */

@Service
public class AuthenticationService {

    @Autowired
    private SmartPhoneRepository smartPhoneRepository;

    @Transactional(propagation = Propagation.REQUIRED)
    public Integer registrationSmartPhone() {
        try {
            Integer id = smartPhoneRepository.getClientCount();
            SmartPhone smartPhone = new SmartPhone(id);
            smartPhoneRepository.saveSmartPhone(smartPhone);
            return id;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public List<Integer> getAllSmartPhoneIDs() {
        List<SmartPhone> smartPhones = smartPhoneRepository.getAllSmartPhones();
        List<Integer> smartPhoneIds = new ArrayList<Integer>();
        for(SmartPhone smartPhone : smartPhones)
            smartPhoneIds.add(smartPhone.getSmartPhoneID());
        return smartPhoneIds;
    }

    private Collection<? extends GrantedAuthority> getUserAutorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authorities;
    }

}
