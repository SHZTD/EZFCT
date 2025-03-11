package com.example.ezfct_api.Controller;

import com.example.ezfct_api.Service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<DtoString> checkPw(@RequestParam String user, @RequestParam String password) {
        if (loginService.checkCredentials(user, password)) {
            return ResponseEntity.ok(new DtoString("Login correcto"));
        } else {
            return ResponseEntity.status(401).body(new DtoString("Error, comprueba usuario o contraseña."));
        }
    }
}
