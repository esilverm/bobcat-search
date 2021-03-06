import React, { useState } from "react";
import styled from "styled-components";

const Loader = styled.img`
  opacity: ${props => (props.loading ? 0.3 : 0)};
  position: absolute;
  top: calc(7vmax + 1.6rem);
  left: calc(87vmin - 3.2rem);
  height: 0.8rem;
  z-index: 2;
`;

const SearchBox = styled.input`
  font-family: var(--primaryFont);
  position: absolute;
  top: 7vmax;
  left: 10vmin;
  width: 80vmin;
  height: 4rem;
  background-color: white;
  padding: 1.2rem 2rem;
  font-size: 1.3rem;
  cursor: text;
  outline: solid;
  outline-color: var(--grey300);
  border: none;
  transition: outline-color 0.2s;

  &:focus {
    outline-color: var(--purpleMain);
  }

  &::placeholder {
    color: rgb(136, 136, 136);
    font-size: 1.2rem;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: calc(7vmax + 5rem);
  left: 10vmin;
  width: 80vmin;
`;

const Course = styled.div`
  background-color: white;
  padding: 1rem;
  font-size: 1.15rem;
  border: 1px solid var(--grey200);
  color: var(--grey900);

  & > .courseSchoolCode,
  & > .courseId {
    font-family: var(--extraCondensedFont);
    font-weight: 500;
    color: var(--grey700);
  }

  & > .courseName {
    font-weight: bold;
    margin-left: 1rem;
  }
`;

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState({
    loading: false,
    results: []
  });

  const _handleChange = async event => {
    setSearchText(event.target.value);

    // handle empty search text
    if (event.target.value.replace(/\s/g, "").length === 0) {
      setSearchResults({ loading: false, results: [] });
      return;
    }
    setSearchResults({ loading: true, results: [] });
    // fetch results
    fetch(
      `https://schedge.a1liu.com/2020/su/search?query=${event.target.value}&limit=5`
    )
      .then(response => response.json())
      .then(results => setSearchResults({ loading: false, results }))
      .catch(error => console.error(error));
  };

  return (
    <>
      <Loader
        src="./loading.svg"
        alt="loading symbol"
        loading={+searchResults.loading}
      />
      <SearchBox
        value={searchText}
        placeholder="Search Courses"
        onChange={_handleChange}
      ></SearchBox>
      <SearchResults>
        {searchText.replace(/\s/g, "").length !== 0 &&
          searchResults.results.map((course, i) => (
            <Course key={i}>
              <span className="courseSchoolCode">
                {course.subjectCode.school}-{course.subjectCode.code}
              </span>
              <span className="courseId">{course.deptCourseId}</span>
              <span className="courseName">{course.name}</span>
            </Course>
          ))}
      </SearchResults>
    </>
  );
}
