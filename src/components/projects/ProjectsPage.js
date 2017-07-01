import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row } from 'react-bootstrap'
import { gettingUserProjects } from 'APP/src/reducers/actions/projects'
import ProjectsList from './ProjectsList.js'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

function arrowRenderer () {
	return (
		<span></span>
	);
}

class ProjectsPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectValue: [],
      selected_skills: [],
      visible_projects: [],
    }
  }

  _handleChange(input){
		let viz = [];
		let skill_ids = this.state.selected_skills;

		if (input === "" || input === null) {

			if (skill_ids.length > 0) {
				viz = this.state.visible_projects.filter((project) => {
					return skill_ids.every((skill) => {
						return project.skills.indexOf(skill) >= 0;
					});
				})
			} else {
				viz = this.props.user.projects
			}
			let new_state = Object.assign({}, this.state, {visible_projects:viz, selectValue:input})
			this.setState(new_state);
		} else {
			if (skill_ids.length > 0) {
				viz = this.state.visible_projects.filter((project) => {
					return skill_ids.every((skill) => {
						return project.skills.indexOf(skill) >= 0;
					});
				})
			}

			for(let i=0; i < viz.length; i++){
				if (viz[i]['title'].toLowerCase().includes(input)) {
					viz.push({title: viz[i]['title'], id: viz[i]['id']})
				}
			}

			let new_state = Object.assign({}, this.state, {visible_projects:viz, selectValue:input})
			this.setState(new_state);
		}
	}

  _checkForSkill(project, skill){
    return project.skills.some((s) => {
      return s.id === parseInt(skill, 10)
    })
  }

  _selectSkill(data){
		let skill_ids = data.split(',');
    let new_skills = []
		var viz = [];
		if(skill_ids[0] !== ""){
			viz = this.props.user.projects.filter((projectData) => {
        const project = {...projectData._source}
				return skill_ids.every((skill) => {
					return this._checkForSkill(project, skill);
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
			viz = this.props.user.projects;
		}
		let new_state = Object.assign({}, this.state,
			 {selectValue:new_skills, selected_skills:skill_ids, visible_projects:viz})
		this.setState(new_state);
	}

  render(){
    let visible_projects = []
    if(this.props.user && this.state.selectValue.length === 0 && this.state.selected_skills.length === 0){
      visible_projects = this.props.user.projects
    } else {
      visible_projects = this.state.visible_projects
    }
    return (
      <div className='JobBoard'>
				<h1>Projects</h1>
  			{
          this.props.loading
            ? <p>Loading....</p>
            : <div>
								<ProjectsList projects={visible_projects} />
							</div>
  			}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user:state.users.currentUser,
	loading: state.loading
})

const mapDispatchToProps = dispatch => ({
	getProjects: user => dispatch(gettingUserProjects(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage)
