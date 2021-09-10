import './css/global.css';
import './css/styles.css';
import {canvas, ctx, fractionOfCanvas} from './Utils/canvasInfo';
import {drawUi, drawFrameNum, checkCheckPointTracker, clearCheckPointTracker} from './UI';

function animate(){
    requestAnimationFrame(animate);
    clearCheckPointTracker();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawUi();
    drawFrameNum();

    checkCheckPointTracker();
}
animate();


