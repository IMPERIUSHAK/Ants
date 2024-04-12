let line = document.getElementById('line');

function setCoords(x, y, clone) {

    clone.style.width = range.value +'px';
    clone.style.height = range.value+'px';
    clone.style.position = 'absolute';
    clone.style.left = x + 'px';
    clone.style.top = y + 'px';
    clone.style.backgroundColor = "red";

    rangeVal.innerHTML = range.value;
}

function set_line(x, y, length, rotate, draw) {
    draw.style.backgroundColor = 'black';
    draw.style.position = 'absolute';
    draw.style.left = x + 'px';
    draw.style.top = y + 'px';
    draw.style.width = length + 'px';
    draw.style.height = 4 + 'px';
    draw.style.transformOrigin = 'top left';
    draw.style.transform = 'rotate(' + rotate + 'deg)';

}
function draw_lines(best_path,arr){

    line.innerHTML = '';
    let x=0,x1=0,y=0,y1=0;
    let rotate = 0;
    let length = 0;
    for(let i = 0; i < best_path.length-1; ++i){

        x = arr[bestPath[i]][0];
        y = arr[bestPath[i]][1];
        x1 = arr[bestPath[i+1]][0];
        y1 =arr[bestPath[i+1]][1];

        length = Math.sqrt(Math.pow(x-x1,2) + Math.pow(y-y1,2));

        rotate =  Math.atan2(y1 - y, x1 - x) * 180 / Math.PI;

        let draw = line.cloneNode(true);
        set_line(x,y,length,rotate,draw);
        block.appendChild(draw);
    }
    x = arr[0][0];
    y = arr[0][1];
    x1 = arr[bestPath[best_path.length-1]][0];
    y1 = arr[bestPath[best_path.length-1]][1];

    length = Math.sqrt(Math.pow(x-x1,2) + Math.pow(y-y1,2));

    rotate =  Math.atan2(y1 - y, x1 - x) * 180 / Math.PI;

    let draw = line.cloneNode(true);
    set_line(x,y,length,rotate,draw);
    block.appendChild(draw);
}