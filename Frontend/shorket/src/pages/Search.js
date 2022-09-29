import React, { useState, useEffect, memo } from "react";

import axios from "../api/axios";
import { Link } from "react-router-dom";

import styles from "./Search.module.css";
import {
    InputLabel,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControl,
    Box,
    Radio,
    RadioGroup,
    Checkbox,
    FormControlLabel,
    FormLabel,
    Button,
} from "@mui/material/";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import MarketList from "../components/MarketList.js";

// 마켓 정렬
const sortOptionList = [
    { value: "INTEREST", name: "인기순" },
    { value: "DICT", name: "가나다순" },
    { value: "LATEST", name: "최신순" },
    { value: "VIEW", name: "조회순" },
];

// 기간 필터
const stateOptionList = [
    { value: "UPCOMING", name: "진행 예정" },
    { value: "CURRENT", name: "진행중" },
    { value: "COMPLETE", name: "종료" },
];

// 지역 필터
const localeOptionList = [
    { value: 1, name: "서울특별시", nickname: "서울", temp: "서울시" },
    { value: 2, name: "부산광역시", nickname: "부산", temp: "부산시" },
    { value: 3, name: "대구광역시", nickname: "대구", temp: "대구시" },
    { value: 4, name: "인천광역시", nickname: "인천", temp: "인천시" },
    { value: 5, name: "광주광역시", nickname: "광주", temp: "광주시" },
    { value: 6, name: "대전광역시", nickname: "대전", temp: "대전시" },
    { value: 7, name: "울산광역시", nickname: "울산", temp: "울산시" },
    { value: 8, name: "세종특별자치시", nickname: "세종", temp: "세종시" },
    { value: 9, name: "경기도", nickname: "경기", temp: "경기도" },
    { value: 10, name: "강원도", nickname: "강원", temp: "강원도" },
    { value: 11, name: "충청북도", nickname: "충북", temp: "충청도" },
    { value: 12, name: "충청남도", nickname: "충남", temp: "충청도" },
    { value: 13, name: "전라북도", nickname: "전북", temp: "전라도" },
    { value: 14, name: "전라남도", nickname: "전남", temp: "전라도" },
    { value: 15, name: "경상북도", nickname: "경북", temp: "경상도" },
    { value: 16, name: "경상남도", nickname: "경남", temp: "경상도" },
    { value: 17, name: "제주특별자치도", nickname: "제주", temp: "제주도" },
];

