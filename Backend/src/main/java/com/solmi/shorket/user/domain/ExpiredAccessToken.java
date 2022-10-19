package com.solmi.shorket.user.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@RedisHash("expiredAccessToken")
@AllArgsConstructor
@Builder
public class ExpiredAccessToken {

    @Id
    private String id;

    @Indexed
    private Integer userIdx;

    @TimeToLive
    private Long expiration;

    public static ExpiredAccessToken createExpiredAccessToken(String accessToken, Integer userIdx, Long remainingMilliSeconds) {
        return ExpiredAccessToken.builder()
                .id(accessToken)
                .userIdx(userIdx)
                .expiration(remainingMilliSeconds/1000)
                .build();
    }
}
