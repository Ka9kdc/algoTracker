import React from 'react'

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
            completedproblems: [],
        }
        this.handlesubmit = this.handlesubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    async componentDidMount(){
        try{
            console.log(this.props.currentTag)
            const res = await fetch(`/api/${this.props.currentTag}`, {method: 'GET'})
            const data = await res.json()
            console.log(data)
            let firstProblem = Math.floor(Math.random()*data.length)
            console.log(firstProblem)
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
        console.log(evt.target.name, evt.target.value, typeof evt.target.value)
        const currentProblem = this.state.currentProblem
        currentProblem[evt.target.name] = parseInt(evt.target.value)
        this.setState({currentProblem: currentProblem})
    }

    handlesubmit(evt){
        evt.preventDefault()
        const thisProblem = this.state.currentProblem
        thisProblem['date'] = new Date()
        thisProblem['time'] = thisProblem.date.getTime() - thisProblem.start
        thisProblem['average_precentile'] = Math.floor((thisProblem.runtime_percentile+thisProblem.memory_percentile)/2)
console.log(thisProblem.average_precentile)

        const pastProblems = this.state.completedproblems
        pastProblems.push(thisProblem)
        if(this.props.current > 60){
        const num = Math.floor(Math.random()*this.state.problemArr.length)
        const nextProblem = this.state.problemArr[num]
        nextProblem['start'] = new Date().getTime()
        nextProblem['runtime'] = 0
        nextProblem['runtime_percentile'] = 0
        nextProblem['memory'] = 0
        nextProblem['memory_percentile'] = 0
        this.setState({currentProblem: nextProblem, completedproblems: pastProblems})
        } else {
            this.setState({completedproblems: pastProblems})
            this.props.endSession()
        }
    }

    render(){
        let name = ''
        if(this.state.currentProblem.title){
            name = this.state.currentProblem.title.toLowerCase().split(" ").join("-")
        }
        return (
            <div>
                <h2>{this.state.currentProblem.title}: <a href={`https://leetcode.com/problems/${name}`} target="_blank">Leetcode Link</a></h2>
                <p>Start Time: {this.state.currentProblem.start}  -  Level: {this.state.currentProblem.difficulty}  -  Acceptance: {this.state.currentProblem.acceptance}  -  Frequency: {this.state.currentProblem.frequency}</p>
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