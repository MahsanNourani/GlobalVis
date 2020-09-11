import React, {useEffect} from 'react';
import {makeStyles, Grid} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import './videoPlayer.css';
import Heatmap from './Heatmap';
import * as d3 from 'd3';


const useStyles = makeStyles (theme => ({
    slider: {
        width: "98%",
    },
    progressBarGrid: {
        padding: theme.spacing(3, 2),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    heatmapContainer: {
        maxHeight: 300,
        overflow: "auto",
        // overflowY: "scroll",
    }
}));

export const PlayToggleButton = (props) => {

    const clicked = (e) => props.onClick(e);

    return(
        (props.playing) ?
        <IconButton aria-label="play" onClick={clicked}>
            <PauseIcon fontSize="small"/>
        </IconButton> :
        <IconButton aria-label="pause" onClick={clicked}>
            <PlayArrowIcon fontSize="small"/>
        </IconButton>
    );
}
export const ResetButton = (props) => {

    const clicked = (e) => props.onClick(e);

    return(
        <IconButton aria-label="reset" onClick={clicked}>
            <ReplayIcon fontSize="small"/>
        </IconButton> 
    );
}

export const ProgressBar = (props) => {

    const classes = useStyles();
    const [sliderValue, setSliderValue] = React.useState(props.played);
    const onInputSlider = () => {
        const slider = document.getElementById("progressBar");
        slider.style.background = 
            'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + slider.value*100 + '%, #fff ' + slider.value*100 + '%, white 100%)';
    }
    
    const handleSeekMouseDown = e => props.down(e);
    const handleSeekChange = (e, newValue) => {
        props.change(e);
    }
    const handleSeekMouseUp = e => {
        props.up(e);
        setSliderValue(e.target.value);
    }
    return(
        <input id="progressBar" type="range" min="0" max="0.9999" step="any" value={props.played} onMouseDown={handleSeekMouseDown} 
            onChange={handleSeekChange} onMouseUp={handleSeekMouseUp} className={`${classes.slider} slider`}/>
    );
}

export const PlayerControls = (props) => {
    const classes = useStyles();

    const handlePlayBtn = (e) => props.playPause(e);
    // handleSpeedBtn = (e) => props.toggleSpeed(e);
    const handleReset = (e) => props.replay(e);
    const handleSeekDown = (t) => props.down(t);
    const handleSeekChange = (t) => props.change(t);
    const handleSeekUp = (t) => props.up(t);
    const handleProgress = (t) => props.progress(t);

    const [heatmaps, setHeatMaps] = React.useState([]);
    const [data, setData] = React.useState(null);

    useEffect(fetchData, [props.videoData]);
    useEffect(updateHeatmaps, [data]);

    function fetchData () {
        d3.csv(require(`./data/${props.videoData}`))
          .then((d) => {
              setData(d);
              console.log(d);
           })
          .catch(function(error){
            console.log(error)   
         });
    }

    function updateHeatmaps(){
        if (data && data.length) {
            const temp = data.map((item, index) => {
                let key = index + "." + props.videoData;
                return (
                    <Heatmap size={[400, 50]} data={item} key={key} title={item.componentName} type={item.type}/>
                )
            });
            setHeatMaps(temp);
            console.log(heatmaps);
        }
    }

    // useEffect(() => {
    //         d3.csv(require(`./data/${props.videoData}`)).then((data) => {
    //         const tempHeatmaps = data.map((item, index) => {
    //             // console.log("heatmap created!")
    //             return (
    //                 <Heatmap size={[400, 50]} data={item} key={index} title={item.componentName} type={item.type}/>
    //             )
    //         });
    //         setHeatMaps(tempHeatmaps);
    //         // console.log(heatmaps)
    //     });
    // }, [heatmaps])
   
    return (
        <React.Fragment>
            <Grid container spacing={1} alignItems="center" justify="center">
                <PlayToggleButton playing={props.status.playing} onClick = {handlePlayBtn} />
                <ResetButton onClick = {handleReset} />
                <Grid item xs={9} className={classes.progressBarGrid}>
                    <ProgressBar played={props.status.played} down={handleSeekDown} change={handleSeekChange} up={handleSeekUp} progress={handleProgress}/>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center" spacing={1} className={classes.heatmapContainer}>
                {heatmaps}
                {/* {data?.map((item, index) => (
                    <Heatmap size={[400, 50]} data={item} key={index} title={item.componentName} type={item.type}/>
                ))} */}
            </Grid>
        </React.Fragment>
    );
}