export let mousePos = {x: window.innerWidth / 2, y: window.innerHeight / 2};
function handleMouseMove(e){
    mousePos.x = e.clientX, mousePos.y = e.clientY;
}
addEventListener('mousemove', handleMouseMove);