package com.example.ezfct_api.Controller;

import com.example.ezfct_api.Service.LoginService;
import com.example.ezfct_api.Service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class LRController {
    @Autowired // dale el trabajo a springboot de incluir todo
    private LoginService loginService;
    private RegisterService registerService;

    @PostMapping("/login")
    public ResponseEntity<DtoString> checkPw(@RequestParam String user, @RequestParam String password) {
        if (loginService.checkCredentials(user, password)) {
            return ResponseEntity.ok(new DtoString("Login correcto"));
        } else {
            return ResponseEntity.status(401).body(new DtoString("Error, comprueba usuario o contraseña."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<DtoString> registerUser(@RequestParam String user, @RequestParam String password, @RequestParam String againPassword) {
        if (registerService.checkUsers(user)) {
            return ResponseEntity.ok(new DtoString("User already exists"));
        } else {
            return ResponseEntity.status(401).body(new DtoString("User does not exist"));
        }
    }
}
