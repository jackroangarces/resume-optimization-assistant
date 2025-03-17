import React, { useState } from 'react';
import {ResumeContainer} from './ResumeContainer';
import _ from 'lodash';

export function ResumeList({ resumes, setResumes, username }) {

    const [sortByCriteria, setSortByCriteria] = useState(null);
    const [isAscending, setIsAscending] = useState(true); 
    // Testing my user settings
    const handleClick = (event) => {
        const {title} = event.currentTarget;
        if (title !== sortByCriteria) {
          setSortByCriteria(title);
          setIsAscending(true);
        } else {
          setIsAscending(prevState => !prevState);
        }
      }

      let sortedData = [...resumes];
      if (sortByCriteria == "alphabetical") {
        sortedData = _.sortBy(sortedData, resume => resume.title.toLowerCase());
        if (!isAscending) {
            sortedData.reverse();
        }
      } else if (sortByCriteria === "date") {
        sortedData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (isAscending) {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    }

    return (
        <div>
          <div>Sort by:
            <SortButton
              name="alphabetical" 
              active={sortByCriteria === "alphabetical"}
              ascending={isAscending && sortByCriteria === "alphabetical"}
              onClick={handleClick}>
             
            </SortButton>
            <SortButton
              name="date"
              active={sortByCriteria === "date"}
              ascending={isAscending && sortByCriteria === "date"}
              onClick={handleClick}>
              
            </SortButton>
          </div> 
        <div className="resume-list">
            {sortedData.map(resume => (
          <ResumeContainer key={resume.id} resume={resume} resumes={resumes} setResumes={setResumes} username={username} />
        ))}
        </div>
      </div>
    );
}

function SortButton(props) {
    let iconClasses = "material-icons"
    if (props.active) { iconClasses += ` active` }
    if (props.ascending) { iconClasses += ` flip` };
  
    return (
      <button className="btn btn-sm btn-sort" title={props.name} onClick={props.onClick}>
          <span>{props.children}</span>
          <span className={iconClasses} aria-label={`sort by ${props.name}`}>{props.name}</span>
      </button>
    );
  }