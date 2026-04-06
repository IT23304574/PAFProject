package com.smartcampus.ops.auth;

public class LoginResponse {
  public String accessToken;
  public LoginResponse(String accessToken) {
    this.accessToken = accessToken;
  }
}