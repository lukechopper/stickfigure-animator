import {ctx, canvas, returnNumberOfBallsPerWindow} from './Utils/canvasInfo';
import {GUIPath, ArcFill, ScrollBarStroke} from './UI/GUIObject';
import {mousePos} from './Utils/mouseMovement';
import {percentageRange} from './Utils/mathFunctions';
import {trashCanImg, pauseNormalImg, pauseSelectedImg, playNormalImg, playSelectedImg, reverseNormalImg, reverseSpecialImg} from './data/images';
import regeneratorRuntime from "regenerator-runtime";
import { changePreAnimationTask, changeBeforeAnimationTask } from './app';

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

export function circlesExpandedMoveScroll(){
    let progress = Math.abs(circlePos - 110);
    let lastValue = Math.abs(((canvas.width - 109) - ((numOfCircles - 1) * 74)) - 110);
    showScrollBar(progress / lastValue);
}

export function moveUI(moveManually = null){
    if(!drawUIBeenCalled) return;
    if(moveManually !== null){
        circlePos = moveManually;
    }else{
        circlePos = mousePos.x - mouseDiffX;
    }
    if(circlePos > 110){
        circlePos = 110;
        scrollBarPos = 85, scrollDiffX = null, scrollAway = 0;
    }else if((circlePos + ((numOfCircles - 1) * 74)) < canvas.width - 110){
        circlePos = (canvas.width - 109) - ((numOfCircles - 1) * 74);
    }
    if(mouseState !== 'SCROLLBAR'){
        circlesExpandedMoveScroll();
    }
    movedAway = 110 - circlePos;
}

