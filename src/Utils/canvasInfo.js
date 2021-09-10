import {moveUI, checkToSeeIfThereIsAnOverlappingCircle} from '../UI';

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    moveUI();
    setTimeout(() => {
        checkToSeeIfThereIsAnOverlappingCircle();
    }, 10);
    numberOfBallsPerWindow();
}
resizeCanvas();
addEventListener('resize', resizeCanvas);

let nmberBallsWindow = 0;
numberOfBallsPerWindow();
function numberOfBallsPerWindow(){
    let start = 110, increment = 1;
    while(start + increment * 74 <= canvas.width - 110){
        increment++;
    }
    nmberBallsWindow = increment;
}
export function returnNumberOfBallsPerWindow(){
    return nmberBallsWindow;
}