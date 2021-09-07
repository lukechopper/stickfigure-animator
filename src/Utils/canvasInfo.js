export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
addEventListener('resize', resizeCanvas);

export function fractionOfCanvas(fraction){
    return{
        width: canvas.width / fraction,
        height: canvas.height / fraction
    }
}