package com.example.ezfct_api.Service;

import com.example.ezfct_api.Entity.Login;
import com.example.ezfct_api.Repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegisterService {
    @Autowired
    // vamos a registrar en este caso
    private LoginRepository registerRepository;

    public boolean checkUsers(String username) {
        Optional<Login> user = registerRepository.findByUsername(username);
        return user.isPresent();
    }
}
