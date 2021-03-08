import React from 'react'
import AlgosCompleted from './AlgosCompleted'
import Problems from './Problem'
import Timer from './timer'

class AlgoSession extends React.Component{
    constructor(){
        super()
        this.state = {
            running: false,
            currentTag: 'Any',
            current: 0,
            completedproblems: [],
        }
        this.endSession = this.endSession.bind(this)
        this.startSession = this.startSession.bind(this)
        this.setTag = this.setTag.bind(this)
        this.updateCompletedProblems = this.updateCompletedProblems.bind(this)
    }

    tick(){
        let curr = this.state.current
        if(curr === 0){
            clearInterval(this.countdown)
            alert('Timer finished')
        } else {
            curr--
            this.setState({current: curr})
        }
    }

    startSession(curr){
        this.setState({running:true, current: curr})
        this.countdown = setInterval(() => this.tick(), 1000)
    }

    setTag(evt){
        this.setState({currentTag: evt.target.value})
    }

    updateCompletedProblems(doneAlgoArr){
        this.setState({completedproblems: doneAlgoArr})
    }

    async endSession(){
        this.setState({running: false})
        const data = {completedProblems: this.state.completedproblems}
        await fetch('/api/completedProblems', {method: 'POST',  headers:{'Content-Type': 'application/json'}, body: JSON.stringify(data)})
    }
    render(){
        return (
            <div>
                <Timer running={this.state.running} startSession={this.startSession} current={this.state.current} setTag={this.setTag} currentTag={this.state.currentTag}/>
                {this.state.running && <Problems endSession={this.endSession} updateCompletedProblems={this.updateCompletedProblems} currentTag={this.state.currentTag} current={this.state.current} completedproblems={this.state.completedproblems} />}
                <AlgosCompleted completedproblems={this.state.completedproblems} />
            </div>
        )
    }
}


export default AlgoSession