const Search = () => {
    const [sortOption, setSortOption] = useState("LATEST");
    const [dateOption, setDateOption] = useState("CURRENT");
    const [localeOption, setLocaleOption] = useState([]);

    const [searchWord, setSearchWord] = useState(
        `sort=LATEST&date=CURRENT&page=0`
    );

    const [searchResult, setSearchResult] = useState([]);

    const [isSearch, setIsSearch] = useState(false);

    // handle
    const handleSortOptionChange = (event) => {
        setSortOption(event.target.value);
        console.log(sortOption);
    };

    const handleDateOptionChange = (event) => {
        setDateOption(event.target.value);
        console.log(dateOption);
    };

    const handleSingleLocaleOptionChange = (checked, value) => {
        if (checked) {
            setLocaleOption((prev) => [...prev, value]);
        } else {
            setLocaleOption((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleAllLocaleOptionChange = (checked) => {
        if (checked) {
            const valueArray = [];
            localeOptionList.map((item) => {
                valueArray.push(item.value);
            });
            setLocaleOption(valueArray);
        } else {
            setLocaleOption([]);
        }
    };

    const handleSearchWordChange = (event) => {
        setSearchWord(event.target.value);
        console.log(searchWord);
    };

    const handleSearch = () => {
        axios
            .get(`/markets?${searchWord}`)
            .then((res) => {
                // console.log(res.data.markets);

                const getData = res.data.markets.map((it) => {
                    const startDate = new Date(it.startDate);
                    const endDate = new Date(it.endDate);

                    let period = `${startDate.getFullYear()}.${
                        startDate.getMonth() + 1
                    }.${startDate.getDate()}`;
                    period += ` ~ ${endDate.getFullYear()}.${
                        endDate.getMonth() + 1
                    }.${endDate.getDate()}`;

                    return {
                        id: it.marketIdx,
                        img: it.thumbnailImage,
                        url: "https://www.instagram.com/p/CgoeXAELGQl/",
                        name: it.name,
                        location: `${it.address.sido} ${it.address.sigungu}`,
                        detail: it.address.detailAddress,
                        time: `${it.openTime.slice(
                            0,
                            5
                        )} ~ ${it.closeTime.slice(0, 5)}`,
                        period: period,
                        like: it.interestCount,
                        view: it.viewCount,
                    };
                });
                // console.log(getData);

                setSearchResult(getData);
                setIsSearch(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [sortOption]);

    useEffect(() => {
        let api = "";
        let locale = "";
        if (
            localeOption.length === 0 ||
            localeOption.length === localeOptionList.length
        ) {
            api = `sort=${sortOption}&date=${dateOption}&page=0`;
        } else {
            localeOption.map((item) => {
                locale += `${localeOptionList[item - 1].temp},`;
            });
            locale = locale.slice(0, -1);
            locale = encodeURIComponent(locale);
            api = `sort=${sortOption}&date=${dateOption}&locals=${locale}&page=0`;
        }
        setSearchWord(api);
        console.log(searchWord);
    }, [sortOption, dateOption, localeOption]);

    const children = (
        <>
            {localeOptionList.map((option) => (
                <FormControlLabel
                    key={option.value}
                    value={option.value}
                    label={option.nickname}
                    control={
                        <Checkbox
                            checked={localeOption.indexOf(option.value) !== -1}
                            onChange={(event) =>
                                handleSingleLocaleOptionChange(
                                    event.target.checked,
                                    option.value
                                )
                            }
                        />
                    }
                />
            ))}
        </>
    );

    return (
        <div className="area">
            <div className={styles.content}>
                <div className={styles.search_header}>
                    <h1>플리마켓 둘러보기</h1>

                    {isSearch ? (
                        <div className={styles.searchResultTitle}>
                            {/* <p>
                                {sortOption} {dateOption} {localeOption}
                            </p> */}
                            {/* <p>{searchWord}</p> */}
                            <p>
                                {searchResult.length}개의 검색 결과가 있습니다.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.searchResultTitle}>
                            <h1>검색 결과</h1>
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
                <div className={styles.search_filter}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="마켓이름, 지역, 키워드 검색"
                            onChange={handleSearchWordChange}
                        />
                    </div>
                    <div className={styles.search_option}>
                        <div className={styles.localeOption}>
                            <Accordion className={styles.filter_list}>
                                <AccordionSummary
                                    className={styles.filter_title}
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <div className={styles.title}>
                                        지역 필터
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails
                                    className={styles.filter_menu}
                                >
                                    <FormControlLabel
                                        className={styles.filter_all}
                                        label={
                                            localeOption.length ===
                                            localeOptionList.length
                                                ? "전체 해제"
                                                : "전체 선택"
                                        }
                                        control={
                                            <Checkbox
                                                name="select-all"
                                                onChange={(e) =>
                                                    handleAllLocaleOptionChange(
                                                        e.target.checked
                                                    )
                                                }
                                                // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                                                checked={
                                                    localeOption.length ===
                                                    localeOptionList.length
                                                        ? true
                                                        : false
                                                }
                                                indeterminate={
                                                    localeOption.length ===
                                                    localeOptionList.length
                                                        ? false
                                                        : true
                                                }
                                            />
                                        }
                                    />
                                    <hr />
                                    {children}
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className={styles.dateOption}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">
                                    기간필터
                                </FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={dateOption}
                                    onChange={handleDateOptionChange}
                                >
                                    {stateOptionList.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            label={option.name}
                                            control={<Radio />}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <Button
                            variant="contained"
                            className={styles.searchButton}
                            onClick={handleSearch}
                        >
                            필터 적용하기
                        </Button>
                    </div>
                </div>
                <div className={styles.search_content}>
                    {isSearch ? (
                        <div>
                            <div className={styles.searchResultList}>
                                <div className={styles.sortOption}>
                                    <FormControl fullWidth>
                                        <InputLabel id="sortOption">
                                            정렬
                                        </InputLabel>
                                        <Select
                                            labelId="sortOption"
                                            id="sortOption"
                                            value={sortOption}
                                            label="정렬"
                                            onChange={handleSortOptionChange}
                                        >
                                            {sortOptionList.map((option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <MarketList list={searchResult} />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.searchResultTitle}>
                            <h1>검색 결과</h1>
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
