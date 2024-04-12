
function slider(upt, set_upt,key) {
    upt.addEventListener('input', function() {
        if(key>=1){
            set_upt.innerHTML = upt.value;
        }else{
            set_upt.innerHTML = '0.' + upt.value;
        }
    });
}

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


function mouseMove(event) {
    let rect = block.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    arr.push([x, y]);
    generate_circle(x, y);
}

block.addEventListener('click', function(event) {
    if (event.target === block) {
        mouseMove(event);
    }
});

// document.addEventListener('mousedown', function(event) {
//     if (event.target === block) {
//         document.addEventListener('mousemove', mouseMove);
//     }
// });

// document.addEventListener('mouseup', function(event) {
//     document.removeEventListener('mousemove', mouseMove);
// });


submit.addEventListener('click',function(event){
    run_ants_algor(arr);
});

function run_ants_algor(arr){
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
    bestDistance = antColony.get_best_distance();
}