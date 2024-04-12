let block = document.getElementById('plank');
let point = document.getElementById('circle');
let range = document.getElementById('range');
let submit = document.getElementById('submt');
let rangeVal = document.getElementById('rangeVal')
let arr = [];
let bestPath = [];
let bestDistance =[];
rangeVal.innerHTML = range.value;
function slider(upt, set_upt,key) {
    upt.addEventListener('input', function() {
        if(key>=1){
            set_upt.innerHTML = upt.value;
        }else{
            set_upt.innerHTML = '0.' + upt.value;
        }
    });
}

slider(range,rangeVal,1);
//обновление ферамонов
let update = document.getElementById('update');
let set_update = document.getElementById('set_update');
slider(update, set_update,1);
//вес расстояний
let Beta = document.getElementById('beta');
let set_Beta = document.getElementById('set_beta');
slider(Beta,set_Beta,1); 
//скорость испарения ферамонов
let speed = document.getElementById('speed');
let set_speed = document.getElementById('set_speed');
slider(speed,set_speed,0.1);
//количество прохождений
let Count = document.getElementById('count');
let set_count = document.getElementById('set_count');
slider(Count,set_count,1);


class Coords {
    constructor(x, y) {
        this.x = Math.min(Math.max(x, 10), 295);
        this.y = Math.min(Math.max(y, 10), 295);
    }
}
let dots = new Coords(0, 0);
function mouseMove(event) {
   
    let x = event.clientX - (point.offsetWidth / 2);
    let y = event.clientY - (point.offsetHeight / 2);


    dots = new Coords(x, y);

  
    arr.push([dots.x, dots.y]);

    let clone = point.cloneNode(true);
    setCoords(dots.x, dots.y, clone);
    block.appendChild(clone);

}
block.addEventListener('click', function(event) {
    if (event.target === block) {
        mouseMove(event);
    }
});

document.addEventListener('mousedown', function(event) {
    if (event.target === block) {
        document.addEventListener('mousemove', mouseMove);
    }
});

document.addEventListener('mouseup', function(event) {
    document.removeEventListener('mousemove', mouseMove);
});


submit.addEventListener('click',function(event){
    ants_algor(arr);
    draw_lines(bestPath,arr);
    console.log('успешно');
});

function ants_algor(arr){
    let distances = find_dist(arr);
    let numCities = distances.length; // Количество городов
    let alpha = 1.0;
    let beta = parseInt(Beta.value); // Вес расстояния
    let evaporation = parseFloat(speed.value/10); // Скорость испарения феромона
    let Q = parseInt(update.value); // Параметр Q для обновления феромонов
    let antsCount = numCities; // Количество муравьев
    let count = parseInt(Count.value);
    let antColony = new AntColony(numCities, distances, alpha, beta, evaporation, Q, antsCount);

    
    antColony.run(count);

    // Получение лучшего найденного пути и его длины
     bestPath = antColony.get_best_path();
     bestDistance = antColony.get_best_distance();
    
    // Вывод результатов
    //console.log("Best path:", bestPath.join(" "));
    //console.log("Best distance:", bestDistance);
}