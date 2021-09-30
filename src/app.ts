import './css/global.css';
import './css/styles.css';
import {canvas, ctx} from './Utils/canvasInfo';
import {drawUi, drawFrameNum, checkCheckPointTracker, clearCheckPointTracker} from './UI';
import {prepareImages,setImageCount,getImageCount} from './data/images';
import {handleMouseMove} from './Utils/mouseMovement';
import {runBeforeAnimationTask,runAfterAnimationTask} from './Utils/animationTask';

//Loads up all of the prepared images from the relevant file so that our application can start.
prepareImages();


function animate():void{

    runBeforeAnimationTask();

    requestAnimationFrame(animate);
    clearCheckPointTracker();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawUi();
    drawFrameNum();

    runAfterAnimationTask();

    checkCheckPointTracker();
}

//What gets the application to actually start running
export function loadImages():void{
    setImageCount(getImageCount() - 1);
    if(getImageCount() > 0) return;
    animate();
}

addEventListener('mousemove', (e:MouseEvent):void=>{
    handleMouseMove(e);
});