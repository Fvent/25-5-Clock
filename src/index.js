import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (<div id="app">
            <Timer />
        </div>);
    }
}

class Timer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            breakLength : 5,
            sessionLength: 25,
            activeTimer: "Session",
            timeInSecs: 1500,
            clockMoving: false,
            clockStarted: false
        }

        this.incrementBreak = this.incrementBreak.bind(this);
        this.decrementBreak = this.decrementBreak.bind(this);
        this.incrementSession = this.incrementSession.bind(this);
        this.decrementSession = this.decrementSession.bind(this);

        this.handleStartStop = this.handleStartStop.bind(this);
        this.moveSessionTimer = this.moveSessionTimer.bind(this);
        this.moveBreakTimer = this.moveBreakTimer.bind(this);
        this.handleReset = this.handleReset.bind(this);
        
        this.TIME_FRAME = 1000; 
    }

    incrementBreak(){
        if(this.state.breakLength < 60){
            this.setState({
                breakLength: this.state.breakLength + 1
            });
        }
    }
    decrementBreak(){
        if(this.state.breakLength > 1){
            this.setState({
                breakLength: this.state.breakLength -1
            });
        }
    }
    incrementSession(){
        if(!this.state.clockStarted){
            if(this.state.sessionLength < 60){
                this.setState({
                    sessionLength: this.state.sessionLength + 1,
                    timeInSecs: (this.state.sessionLength + 1) * 60
                });
            }
        }else{
            if(this.state.sessionLength < 60){
                this.setState({
                    sessionLength: this.state.sessionLength + 1
                });
            }
        }
        
    }
    decrementSession(){
        if(!this.state.clockStarted){
            if(this.state.sessionLength > 1){
                this.setState({
                    sessionLength: this.state.sessionLength - 1,
                    timeInSecs: (this.state.sessionLength-1) * 60
                });
            }
        }else{
            if(this.state.sessionLength > 1){
                this.setState({
                    sessionLength: this.state.sessionLength - 1
                });
            }
        }
        
    }
    


    handleStartStop(){

        if(!this.state.clockStarted){
            this.setState({
                timeInSecs: this.state.sessionLength*60,
                clockStarted: true
            });
        }

        if(this.state.clockMoving){
            clearInterval(this.intervalVar)
            this.setState({ clockMoving: false})
        }else{
            if(this.state.activeTimer === "Session"){
                this.intervalVar = setInterval(this.moveSessionTimer,this.TIME_FRAME);
                this.setState({clockMoving: true});
            }else{
                this.intervalVar = setInterval(this.moveBreakTimer,this.TIME_FRAME);
                this.setState({clockMoving: true});
            }

            
        }       
    }
    moveSessionTimer(){
        if(this.state.activeTimer==="Session"){
            if(this.state.timeInSecs < 1){
                clearInterval(this.intervalVar);
                document.getElementById('beep').play();
                this.setState({
                    activeTimer: "Break",
                    timeInSecs: this.state.breakLength * 60,
                    clockMoving: true,
                    clockStarted: true
                });
                this.intervalVar = setInterval(this.moveBreakTimer,this.TIME_FRAME);
            }else{
                this.setState({
                    timeInSecs: this.state.timeInSecs - 1
                });
                // console.log(this.state.timeInSecs);
            }
        } 
    }
    moveBreakTimer(){
        if(this.state.timeInSecs < 1){
            clearInterval(this.intervalVar);
            document.getElementById('beep').play();
            this.setState({
                activeTimer: "Session",
                timeInSecs: this.state.sessionLength * 60,
                clockMoving: true,
                clockStarted: true
            });
            this.intervalVar = setInterval(this.moveSessionTimer,this.TIME_FRAME);
        }else{
            this.setState({
                timeInSecs: this.state.timeInSecs - 1
            });
        }
    }


    
    handleReset(){
        clearInterval(this.intervalVar);
        this.setState({
            breakLength: 5,
            sessionLength: 25,
            timeInSecs: 1500,
            clockStarted: false,
            clockMoving: false,
            activeTimer: "Session"
        });
        document.getElementById('beep').pause();
        document.getElementById('beep').currentTime = 0;
    }

    ///// this function is taken from https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
    displayFormattedTime(time){
        var minutes;
        var seconds;
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return minutes + ":" + seconds;
    }

    render(){
        return (<div id="timer">
            <h1>25 + 5 Clock</h1>
            <div id="timer-controls">
                <div id="break-div">
                    <h2 id="break-label">Break Length</h2>
                    <button id="break-increment" className="time-control" onClick={this.incrementBreak}>+</button>
                    <h2 id="break-length">{this.state.breakLength}</h2>
                    <button id="break-decrement" className="time-control" onClick={this.decrementBreak}>-</button>
                </div>
                <div id="session-div">
                    <h2 id="session-label">Session Length</h2>
                    <button id="session-increment" className="time-control" onClick={this.incrementSession}>+</button>
                    <h2 id="session-length">{this.state.sessionLength}</h2>
                    <button id="session-decrement" className="time-control" onClick={this.decrementSession}>-</button>
                </div>
            </div>
            <div id="timer-display">
                <h2 id="timer-label">{this.state.activeTimer}</h2>
                <h2 id="time-left">{this.displayFormattedTime(this.state.timeInSecs)}</h2>
                <button id="start_stop" className="display-btn" onClick={this.handleStartStop}>start/stop</button>
                <button id="reset" className="display-btn" onClick={this.handleReset}>reset</button>
                {/* this audio element is taken from the example given in freeCodeCamp */}
                <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" preload="auto" />
            </div>
            

        </div>);
    }
}



ReactDOM.render(<App />, document.getElementById('root'));