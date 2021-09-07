export let mousePos = {x: null, y: null};
function handleMouseMove(e){
    mousePos.x = e.clientX, mousePos.y = e.clientY;
}
addEventListener('mousemove', handleMouseMove);