package com.example.ezfct.Security;

import com.example.ezfct.Model.Enums.Rol;
import io.jsonwebtoken.*;
import java.util.Date;

public class JwtUtil {
    private final String SECRET_KEY;
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    public JwtUtil(String secretKey){
        this.SECRET_KEY = secretKey;
    }

    public String getSECRET_KEY() {
        return SECRET_KEY;
    }

    // por email + claim de rol
    public String generateToken(String email, Rol rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }


    public String extractEmail(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token).getBody().getSubject();
    }

    public String extractRol(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .get("rol", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
