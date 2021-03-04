import React from 'react'

class Timer extends React.Component{
    constructor(){
        super()
        this.state = {
            sessionLength: 90,
            start: 0,
            current: 0,
            end: 0,
            running: false
        }
        this.startTimer = this.startTimer.bind(this)
        this.setSessionLength = this.setSessionLength.bind(this)
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
        this.setState({start: now, current: curr, end: stop, running: true})
        this.countdown = setInterval(() => this.tick(), 1000)
    }
    
    tick(){
        let curr = this.state.current
        if(curr === 0){
            this.setState({running: false})
            clearInterval(this.countdown)

        } else {
            curr--
            this.setState({current: curr})
        }
    }


    render(){
        if(!this.state.running){
            return (
            <div>
                <input type="radio" value='30' onClick={this.setSessionLength} name="sessionLength" />15 minutes
                <input type="radio" value='30' onClick={this.setSessionLength} name="sessionLength" />30 minutes
                <input type="radio" value='60' onClick={this.setSessionLength} name="sessionLength" />60 minutes
                <input type="radio" value='90' onClick={this.setSessionLength} name="sessionLength" defaultChecked/>90 minutes
                <button type="button" onClick={this.startTimer}>Start</button>
            </div>
            )
        } else {
            return (
                <div>
                    <p>{this.state.start} - {this.state.end}</p>
                    <p>{this.state.sessionLength}</p>
                    <p>{Math.floor(this.state.current/60)}:{this.state.current%60}</p>
                </div>
            )
        }
    }
}

export default Timer