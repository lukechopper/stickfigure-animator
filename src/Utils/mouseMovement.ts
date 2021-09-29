export let mousePos:{x:number,y:number} = {x: window.innerWidth / 2, y: window.innerHeight / 2};
//So that through 'mousePos' we have access to the current mouse coordinates at any point in the application
export function handleMouseMove(e:MouseEvent){
    mousePos.x = e.clientX, mousePos.y = e.clientY;
}
