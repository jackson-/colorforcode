import React from 'react'
import JobInfoDisplay from './JobInfoDisplay';

const JobDetailPage = (props) => {
  return(
    <div className='JobDetailPage'>
      <JobInfoDisplay job_id={props.match.params.id} />
    </div>

  )
}

export default JobDetailPage
