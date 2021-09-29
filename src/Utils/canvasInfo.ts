import {moveUI} from '../UI';
import { changeAnimationTask} from '../Utils/animationTask';
import {AnimationTask, AnimationTaskDirection} from '../data/enums';

export const canvas:HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d');

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    moveUI();
    changeAnimationTask(AnimationTaskDirection.AFTER, [AnimationTask.CHECK_OVERLAPPING_CIRCLE, AnimationTask.DELETE_ONE_CIRCLE]);
    numberOfBallsPerWindow();
}
resizeCanvas();
addEventListener('resize', resizeCanvas);

let nmberBallsWindow:number = 0;
numberOfBallsPerWindow();
function numberOfBallsPerWindow():void{
    let start:number = 110, increment:number = 1;
    while(start + increment * 74 <= canvas.width - 110){
        increment++;
    }
    nmberBallsWindow = increment;
}
export function returnNumberOfBallsPerWindow():number{
    return nmberBallsWindow;
}