import './css/global.css';
import './css/styles.css';
import {canvas, ctx} from './Utils/canvasInfo';
import {drawUi, drawFrameNum, checkCheckPointTracker, clearCheckPointTracker, checkToSeeIfThereIsAnOverlappingCircle, circlesExpandedMoveScroll, moveOneCircle, deleteOneCircle} from './UI';
import {trashCanImg, pauseNormalImg, pauseSelectedImg, playNormalImg, playSelectedImg, reverseNormalImg, reverseSpecialImg} from './data/images';

trashCanImg.onload = loadImages;
trashCanImg.src = 'images/trash-can.png';
pauseNormalImg.onload = loadImages;
pauseNormalImg.src = 'images/pause-normal.png';
pauseSelectedImg.onload = loadImages;
pauseSelectedImg.src = 'images/pause-selected.png';
playNormalImg.onload = loadImages;
playNormalImg.src = 'images/play-normal.png';
playSelectedImg.onload = loadImages;
playSelectedImg.src = 'images/play-selected.png';
reverseNormalImg.onload = loadImages;
reverseNormalImg.src = 'images/reverse-normal.png';
reverseSpecialImg.onload = loadImages;
reverseSpecialImg.src = 'images/reverse-selected.png';
let imageCount = 7;

let preAnimationTask = [];
export function changePreAnimationTask(change){
    preAnimationTask = change;
};
let beforeAnimationTask = [];
export function changeBeforeAnimationTask(change){
    beforeAnimationTask = change;
}

function animate(){

    beforeAnimationTask.forEach(task => {
        if(task === 'MOVE_ONE_CIRCLE'){
            moveOneCircle();
        }
    });

    beforeAnimationTask = [];

    requestAnimationFrame(animate);
    clearCheckPointTracker();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawUi();
    drawFrameNum();

    preAnimationTask.forEach(task => {
        if(task === 'CHECK_OVERLAPPING_CIRCLE'){
            checkToSeeIfThereIsAnOverlappingCircle();
        }else if(task === 'CIRCLES_EXPAND_MOVE_SCROLL'){
            circlesExpandedMoveScroll();
        }else if(task === 'DELETE_ONE_CIRCLE'){
            deleteOneCircle();
        }
    });

    preAnimationTask = [];

    checkCheckPointTracker();
}

function loadImages(){
    if(--imageCount > 0) return;
    animate();
}