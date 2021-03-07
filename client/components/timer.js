import React from 'react'
import Problems from './Problem'

class Timer extends React.Component{
    constructor(){
        super()
        this.state = {
            sessionLength: 90,
            start: 0,
            current: 0,
            end: 0,
            running: false,
            tags: [],
            currentTag: 'Any'
        }
        this.startTimer = this.startTimer.bind(this)
        this.setSessionLength = this.setSessionLength.bind(this)
        this.endSession = this.endSession.bind(this)
        this.setTag = this.setTag.bind(this)
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

    setTag(evt){
        this.setState({currentTag: evt.target.value})
    }

    startTimer(){
        const now = new Date().getTime()
        const curr = this.state.sessionLength*60
        const stop = new Date().getTime()+curr
        this.setState({start: now, current: curr, end: stop, running: true})
        this.countdown = setInterval(() => this.tick(), 1000)
    }
    
    tick(){
        let curr = this.state.current
        if(curr === 0){
            clearInterval(this.countdown)
        } else {
            curr--
            this.setState({current: curr})
        }
    }

    endSession(){
        this.setState({running: false})
    }


    render(){
        if(!this.state.running){
            return (
            <div>
                <input type="radio" value='30' onClick={this.setSessionLength} name="sessionLength" />15 minutes
                <input type="radio" value='30' onClick={this.setSessionLength} name="sessionLength" />30 minutes
                <input type="radio" value='60' onClick={this.setSessionLength} name="sessionLength" />60 minutes
                <input type="radio" value='90' onClick={this.setSessionLength} name="sessionLength" defaultChecked/>90 minutes
                <select name="tag" value={this.state.currentTag} onChange={this.setTag}>
                    <option value='Any' name='tag'>Any</option>
                    {this.state.tags.length && this.state.tags.map(tag => (
                        <option value={tag.tag} name='tag' key={tag.id}>{tag.tag}</option>
                    ))}
                </select>
                <button type="button" onClick={this.startTimer}>Start</button>
            </div>
            )
        } else {
            return (
                <div>
                    <p>{this.state.start} - {this.state.end}</p>
                    <p>{this.state.sessionLength}</p>
                    <p>{Math.floor(this.state.current/60)}:{this.state.current%60}</p>
                    <Problems end={this.state.endSession} current={this.state.current} currentTag={this.state.currentTag}/>
                </div>
            )
        }
    }
}

export default Timer