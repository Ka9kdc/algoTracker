import React from 'react'
import AlgosCompleted from './AlgosCompleted'
import Problems from './Problem'
import Timer from './timer'
import { calculateTimeToDisplay } from './Problem'

class AlgoSession extends React.Component{
    constructor(){
        super()
        this.state = {
            running: false,
            currentTag: 'Any',
            current: 0,
            completedproblems: [],
            sessionLength: 90,
            start: 0,
            end: 0,
            tags: [],
        }
        this.startTimer = this.startTimer.bind(this)
        this.setSessionLength = this.setSessionLength.bind(this)
        this.endSession = this.endSession.bind(this)
        this.setTag = this.setTag.bind(this)
        this.updateCompletedProblems = this.updateCompletedProblems.bind(this)
    }

    async componentDidMount(){
        const res = await fetch('/api/tags', {method: 'GET'})
        const data = await res.json()
        this.setState({tags: data})
     }
 
     setSessionLength(evt){
         let value = parseInt(evt.target.value)
         if(value !== NaN){
             this.setState({sessionLength: value})
         }
     }
 
 
     startTimer(){
         const now = new Date()
         const curr = this.state.sessionLength*60
         const stopTime = now.getTime() + (curr*1000)
         const stop = calculateTimeToDisplay(stopTime)
         this.setState({start: now, end: stop, running:true, current: curr})
         this.countdown = setInterval(() => this.tick(), 100)
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


    setTag(evt){
        this.setState({currentTag: evt.target.value})
    }

    updateCompletedProblems(doneAlgoArr){
        this.setState({completedproblems: doneAlgoArr})
    }

    async endSession(){
        this.setState({running: false})
        const stop = new Date()
        const studySession = {
            sessionLength: this.state.sessionLength, 
            tag: this.state.currentTag,
            start: this.state.start,
            end: stop
        }
        const data = {completedProblems: this.state.completedproblems, studySession}
        await fetch('/api/completedProblems', {method: 'POST',  headers:{'Content-Type': 'application/json'}, body: JSON.stringify(data)})
    }
    render(){
        return (
            <div>
                <Timer {...this.state} setTag={this.setTag} setSessionLength={this.setSessionLength} startTimer={this.startTimer}/>
                {this.state.running && <Problems endSession={this.endSession} updateCompletedProblems={this.updateCompletedProblems} currentTag={this.state.currentTag} current={this.state.current} completedproblems={this.state.completedproblems} />}
                <AlgosCompleted completedproblems={this.state.completedproblems} />
            </div>
        )
    }
}


export default AlgoSession