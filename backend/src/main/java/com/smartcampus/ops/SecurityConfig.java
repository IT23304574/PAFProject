package com.smartcampus.ops;

import com.smartcampus.ops.auth.UserRepository;
<<<<<<< HEAD
import com.smartcampus.ops.auth.HeaderAuthenticationFilter;
=======
>>>>>>> origin/main
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;
<<<<<<< HEAD
    private final HeaderAuthenticationFilter headerAuthenticationFilter;

    public SecurityConfig(UserRepository userRepository, HeaderAuthenticationFilter headerAuthenticationFilter) {
        this.userRepository = userRepository;
        this.headerAuthenticationFilter = headerAuthenticationFilter;
=======

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
>>>>>>> origin/main
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
<<<<<<< HEAD
            .csrf(c -> c.disable())
            .cors(c -> c.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
=======
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/ticket/**").permitAll()
>>>>>>> origin/main
                .requestMatchers("/api/facilities/**").permitAll()
                .requestMatchers("/api/bookings/**").permitAll()
                .requestMatchers("/api/resources/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()
<<<<<<< HEAD
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/ticket/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(headerAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
=======
                .anyRequest().authenticated()
            );
>>>>>>> origin/main
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
            .map(user -> new org.springframework.security.core.userdetails.User(
                user.getUsername(),
<<<<<<< HEAD
                user.getPassword() != null ? user.getPassword() : "",
=======
                user.getPassword(),
>>>>>>> origin/main
                List.of(new SimpleGrantedAuthority(user.getRole()))
            ))
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
<<<<<<< HEAD
    public AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception {
        return c.getAuthenticationManager();
=======
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
>>>>>>> origin/main
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
<<<<<<< HEAD
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "https://*.devtunnels.ms"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
=======
        config.setAllowedOrigins(List.of(
            "http://localhost:4200",
            "https://gj8jgv5s-8080.asse.devtunnels.ms"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

>>>>>>> origin/main
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}