import React, { Component } from 'react'
import { connect } from 'react-redux'
import { gettingAllJobs } from 'APP/src/reducers/actions/jobs'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import JobList from './JobList.js'
import './Home.css'
import { Link } from 'react-router-dom'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

function arrowRenderer () {
	return (
		<span></span>
	);
}


class JobBoard extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectValue:"",
      selected_skills:[],
      visible_jobs:[],
    }

  }

  componentWillMount(){
    this.props.getJobs();
    this.props.getSkills();
  }

  _handleChange(input){
		var skill_ids = this.state.selected_skills;
		if(input == "" || input == null){
			var viz = [];
			if(skill_ids.length > 0){
				viz = this.state.visible_jobs.filter((job) => {
					return skill_ids.every((skill) => {
						return job.skills.indexOf(skill) >= 0;
					});
				})
			} else {
				viz = this.props.jobs
			}
			let new_state = Object.assign({}, this.state, {visible_jobs:viz})
			this.setState(new_state);
		} else {
			var viz = [];
			var jobs = this.props.jobs
			for(let i=0; i < jobs.length; i++){
				if(jobs[i]['title'].toLowerCase().includes(input)){
					viz.push({title:jobs[i]['title'],
					id:jobs[i]['id']})
				}
			}
			let new_state = Object.assign({}, this.state, {visible_jobs:viz})
			this.setState(new_state);
		}
	}

  _checkForSkill(job, skill){
    return job.skills.some((s) => {
      return s.id === parseInt(skill, 10)
    })
  }

  _selectSkill(data){
		let skill_ids = data.split(',');
    let new_skills = []
		var viz = [];
		if(skill_ids[0] !== ""){
			viz = this.props.jobs.filter((job) => {
        console.log("JOB", job)
				return skill_ids.every((skill) => {
					return this._checkForSkill(job, skill);
				});
			});
      skill_ids.forEach((sk_id) => {
				this.props.skills.forEach((s) => {
          if(s.id === parseInt(sk_id, 10)){
            new_skills.push({label:s.title, value:s.id})
          }
        })
			});
		} else {
			viz = this.props.jobs;
		}
		let new_state = Object.assign({}, this.state,
			 {selectValue:new_skills, selected_skills:skill_ids, visible_jobs:viz})
		this.setState(new_state);
	}

  render(){
    let visible_jobs = []
    if(!this.state.selectValue && this.state.selected_skills.length === 0){
      visible_jobs = this.props.jobs
    } else {
      visible_jobs = this.state.visible_jobs
    }
    let skills = []
    this.props.skills.forEach((skill) => {
			skills.push({label:skill.title, value:skill.id})
		})
    console.log("SKILLS", this.props.skills)
    return(
      <div id='job-board'>
      <VirtualizedSelect
              arrowRenderer={arrowRenderer}
              autofocus
              clearable={true}
              searchable={true}
              simpleValue
              labelKey='label'
              valueKey='value'
              ref="job_search"
              multi={true}
              options={skills}
              onInputChange={(data) => this._handleChange(data)}
              onChange={(selectValue) => this._selectSkill( selectValue, 'select' )}
              value={this.state.selectValue}
              placeholder="Search For Jobs"
            />
        <JobList jobs={visible_jobs} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  jobs:state.jobs.all,
  skills:state.skills.all
})

const mapDispatchToProps = dispatch => ({
  getJobs: post => dispatch(gettingAllJobs()),
  getSkills: post => dispatch(gettingAllSkills())
})

const JobBoardContainer = connect(mapStateToProps, mapDispatchToProps)(JobBoard)

export default JobBoardContainer
