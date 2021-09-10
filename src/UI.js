import {ctx, canvas, returnNumberOfBallsPerWindow} from './Utils/canvasInfo';
import {GUIPath, ArcFill, ScrollBarStroke} from './UI/GUIObject';
import {mousePos} from './Utils/mouseMovement';
import regeneratorRuntime from "regenerator-runtime";

let currentFrameNum = 1;

export function drawFrameNum(){
    ctx.font = '70px Arial';
    ctx.fillStyle = 'black';
    let numOfDigits = currentFrameNum.toString().length;
    ctx.fillText(currentFrameNum.toString(), canvas.width - (60 + ((numOfDigits - 1) * 40)), 80);
}

let checkPointTracker = []; //Format {checked, label}
export function pushToCheckPointTracker(objToPush){
    checkPointTracker.push(objToPush);
}

let numOfCircles = 24;
let circlePos = 110, mouseDiffX = null, movedAway = 0;

export function moveUI(){
    if(!drawUIBeenCalled) return;
    circlePos = mousePos.x - mouseDiffX;
    if(circlePos > 110){
        circlePos = 110;
    }else if((circlePos + ((numOfCircles - 1) * 74)) < canvas.width - 110){
        circlePos = (canvas.width - 110) - ((numOfCircles - 1) * 74);
    }
    movedAway = 110 - circlePos;
}

let drawUIBeenCalled = false;
export function drawUi(){
    //drawing circles
    let circleStore = [];
    if(mouseState === 'BUTTONS'){
        moveUI();
    }
    for(let i = 1; i <= numOfCircles; i++){
        circleStore.push(new ArcFill({x: circlePos + ((i - 1) * 74), y: canvas.height - 50}, 30, 'circle-'+i));
    }
    circleStore.forEach((circle, i) => {
        if(currentFrameNum === i + 1){
            circle.selected = true;
        }else{
            circle.selected = false;
        }
        circle.draw()
    }); 
    if(!isThereCircleOverlap){
        checkToSeeIfThereIsAnOverlappingCircle();
    }
    ctx.beginPath();
    ctx.clearRect(canvas.width - 65, canvas.height - 85, 80, 75); ctx.clearRect(0, canvas.height - 85, 65, 75);
    const LeftArrow = new GUIPath({x: 20, y: canvas.height - 50}, [
        {x: 45, y: -30},
        {x: 0, y: 60}
    ],'leftGuiBtn');
    LeftArrow.draw();
    const RightArrow = new GUIPath({x: canvas.width - 20, y: canvas.height - 50}, [
        {x: -45, y: -30},
        {x: 0, y: 60}
    ], 'rightGuiBtn');
    RightArrow.draw();
    ctx.beginPath();
    showScrollBar();
    drawUIBeenCalled = true;
}

export function checkCheckPointTracker(){ //Check to see if cursor should be a pointer or not
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

export function clearCheckPointTracker(){ //Called at the start of repeated function
    checkPointTracker = [];
}

let scrollBarPos = 85, scrollDiffX = null, scrollAway = 0;
function showScrollBar(){
    if(isThereCircleOverlap){
        if((mousePos.y > canvas.height - 85) || mouseState === 'SCROLLBAR'){
                let numberOfBallsPerWindow = returnNumberOfBallsPerWindow(), percentageBallsOnScreen =  numberOfBallsPerWindow / numOfCircles;
                let fullWidthOfScrollBar = (canvas.width - 80) - 85, newWidth = fullWidthOfScrollBar * percentageBallsOnScreen;
                if(newWidth <= 21) newWidth = 21;
                if(mouseState === 'SCROLLBAR'){
                    let oldScrollBarPos = scrollBarPos;
                    scrollBarPos = mousePos.x - scrollDiffX;
                    if(scrollBarPos < 85){
                        scrollBarPos = 85;
                    }else if(scrollBarPos + newWidth > canvas.width - 80){
                        scrollBarPos = canvas.width - 80 - newWidth;
                    }
                    scrollAway = 85 - scrollBarPos;
                    let fullScrollBarWidth = (canvas.width - 80 - newWidth) - 85;
                    let scrollBarDiff = oldScrollBarPos - scrollBarPos, percentage = scrollBarDiff / fullScrollBarWidth;
                    console.log(percentage * 100);
                }
                const ScrollBar = new ScrollBarStroke({x: scrollBarPos, y: canvas.height - 10}, {x: scrollBarPos + newWidth, y: canvas.height - 10}, mouseState === 'SCROLLBAR');
                ScrollBar.draw();
            }
    }
}

let mouseState = 'DEF', isThereCircleOverlap = false;
addEventListener('mousedown', async e => {
    if(e.button === 0){
        let leftGuiBtn = checkPointTracker.find(check => check.label === 'leftGuiBtn');
        if(leftGuiBtn.checked){
            if(currentFrameNum > 1) currentFrameNum--;
        }
        let rightGuiBtn = checkPointTracker.find(check => check.label === 'rightGuiBtn');
        if(rightGuiBtn.checked){
            if(currentFrameNum + 1 > numOfCircles) numOfCircles++; //Need to render more circles to the GUI
            currentFrameNum++;
        }
        //Check to see if they have clicked within the circle GUI area
        if(isThereCircleOverlap){ //Allows bottom GUI to be dragged around
            if(mousePos.x > 66 && mousePos.x < (canvas.width - 132) + 66 && mousePos.y > canvas.height - 85 &&
                mousePos.y < (canvas.height - 85) + 70){
                    mouseDiffX = mousePos.x - (110 - movedAway);
                    mouseState = 'BUTTONS';
            }
        }
        let scrollBarClick = checkPointTracker.find(check => check.label === 'scrollBar' && check.checked);
        if(scrollBarClick){
            scrollDiffX = mousePos.x - (85 - scrollAway);
            mouseState = 'SCROLLBAR';
        }
        let oldMousePos = mousePos.x;
        await new Promise(resolve => { //Wait so that drag works properly
            setTimeout(() => {
                resolve();
            }, 75);
        });
        if(oldMousePos !== mousePos.x) return;
        let regex = new RegExp('circle-', 'ig'), clickedCircle = checkPointTracker.find(check => check.checked && regex.test(check.label));
        if(clickedCircle){
            if(clickedCircle.canClick){
                let number = Number(clickedCircle.label.split('-')[1]);
                currentFrameNum = number;
            }
        }
    }
});

export function checkToSeeIfThereIsAnOverlappingCircle(){
    let regex = new RegExp('circle-', 'ig');
    let findCircleOverlap = checkPointTracker.find(check => check.overlap && regex.test(check.label));
    if(findCircleOverlap){
        isThereCircleOverlap = true;
        return;
    }
    isThereCircleOverlap = false;
}

addEventListener('mouseup', e => {
    if(e.button === 0){
        mouseState = 'DEF';
    }
});