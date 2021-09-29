//Used for both the before and after tasks in the main 'animation' function in the main 'app.ts' file.
export enum AnimationTask {MOVE_ONE_CIRCLE, CHECK_OVERLAPPING_CIRCLE, CIRCLES_EXPAND_MOVE_SCROLL, DELETE_ONE_CIRCLE};
//Used when submitting the animation task; users can specify whether they want their task to be done before or after the main rendering for the frame is done.
export enum AnimationTaskDirection {BEFORE, AFTER};