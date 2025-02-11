package com.example.ezfct_api.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// x-url-encoder (se tiene que mirar)
@CrossOrigin(origins = "*") // CORS (no deberia estar aqui, esta por testing)
@RestController
public class LoginController {
    @GetMapping("/login")
    public ResponseEntity<DtoString> checkPw(@RequestParam String user, @RequestParam String password) {
        if (user.equals("admin") && password.equals("test")) {
            return ResponseEntity.ok(new DtoString("Login correcto"));
        } else {
            return ResponseEntity.status(401).body(new DtoString("Error, comprueba usuario o contraseña."));
        }
    }
}