let drawUIBeenCalled = false;
let circleStore = [];
export function drawUi(){
    //drawing circles
    circleStore = [];
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
    drawDeleteCan();
    drawPlayControls();
    drawToAndFrowArrows();
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
let deleteBall = false; //For the deletion of keyframaes
function showScrollBar(forcePos = null){
    if(isThereCircleOverlap){
        if((mousePos.y > canvas.height - 85) || mouseState === 'SCROLLBAR' || deleteBall){
                let numberOfBallsPerWindow = returnNumberOfBallsPerWindow(), percentageBallsOnScreen =  numberOfBallsPerWindow / numOfCircles;
                let fullWidthOfScrollBar = (canvas.width - 80) - 85, newWidth = fullWidthOfScrollBar * percentageBallsOnScreen;
                if(newWidth <= 21) newWidth = 21;
                if(forcePos){
                    let endBallWidth = canvas.width - 80 - newWidth, totalBallWidth = endBallWidth - 85;
                    scrollBarPos = 85 + (totalBallWidth * forcePos);
                    if(scrollBarPos < 85){
                        scrollBarPos = 85;
                    }else if(scrollBarPos + newWidth > canvas.width - 80){
                        scrollBarPos = canvas.width - 80 - newWidth;
                    }
                    scrollAway = 85 - scrollBarPos;
                }
                if(mouseState === 'SCROLLBAR'){
                    scrollBarPos = mousePos.x - scrollDiffX;
                    if(scrollBarPos < 85){
                        scrollBarPos = 85;
                    }else if(scrollBarPos + newWidth > canvas.width - 80){
                        scrollBarPos = canvas.width - 80 - newWidth;
                    }
                    scrollAway = 85 - scrollBarPos;
                    let smallestPercentage = 85 / (canvas.width - 80 - newWidth);
                    let percentageOfScrolled = scrollBarPos / (canvas.width - 80 - newWidth);
                    let percentageNum = percentageRange(percentageOfScrolled, smallestPercentage, 1) / 100;
                    let endBallWidth = ((canvas.width - 109) - ((numOfCircles - 1) * 74)), totalBallWidth = endBallWidth - 110;
                    moveUI(110 + (totalBallWidth * percentageNum));
                }
                if(!deleteBall){
                    const ScrollBar = new ScrollBarStroke({x: scrollBarPos, y: canvas.height - 10}, {x: scrollBarPos + newWidth, y: canvas.height - 10}, mouseState === 'SCROLLBAR');
                    ScrollBar.draw();
                }
                deleteBall = false;
            }
    }
}

function drawDeleteCanFunc(){
    let imageProportion = {width: 0, height: 0};
    return () => {
        if(imageProportion.width === 0){
            imageProportion = {width: trashCanImg.width / 35, height: trashCanImg.height / 35};
        }
        ctx.save();
        if(mousePos.x > canvas.width - imageProportion.width - 25 && mousePos.x < (canvas.width - imageProportion.width - 25) + imageProportion.width
        && mousePos.y > canvas.height - 150 && mousePos.y < (canvas.height - 150) + imageProportion.height){
            ctx.globalAlpha = 1;
            pushToCheckPointTracker({checked: true, label: 'deleteTrashCan'});
        }else{
            ctx.globalAlpha = 0.5;
        }
        
        ctx.drawImage(trashCanImg, canvas.width - imageProportion.width - 25, canvas.height - 150, imageProportion.width, imageProportion.height);
        ctx.restore();
    }
}
const drawDeleteCan = drawDeleteCanFunc();
let playControlState = 'PAUSE';
function drawPlayControlsFunc(){
    let imageProportion = {width: 0, height: 0};
    let image = null;
    return () => {
        if(imageProportion.width === 0){
            imageProportion = {width: pauseNormalImg.width / 2.5, height: pauseNormalImg.height / 2.5};
        }
        if(mousePos.x > 25 && mousePos.x < 25 + imageProportion.width &&
            mousePos.y > canvas.height - imageProportion.height - 90 && mousePos.y < (canvas.height - imageProportion.height - 90) + imageProportion.height){
                if(playControlState === 'PAUSE'){
                    image = pauseSelectedImg;
                }else if(playControlState === 'PLAY'){
                    image = playSelectedImg;
                }
                pushToCheckPointTracker({checked: true, label: 'startPlay'});
            }else{
                if(playControlState === 'PAUSE'){
                    image = pauseNormalImg;
                }else if(playControlState === 'PLAY'){
                    image = playNormalImg;
                }
            }
        ctx.drawImage(image, 25, canvas.height - imageProportion.height - 90, imageProportion.width, imageProportion.height);
    }
}
const drawPlayControls = drawPlayControlsFunc();

function drawToAndFrowArrowsFunc(){
    let imageProportion = {width: 0, height: 0};
    let leftArrow = null, rightArrow = null;
    return () => {
        if(imageProportion.width === 0){
            imageProportion = {width: reverseNormalImg.width / 2, height: reverseNormalImg.height / 2};
        }
        rightArrow = reverseNormalImg;
        if(mousePos.x > 130 && mousePos.x < 130 + imageProportion.width && mousePos.y > canvas.height - imageProportion.height - 85 && mousePos.y < canvas.height - imageProportion.height - 85 + (imageProportion.height)){
            leftArrow = reverseSpecialImg;
            pushToCheckPointTracker({checked: true, label: 'leftReverseArrow'});
        }else{
            leftArrow = reverseNormalImg;
        }
        if(mousePos.x > 70 && mousePos.x < 70 + imageProportion.width && mousePos.y > canvas.height - imageProportion.height - 85 && mousePos.y < canvas.height - imageProportion.height - 85 + (imageProportion.height)){
            rightArrow = reverseSpecialImg;
            pushToCheckPointTracker({checked: true, label: 'rightReverseArrow'});
        }else{
            rightArrow = reverseNormalImg;
        }
        ctx.drawImage(leftArrow, 130, canvas.height - imageProportion.height - 85, imageProportion.width, imageProportion.height); //Left Arrow
        ctx.save();
        ctx.translate(125, canvas.height - imageProportion.height - 85); //Right Arrow
        ctx.scale(-1, 1);
        ctx.drawImage(rightArrow, 0, 0, imageProportion.width, imageProportion.height);
        ctx.restore();
    };
}
const drawToAndFrowArrows = drawToAndFrowArrowsFunc();

export function moveOneCircle(){
    deleteBall = true;
    moveUI((canvas.width - 109) - ((numOfCircles - 1) * 74));
}

export function deleteOneCircle(){
    deleteBall = true;
    circlesExpandedMoveScroll();
};

let mouseState = 'DEF', isThereCircleOverlap = false;
addEventListener('mousedown', async e => {
    if(e.button === 0){
        let leftGuiBtn = checkPointTracker.find(check => check.label === 'leftGuiBtn');
        if(leftGuiBtn.checked){
            if(currentFrameNum > 1){
                currentFrameNum--;
            }
            return;
        }
        let rightGuiBtn = checkPointTracker.find(check => check.label === 'rightGuiBtn');
        if(rightGuiBtn.checked){
            if(currentFrameNum + 1 > numOfCircles){
                numOfCircles++; //Need to render more circles to the GUI
                changePreAnimationTask(['CIRCLES_EXPAND_MOVE_SCROLL']);
            }
            currentFrameNum++;
            return;
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
            return;
        }
        let deleteCanClick = checkPointTracker.find(check => check.label === 'deleteTrashCan' && check.checked); //Click on delete can to delete a ball (keyframe)
        if(deleteCanClick){
            if(numOfCircles > 1){
                numOfCircles--;
                if(isThereCircleOverlap){
                    let endCircle = circleStore[numOfCircles - 1];
                    if(endCircle.startingPoint.x + endCircle.radius < canvas.width - 20){
                        changeBeforeAnimationTask(['MOVE_ONE_CIRCLE']);
                        changePreAnimationTask(['CHECK_OVERLAPPING_CIRCLE']);
                    }else{
                        changePreAnimationTask(['CHECK_OVERLAPPING_CIRCLE', 'DELETE_ONE_CIRCLE']);
                    }
                }
            }
            if(currentFrameNum > 1){
                currentFrameNum--;
            }
            return;
        }
        let canClickPause = checkPointTracker.find(check => check.label === 'startPlay' && check.checked); //Click on pause button to either pause or play animation
        if(canClickPause){
            if(playControlState === 'PAUSE'){
                playControlState = 'PLAY';
            }else if(playControlState === 'PLAY'){
                playControlState = 'PAUSE';
            }
        }
        let oldMousePos = mousePos.x;
        await new Promise(resolve => { //Wait so that drag works properly
            setTimeout(() => {
                resolve();
            }, 90);
        });
        if(oldMousePos !== mousePos.x) return;
        let regex = new RegExp('circle-', 'ig'), clickedCircle = checkPointTracker.find(check => check.checked && regex.test(check.label));
        if(clickedCircle){
            if(clickedCircle.canClick){
                let number = Number(clickedCircle.label.split('-')[1]);
                console.log(clickedCircle);
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