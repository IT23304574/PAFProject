package com.smartcampus.ops.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ Strong secret key (must be at least 32 chars for HS256)
    private final Key SECRET_KEY = Keys.hmacShaKeyFor(
            "mysecretkeymysecretkeymysecretkey".getBytes()
    );

    // ✅ Generate JWT Token with role
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // ✅ explicitly define algorithm
                .compact();
    }

    // ✅ Extract username
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ Extract role
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // ✅ Validate token
    public boolean validateToken(String token) {
        return getClaims(token).getExpiration().after(new Date());
    }

    // ✅ Get all claims
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}