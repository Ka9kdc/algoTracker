import React from 'react'
import Problems, { calculateTimeToDisplay } from './Problem'

class Timer extends React.Component{
    constructor(){
        super()
        this.state = {
            sessionLength: 90,
            start: 0,
            end: 0,
            tags: [],
        }
        this.startTimer = this.startTimer.bind(this)
        this.setSessionLength = this.setSessionLength.bind(this)
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
        const now = new Date().getTime()
        const curr = this.state.sessionLength*60
        const stop = new Date().getTime()+curr
        this.props.startSession(curr)
        this.setState({start: now, end: stop})
    }
    
    

    render(){
        if(!this.props.running){
            return (
            <div>
                <input type="radio" value='30' onClick={this.setSessionLength} name="sessionLength" />15 minutes
                <input type="radio" value='30' onClick={this.setSessionLength} name="sessionLength" />30 minutes
                <input type="radio" value='60' onClick={this.setSessionLength} name="sessionLength" />60 minutes
                <input type="radio" value='90' onClick={this.setSessionLength} name="sessionLength" defaultChecked/>90 minutes
                <select name="tag" value={this.props.currentTag} onChange={this.props.setTag}>
                    <option value='Any' name='tag'>Any</option>
                    {this.state.tags.length && this.state.tags.map(tag => (
                        <option value={tag.tag} name='tag' key={tag.id}>{tag.tag}</option>
                    ))}
                </select>
                <button type="button" onClick={this.startTimer}>Start</button>
            </div>
            )
        } else {
            let start = calculateTimeToDisplay(this.state.start)
            let end = calculateTimeToDisplay(this.state.end)
            return (
                <div>
                    <p>{start} - {end}</p>
                    <p>{this.state.sessionLength}</p>
                    <p>{Math.floor(this.props.current/60)}:{this.props.current%60}</p>
                </div>
            )
        }
    }
}

export default Timer