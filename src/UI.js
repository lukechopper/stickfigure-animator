import {ctx, canvas} from './Utils/canvasInfo';
import {mousePos} from './Utils/mouseMovement';

let currentFrameNum = 1;

export function drawFrameNum(){
    ctx.font = '70px Arial';
    ctx.fillText(currentFrameNum.toString(), 15, canvas.height - 20);
}

function makeWayForNum(){
    let numOfDigits = currentFrameNum.toString().length;
    return (numOfDigits - 1) * 40;
}

export let checkPointTracker = []; //Format {checked, label}

export function drawUi(){
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.beginPath(); //drawing left arrow
    let sp = {x: 65 + makeWayForNum(), y: canvas.height - 50};
    ctx.moveTo(sp.x, sp.y);
    sp.x += 45, sp.y -= 30;  ctx.lineTo(sp.x, sp.y);
    sp.y += 60; ctx.lineTo(sp.x, sp.y);
    let inside = ctx.isPointInPath(mousePos.x, mousePos.y); checkPointTracker.push({checked: inside, label: 'leftGuiBtn'});
    ctx.closePath();
    if(inside){
        ctx.fillStyle = 'gold'; ctx.globalAlpha = 0.5;
    }else{
        ctx.fillStyle = '#005ce6';
    }
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.beginPath(); //drawing right arrow
    sp = {x: canvas.width - 20, y: canvas.height - 50};
    ctx.moveTo(sp.x, sp.y);
    sp.x -= 45, sp.y -= 30;  ctx.lineTo(sp.x, sp.y);
    sp.y += 60; ctx.lineTo(sp.x, sp.y);
    inside = ctx.isPointInPath(mousePos.x, mousePos.y); checkPointTracker.push({checked: inside, label: 'rightGuiBtn'});
    ctx.closePath();
    if(inside){
        ctx.fillStyle = 'gold'; ctx.globalAlpha = 0.5;
    }else{
        ctx.fillStyle = '#005ce6';
    }
    ctx.fill();
    ctx.restore();
    //drawing circles
    
}

export function checkCheckPointTracker(){
    let haveFoundCheck = false;
    checkPointTracker.forEach(check => {
        if(haveFoundCheck) return;
        if(check.checked){
            haveFoundCheck = true;
            document.body.style.cursor = 'pointer';
            return;
        }
        document.body.style.cursor = '';
    });
}

export function clearCheckPointTracker(){
    checkPointTracker = [];
}

addEventListener('mousedown', e => {
    if(e.button === 0){
        let leftGuiBtn = checkPointTracker.find(check => check.label === 'leftGuiBtn');
        if(leftGuiBtn.checked){
            if(currentFrameNum > 1) currentFrameNum--;
        }
        let rightGuiBtn = checkPointTracker.find(check => check.label === 'rightGuiBtn');
        if(rightGuiBtn.checked){
            currentFrameNum++;
        }
    }
});