let inf = 1e9;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function generate_circle(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.fillStyle = "rgb(204, 204, 172)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
    ctx.shadowBlur = 5; 
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2; 
    ctx.fill();
}

function generate_line(x,y,x1,y1,r,g,b){
    ctx.lineWidth = 5;
    ctx.beginPath(); // Начинаем новый путь
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = 'rgb('+r+','+g+','+b+')'; // Задаем цвет линии
    ctx.stroke(); // Рисуем линию
}

function update_circles(){
    for(let i = 0; i < bestPath.length-1; ++i){
        let x = arr[bestPath[i]][0];
        let y = arr[bestPath[i]][1];
        let x1 = arr[bestPath[i+1]][0];
        let y1 = arr[bestPath[i+1]][1];
        generate_circle(x, y); // Рисуем круги сначала
        generate_circle(x1, y1);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, block.width, block.height);
    console.log('worked');
}

function connect_gens(r,g,b){

    clearCanvas();

    for(let i = 0; i < bestPath.length-1; ++i){
        let x = arr[bestPath[i]][0];
        let y = arr[bestPath[i]][1];
        let x1 = arr[bestPath[i+1]][0]; // Corrected from [1] to [0]
        let y1 = arr[bestPath[i+1]][1]; // Corrected from [0] to [1]
        generate_line(x, y, x1, y1,r,g,b);
    }
    x = arr[bestPath[0]][0];
    y = arr[bestPath[0]][1];
    x1 = arr[bestPath[bestPath.length-1]][0];
    y1 = arr[bestPath[bestPath.length-1]][1];
    generate_line(x, y, x1, y1,r,g,b);

    update_circles();
    console.log('worked');
}

function find_dist(cities){
    let length = cities.length;
    let dist = new Array(length).fill().map(() => new Array(length).fill(0));

    for(let i = 0; i < length; ++i){
        for(let j = 0; j < length; ++j){
            dist[i][j] = Math.sqrt(Math.pow((cities[i][0] - cities[j][0]), 2) + Math.pow((cities[i][1] - cities[j][1]), 2));
        }
    }
    return dist;
}

class AntColony {
    constructor(num_cities, dist_matrix, alpha, beta, evaporation, q, ant_count) {
        this.n = num_cities; // количество городов
        this.distances = dist_matrix;
        this.pheromone = new Array(num_cities).fill().map(() => new Array(num_cities).fill(1.0));
        this.alpha = alpha; 
        this.beta = beta;
        this.evaporation = evaporation; // скорость испарения феромона
        this.Q = q; // параметр Q для обновления феромонов
        this.ants_count = ant_count;
        this.best_distance = inf;
    }

    rand_num(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async find_best_path(ant_distances,ant_paths){
        for(let ant = 0; ant < this.ants_count; ++ant){
            if(ant_distances[ant] < this.best_distance){
                this.best_distance = ant_distances[ant];
                bestPath = ant_paths[ant];
                console.log(bestPath);
            }
        }
    }
    async run(num_iteration) {
        for(let iter = 0; iter < num_iteration; ++iter){
            let ant_paths = new Array(this.ants_count).fill().map(() => new Array(this.n).fill());
            let ant_distances = new Array(this.ants_count).fill(0.0);

        
            for(let ant = 0; ant < this.ants_count; ++ant){

                let visited = new Array(this.n).fill(0.0);
                visited[0] = 1;
                ant_paths[ant][0] = 0;

                for(let i = 1; i < this.n; ++i){

                    let current_city = ant_paths[ant][i-1];
                    let next_city = this.choose_next_city(current_city,visited);
                    ant_paths[ant][i] = next_city;
                    visited[next_city] = 1;
                    ant_distances[ant] += this.distances[current_city][next_city];

                }

                //вернуться в начальный город 
                ant_distances[ant] += this.distances[ant_paths[ant][this.n-1]][0];
            }

            //обновление феромонов
            for(let i = 0; i < this.n; ++i){
                for(let j = 0; j < this.n;++j){
                    if(i!=j){
                        this.pheromone[i][j] *= (1.0 - this.evaporation);
                        if(this.pheromone[i][j]<0.0){
                            this.pheromone[i][j] = 1.0;
                        }
                    }
                }
            }

            //добавление феромонов по лучшему пути каждого муравья
            for(let ant = 0; ant < this.ants_count; ++ant){
                for(let i = 0; i < this.n - 1; ++i){
                    let city1 = ant_paths[ant][i];
                    let city2 = ant_paths[ant][i + 1];
                    this.pheromone[city1][city2] +=this.Q/ant_distances[ant];
                } 
            }

            this.find_best_path(ant_distances,ant_paths);
            
            let r = this.rand_num(0,255);
            let g = this.rand_num(0,255);
            let b = this.rand_num(0,255);

            await sleep(200);
            connect_gens(r,g,b);
        }
    }
    choose_next_city(current_city,visited){
        let probabilities = new Array(this.n).fill(0.0);
        let total_prob = 0.0;

        //вычисление вероятностей для доступных городов 
        for(let i = 0; i < this.n; ++i){
            if(!visited[i]){
                probabilities[i] = Math.pow(this.pheromone[current_city][i],this.alpha)*Math.pow((1.0/this.distances[current_city][i]),this.beta);
                total_prob += probabilities[i];
            }
        }

        //выбор следующего города согласно вероятностям
        let rand_val = Math.random();
        let sum = 0.0;
        for(let i = 0; i < this.n; ++i){
            if(!visited[i]){
                sum += probabilities[i]/total_prob;
                if(sum > rand_val){
                    return i;
                }
            }
        }

        //в случае ошибки выводим 1 город
        for (let i = 0; i < this.n; ++i) {
            if (!visited[i]) {
                return i;
            }
        }
    }

    get_best_distance(){
        return this.best_distance;
    }
}