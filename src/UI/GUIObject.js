import {ctx, canvas} from '../Utils/canvasInfo';
import {pushToCheckPointTracker} from '../UI';
import {mousePos} from '../Utils/mouseMovement';

export function GUIPath(startingPoint, edges, label){
    this.startingPoint = startingPoint;
    this.edges = edges;
    this.label = label;
    this.draw = () => {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        edges.forEach(edge => {
            this.startingPoint.x += edge.x, this.startingPoint.y += edge.y;
            ctx.lineTo(this.startingPoint.x, this.startingPoint.y);
        });
        let inside = ctx.isPointInPath(mousePos.x, mousePos.y);
        pushToCheckPointTracker({checked: inside, label: this.label});
        ctx.closePath();
        if(inside){
            ctx.fillStyle = 'gold'; ctx.globalAlpha = 0.5;
        }else{
            ctx.fillStyle = '#005ce6';
        }
        ctx.fill();
        ctx.restore();
    }
}


export function ArcFill(startingPoint, radius, label){
    this.startingPoint = startingPoint;
    this.radius = radius;
    this.label = label;
    this.selected = false;
    this.draw = () => {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.startingPoint.x, this.startingPoint.y, this.radius, Math.PI * 2, false);
        let inside = ctx.isPointInPath(mousePos.x, mousePos.y), overlap = false;
        if((this.startingPoint.x + this.radius) > canvas.width - 65 || (this.startingPoint.x - this.radius) <  65){
            overlap = true;
        }
        if(mousePos.x < canvas.width - 65 && mousePos.x >  65){
            pushToCheckPointTracker({checked: inside, label: this.label, overlap, canClick: true});
        }else{
            pushToCheckPointTracker({checked: false, label: this.label, overlap, canClick: false});
        }
        
        if(this.selected){
            ctx.fillStyle = 'gold'; ctx.globalAlpha = 0.5;
        }else{
            if(inside){
                if(mousePos.x < canvas.width - 65 && mousePos.x >  65){
                    ctx.globalAlpha = 0.4;
                }
            }
            ctx.fillStyle = '#005ce6';
        }
        ctx.fill();
        ctx.restore();
    };
}

export function ScrollBarStroke(startingPoint, endingPoint, forceSelection = false){
    this.startingPoint = startingPoint;
    this.endingPoint = endingPoint;
    this.forceSelection = forceSelection;
    this.draw = () => {
        ctx.beginPath();
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.endingPoint.x, this.endingPoint.y);
        let inside = false;
        if(mousePos.x > this.startingPoint.x && mousePos.x < this.endingPoint.x
        && mousePos.y > (this.startingPoint.y - 5) && mousePos.y < (this.startingPoint.y + 5)){
            inside = true;
        }
        pushToCheckPointTracker({checked: inside, label: 'scrollBar'});
        if(inside || this.forceSelection){
            ctx.strokeStyle = '#808080';
        }else{
            ctx.strokeStyle = '#cccccc';
        }
        ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.stroke();
    };
};