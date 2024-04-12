let inf = 1e9;

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
        this.best_path = [];
        this.best_distance = inf;
    }
    run(num_iteration) {
        for(let iter = 0; iter < num_iteration; ++iter){
            let ant_paths = new Array(this.ants_count).fill().map(() => new Array(this.n).fill());
            let ant_distances = new Array(this.ants_count).fill(0.0);

        //Перемещение муравьев
        
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

            //найти наилучший путь
            for(let ant = 0; ant < this.ants_count; ++ant){
                if(ant_distances[ant] < this.best_distance){
                    this.best_distance = ant_distances[ant];
                    this.best_path = ant_paths[ant];
                }
            } 
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

    get_best_path(){
        return this.best_path;
    }

    get_best_distance(){
        return this.best_distance;
    }
}