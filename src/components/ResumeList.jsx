import React, { useState } from 'react';
import {ResumeContainer} from './ResumeContainer';
import _ from 'lodash';

export function ResumeList({ resumes, setResumes, username }) {

    const [sortByCriteria, setSortByCriteria] = useState(null);
    const [isAscending, setIsAscending] = useState(true); 

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

      sortedData = _.sortBy(resume => resume.title, sortedData);
      if (!isAscending) {
        sortedData.reverse();
      } 
    }

    return (
        <div className="resume-list">
             <div>Sort by: Alphabetical
            <SortButton name="alphabetical" 
            active={sortByCriteria == "alphabetical"}
            ascending={isAscending}
            onClick={handleClick} /> 
            </div> 

            {resumes.map(resume => (
          <ResumeContainer key={resume.id} resume={resume} resumes={resumes} setResumes={setResumes} username={username} />
        ))}
        </div>
    );
}
//comitting draft 2!

function SortButton(props) {
    let iconClasses = ""
    if (props.active) { iconClasses += ` active` }
    if (props.ascending) { iconClasses += ` flip` };
  
    return (
      <button className="btn btn-sm btn-sort" title={props.name} onClick={props.onClick}>
        <span className={"material-icons" + iconClasses} aria-label={`sort by ${props.name}`}>Sort</span>
      </button>
    );
  }