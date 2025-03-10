import React from 'react';
import {ResumeContainer} from './ResumeContainer';
import _ from 'lodash';

export function ResumeList({ resumes }) {

    /* const [sortByCriteria, setSortByCriteria] = useState(null);
    const [isAscending, setIsAscending] = useState(null); 

    const handleClick = (event) => {

        const {name} = event.currentTarget;
    
        if (name !== sortByCriteria) {
          setSortByCriteria(name);
          setIsAscending(true);
        } else {
          if (isAscending === null) {
            setIsAscending(true);
          } else if (isAscending) {
            setIsAscending(false);
          } else {
            setSortByCriteria(null); 
            setIsAscending(null);
          }
        }
      }

      let sortedData = _.sortBy(resumes.title, sortByCriteria);
      if (sortByCriteria && isAscending === false) {
        sortedData.reverse();
      } */

     /* <p>Sort by: Alphabetical</p>
            <SortButton name="alphabetical" 
            active={sortByCriteria == "alphabetical"}
            ascending={isAscending}
            onClick={handleClick} /> */

    return (
        <div className="resume-list">
            {resumes.map(resume => (
                <ResumeContainer key={resume.id} resume={resume} />
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
      <button className="btn btn-sm btn-sort" name={props.name} onClick={props.onClick}>
        <span className={"material-icons" + iconClasses} aria-label={`sort by ${props.name}`}>sort</span>
      </button>
    );
  }