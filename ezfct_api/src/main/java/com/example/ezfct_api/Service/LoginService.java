package com.example.ezfct_api.Service;

import com.example.ezfct_api.Entity.Login;
import com.example.ezfct_api.Repository.LoginRepository;
import com.example.ezfct_api.Security.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {
    @Autowired
    private LoginRepository loginRepository;

    public boolean checkCredentials(String username, String rawPassword) {
        Optional<Login> user = loginRepository.findByUsername(username);
        if (user.isPresent()) {
            try {
                String encryptedInputPassword = AESUtil.encrypt(rawPassword);
                return encryptedInputPassword.equals(user.get().getPassword());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
