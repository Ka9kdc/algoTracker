import React from 'react'

export const calculateTimeToDisplay = (time) => {
    let hours = (Math.floor(time/ 3600000) + 6)% 24
    let minutes = Math.floor(time/ 60000) % 60
    let seconds = Math.floor(time/ 1000) % 60
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return `${hours}:${minutes}:${seconds}`
}

class Problems extends React.Component{
    constructor(){
        super()
        this.state = {
            problemArr: [],
            currentProblem: {
                runtime: 0,
                runtime_percentile: 0,
                memory: 0,
                memory_percentile: 0
            },
        }
        this.handlesubmit = this.handlesubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    async componentDidMount(){
        try{
            let res
            if(this.props.currentTag === 'Any'){
                res = await fetch('/api/any', {method: 'GET'})
            }else{
                res = await fetch(`/api/${this.props.currentTag}`, {method: 'GET'})
            }
            const data = await res.json()
            let firstProblem = Math.floor(Math.random()*data.length)
            firstProblem = data[firstProblem]
            firstProblem["start"] = new Date().getTime()
            firstProblem['runtime'] = 0
            firstProblem['runtime_percentile'] = 0
            firstProblem['memory'] = 0
            firstProblem['memory_percentile'] = 0
            this.setState({problemArr: data, currentProblem: firstProblem})
        } catch (error){
            console.error(error)
        }
    }

    handleChange(evt){
        const currentProblem = this.state.currentProblem
        if(evt.target.value !== '' && parseInt(evt.target.value) !== NaN){
            currentProblem[evt.target.name] = parseInt(evt.target.value)
        } else {
            currentProblem[evt.target.name] = 0
        }
        this.setState({currentProblem: currentProblem})
    }

    handlesubmit(evt){
        evt.preventDefault()
        const thisProblem = this.state.currentProblem
        thisProblem['date'] = new Date()
        thisProblem['time'] = thisProblem.date.getTime() - thisProblem.start
        thisProblem['average_precentile'] = Math.floor((thisProblem.runtime_percentile+thisProblem.memory_percentile)/2)
        
        const pastProblems = this.props.completedproblems
        pastProblems.push(thisProblem)
        this.props.updateCompletedProblems(pastProblems)

        if(this.props.current > 60){
            let num = Math.floor(Math.random()*this.state.problemArr.length)
            let nextProblem = this.state.problemArr[num]
            let alreadyCompleted = pastProblems.filter(algo => algo.id === nextProblem.id)
            while(alreadyCompleted.length){
                num = Math.floor(Math.random()*this.state.problemArr.length)
                 nextProblem = this.state.problemArr[num]
                 pastProblems.filter(algo => algo.id === nextProblem.id)
            }
            nextProblem['start'] = new Date().getTime()
            nextProblem['runtime'] = 0
            nextProblem['runtime_percentile'] = 0
            nextProblem['memory'] = 0
            nextProblem['memory_percentile'] = 0
            this.setState({currentProblem: nextProblem})
        } else {
            this.props.endSession()
        }

        
    }

    render(){
        let name = ''
        if(this.state.currentProblem.title){
            name = this.state.currentProblem.title.toLowerCase().split(" ").join("-")
        }
        let startTime; 
        if(this.state.currentProblem.start){
            startTime = calculateTimeToDisplay(this.state.currentProblem.start)
        }
        return (
            <div>
                <h2>{this.state.currentProblem.title}: <a href={`https://leetcode.com/problems/${name}`} target="_blank">Leetcode Link</a></h2>
                <p>Start Time: {startTime} -  Level: {this.state.currentProblem.level}  -  Acceptance: {this.state.currentProblem.acceptance}  -  Frequency: {this.state.currentProblem.frequency}</p>
                <label htmlFor="runtime">Runtime: <input type="Number" value={this.state.currentProblem.runtime} onChange={this.handleChange} name="runtime" /></label>
                <label htmlFor="runtime_precentile">Runtime %: <input type="Number" value={this.state.currentProblem.runtime_percentile} onChange={this.handleChange} name="runtime_percentile" max="10000" /></label>
                <label htmlFor="memory">Memory: <input type="Number" value={this.state.currentProblem.memory} onChange={this.handleChange} name="memory" /></label>
                <label htmlFor="memory_precentile">Memory %: <input type="Number" value={this.state.currentProblem.memory_percentile} onChange={this.handleChange} name="memory_percentile" max="10000" /></label>
                <button type="submit" onClick={this.handlesubmit}>Submit</button>
            </div>
        )
    }
}

export default Problems