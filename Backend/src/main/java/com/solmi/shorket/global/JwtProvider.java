package com.solmi.shorket.global;

import com.solmi.shorket.global.exception.UserRoleNotFoundCException;
import com.solmi.shorket.user.domain.RoleType;
import com.solmi.shorket.user.dto.UserTokenDto;
import com.solmi.shorket.user.repository.ExpiredAccessTokenRedisRepository;
import com.solmi.shorket.user.service.CustomUserDetailsService;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.Base64;
import java.util.Date;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtProvider {

    @Value("spring.jwt.secret")
    private String secretKey;

    private final Long accessTokenValidMillisecond = 60 * 60 * 1000L; // 1 hour
    private final Long refreshTokenValidMillisecond = 3 * 24 * 60 * 60 * 1000L; // 3 Day

    private final CustomUserDetailsService userDetailsService;
    private final ExpiredAccessTokenRedisRepository logoutAccessTokenRedisRepository;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public UserTokenDto createToken(Integer userIdx, RoleType roles) {
        Claims claims = Jwts.claims().setSubject(String.valueOf(userIdx));
        claims.put("roles", roles);

        Date now = new Date();

        String accessToken = Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + accessTokenValidMillisecond))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();

        String refreshToken = Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setExpiration(new Date(now.getTime() + refreshTokenValidMillisecond))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();

        return UserTokenDto.builder()
                .grantType("bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpireDate(accessTokenValidMillisecond)
                .build();
    }

    public Authentication getAuthentication(String token) {

        Claims claims = parseClaims(token);

        // 권한이 없는 경우
        if (claims.get("roles") == null) {
            throw new UserRoleNotFoundCException();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUserIdx(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    public String getUserIdx(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("X-AUTH-TOKEN");
    }

    public boolean validationToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return !claimsJws.getBody().getExpiration().before(new Date());
        } catch (SecurityException | MalformedJwtException e) {
            log.error("Jwt 서명이 올바르지 않습니다.");
        } catch (ExpiredJwtException e) {
            log.error("만료된 accessToken 입니다.");
        } catch (UnsupportedJwtException e) {
            log.error("지원하지 않는 accessToken 입니다.");
        } catch (IllegalArgumentException e) {
            log.error("잘못된 accessToken 입니다.");
        }
        return false;
    }

    public boolean authValidationToken(HttpServletRequest request, String token) {
        // if accessToken is in blacklist, then refuse the request.
        if (logoutAccessTokenRedisRepository.findById(token).isPresent()) {
            log.error("폐기된 accessToken 입니다.");
            request.setAttribute("exception", "expiredJwt");
            return false;
        }

        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return !claimsJws.getBody().getExpiration().before(new Date());
        } catch (SecurityException | MalformedJwtException | SignatureException e) {
            log.error("Jwt 서명이 올바르지 않습니다.");
            request.setAttribute("exception", "incorrectJwtSign");
        } catch (ExpiredJwtException e) {
            log.error("만료된 accessToken 입니다.");
            request.setAttribute("exception", "expiredJwt");
        } catch (UnsupportedJwtException e) {
            log.error("지원하지 않는 accessToken 입니다.");
            request.setAttribute("exception", "unsupportedJwt");
        } catch (IllegalArgumentException e) {
            log.error("잘못된 accessToken 입니다.");
            request.setAttribute("exception", "illegalArgumentJwt");
        }
        return false;
    }

    public Long getExpirationTime(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            Date exp = claimsJws.getBody().getExpiration();
            Date now = new Date();

            return exp.getTime() - now.getTime();
        } catch (JwtException | IllegalArgumentException e) {
            log.error(e.toString());
            return accessTokenValidMillisecond;
        }
    }
}
