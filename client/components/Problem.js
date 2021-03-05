import React from 'react'

class Problems extends React.Component{
    constructor(){
        super()
        this.state = {
            problemArr: [],
            currentProblem: {},
            completedproblems: []
        }
        this.handlesubmit = this.handlesubmit.bind(this)
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
            this.setState({problemArr: data, currentProblem: firstProblem})
        } catch (error){
            console.error(error)
        }
    }

    handlesubmit(evt){
        evt.preventDefault()
        const thisProblem = this.state.currentProblem
        thisProblem['date'] = new Date()
        thisProblem['time'] = thisProblem.date.getTime() - thisProblem.start

        const pastProblems = this.state.completedproblems
        pastProblems.push(thisProblem)
        if(this.props.current > 60){
        const num = Math.floor(Math.random()*this.state.problemArr.length)
        const nextProblem = this.state.problemArr[num]
        nextProblem['start'] = new Date().getTime()

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
                <label htmlFor="runtime">Runtime: <input type="Number" name="runtime" /></label>
                <label htmlFor="runtime_precentile">Runtime %: <input type="Number" name="runtime_precentile" max="10000" /></label>
                <label htmlFor="memory">Memory: <input type="Number" name="memory" /></label>
                <label htmlFor="memory_precentile">Memory %: <input type="Number" name="memory_precentile" max="10000" /></label>
                <button type="submit" onClick={this.handlesubmit}>Submit</button>
            </div>
        )
    }
}

export default Problems