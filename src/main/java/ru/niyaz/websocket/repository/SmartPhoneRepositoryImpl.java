package ru.niyaz.websocket.repository;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.niyaz.websocket.entity.SmartPhone;

import java.util.List;
import java.util.Set;

/**
 * Created by user on 29.04.2016.
 */

@Repository
public class SmartPhoneRepositoryImpl extends AbstractRepository implements SmartPhoneRepository {

    private Integer clientCount = null;

    @Transactional(propagation = Propagation.SUPPORTS)
    public Integer getClientCount() {
        Session session = getSessionFactory().getCurrentSession();
        Criteria criteria = session.createCriteria(SmartPhone.class);
        clientCount = ((Long) criteria.setProjection(Projections.count("id")).uniqueResult()).intValue();
        return clientCount;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void saveSmartPhone(SmartPhone smartPhone) {
        Session session = getSessionFactory().getCurrentSession();
        session.saveOrUpdate(smartPhone);
    }

    @Transactional(propagation = Propagation.SUPPORTS)
    public List<SmartPhone> getAllSmartPhones() {
        Session session = getSessionFactory().getCurrentSession();
        Criteria criteria = session.createCriteria(SmartPhone.class);
        return (List<SmartPhone>) criteria.list();
    }
}
