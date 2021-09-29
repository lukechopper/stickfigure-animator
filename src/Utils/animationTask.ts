import {AnimationTask, AnimationTaskDirection} from '../data/enums';
import {checkToSeeIfThereIsAnOverlappingCircle, circlesExpandedMoveScroll, moveOneCircle, deleteOneCircle} from '../UI';

let afterAnimationTask:Array<AnimationTask> = [];
let beforeAnimationTask:Array<AnimationTask> = [];
//Allows other files to submit both their before and after animation tasks to the main animate method.
export function changeAnimationTask(animationTaskDirection:AnimationTaskDirection, animationTasks:Array<AnimationTask> | AnimationTask):void{
    let arrayOfAnimationTasks:Array<AnimationTask> = [];
    if(!Array.isArray(animationTasks)){
        arrayOfAnimationTasks = [animationTasks];
    }else{
        arrayOfAnimationTasks = animationTasks;
    }
    arrayOfAnimationTasks.forEach((task:AnimationTask):void=>{
        if(animationTaskDirection === AnimationTaskDirection.BEFORE){
            if(beforeAnimationTask.indexOf(task) !== -1) return;
            beforeAnimationTask.push(task);
        }else if(animationTaskDirection === AnimationTaskDirection.AFTER){
            if(afterAnimationTask.indexOf(task) !== -1) return;
            afterAnimationTask.push(task);
        }
    });
};

//Used for both the before and after animation task 'forEach' loops.
function processTasks(task:AnimationTask):void{
    switch(task){
        case AnimationTask.MOVE_ONE_CIRCLE:
            moveOneCircle();
            break;
        case AnimationTask.CHECK_OVERLAPPING_CIRCLE:
            checkToSeeIfThereIsAnOverlappingCircle();
            break;
        case AnimationTask.CIRCLES_EXPAND_MOVE_SCROLL:
            circlesExpandedMoveScroll();
            break;
        case AnimationTask.DELETE_ONE_CIRCLE:
            deleteOneCircle();
            break;
    }
}

//What actually gets run in the main 'app' animate function
export function runBeforeAnimationTask():void{
    beforeAnimationTask.forEach((task:AnimationTask):void => {
        processTasks(task);
    });

    beforeAnimationTask = [];
}
//What actually gets run in the main 'app' animate function
export function runAfterAnimationTask():void{
    afterAnimationTask.forEach((task:AnimationTask):void => {
        processTasks(task);
    });

    afterAnimationTask = [];
}