import {loadImages} from '../app';

//The number of images that we have in our entire application. They are all listed below.
let imageCount:number = 7;
export function setImageCount(newNumber:number):void{
    imageCount = newNumber;
}
export function getImageCount():number{
    return imageCount;
}

//Instantiate all of the images here.
export const trashCanImg:HTMLImageElement = new Image();
export const pauseNormalImg:HTMLImageElement = new Image();
export const pauseSelectedImg:HTMLImageElement = new Image();
export const playNormalImg:HTMLImageElement = new Image();
export const playSelectedImg:HTMLImageElement = new Image();
export const reverseNormalImg:HTMLImageElement = new Image();
export const reverseSpecialImg:HTMLImageElement = new Image();

//This function needs to be activated within the main 'app' file; without it our application won't be able to start.
export function prepareImages():void{
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
}