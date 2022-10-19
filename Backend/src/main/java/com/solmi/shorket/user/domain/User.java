package com.solmi.shorket.user.domain;

import com.solmi.shorket.global.BaseTimeEntity;
import com.solmi.shorket.market.domain.Market;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.*;

@Entity
@Getter
@Table(name = "USERS_TB")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer idx;

    @Column(columnDefinition = "VARCHAR(200) NOT NULL")
    private String email;

    @Column(columnDefinition = "TEXT NOT NULL")
    private String password;

    @Column(columnDefinition = "VARCHAR(20) NOT NULL")
    private String name;

    @Column(columnDefinition = "VARCHAR(100) NOT NULL")
    private String nickName;

    @Column(columnDefinition = "TEXT")
    private String profileUrl;

    @Enumerated(value = EnumType.STRING)
    @ColumnDefault("'E'")
    @Column(nullable = false)
    private LoginType loginType;

    @Enumerated(value = EnumType.STRING)
    @ColumnDefault("'I'")
    @Column(nullable = false)
    private RoleType userRole;

    @Enumerated(value = EnumType.STRING)
    @ColumnDefault("'Y'")
    @Column(nullable = false)
    private StatusType statusType;

    @OneToMany(mappedBy = "manager")
    private List<Market> markets = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<MarketInterest> marketInterests = new HashSet<>();

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private Set<BoothInterest> boothInterests = new HashSet<>();

    @Builder
    public User(Integer idx, String email, String password, String name, String nickName, String profileUrl, LoginType loginType, RoleType userRole, StatusType statusType) {
        this.idx = idx;
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickName = nickName;
        this.profileUrl = profileUrl;
        this.loginType = loginType;
        this.userRole = userRole;
        this.statusType = statusType;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> auth = new ArrayList<>();
        auth.add(new SimpleGrantedAuthority(this.getUserRole().toString()));

        return auth;
    }

    @Override
    public String getUsername() {
        return this.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public User updatePassword(String encodedPassword) {
        this.password = encodedPassword;
        return this;
    }

    public User updateUserInfo(String email, String name, String nickName, String profileUrl) {
        this.email = email;
        this.name = name;
        this.nickName = nickName;
        this.profileUrl = profileUrl;
        return this;
    }

    public User deleteUserByStatusType() {
        this.statusType = StatusType.D;
        return this;
    }
}

