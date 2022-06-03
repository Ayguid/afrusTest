// Problema 1:
const multiplicar = (x, y) => {
    if (x == 1) { return y; }
    else if (x > 1) {
        return y + multiplicar(x - 1, y);
    }
    else throw "No son números";// es importante validar que son números
}

// Problema 2.0:
const pokeByType = async (typeParam) => {
    if (typeof typeParam == "string") {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${typeParam}/`);
            const pokemon = await response.json();
            return pokemon;
        } catch (err) {
            console.log(err)
        } finally { }
    }
    else throw "El parámetro debe ser del tipo 'String'";
}

// Problema 2.1: usa la function anterior
const pokemonsWithBothTypes = async (typeParam1, typeParam2) => {
    // pense en pasar un array y hacerlo para todos los que se pasen, como en el ej 2.4
    const results = await Promise.all([
        pokeByType(typeParam1),
        pokeByType(typeParam2)
    ]);
    //console.log(results)
    //la respuesta devuelve un array con dos objetos
    const arr1 = results[0].pokemon;
    const arr2 = results[1].pokemon;
    //unos los dos arrays y me quedo con los duplicados, no es lo mas pretty,,,,
    const arrMerge = arr1.concat(arr2);
    const result = arrMerge.filter((thing, index, self) =>
        index !== self.findIndex((t) => (
            t.pokemon.name == thing.pokemon.name
        ))
    )
    return result;
}

// Problema 2.2:
const fetchPokemon = async (name) => {
    if (typeof name == "string") {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
            const pokemon = await response.json();
            return pokemon;
        } catch (err) {
            console.log(err)
        } finally { }
    }
    else throw "El parámetro debe ser del tipo 'String'";
}

// Problema 2.3: usa la function anterior
const fetchStats = async (name) => {
    const pokemon = await fetchPokemon(name);
    //devuelvo un objeto porque el ej asi lo pide, sino es raro envolver la res en un objeto mas
    return {
        name: name,
        stats: pokemon.stats
    };
}

// Problema 2.4: usa la functions anteriores
const pokesOrderBy = async (idsArray, orderParam) => {
    //si pasan un ordenador no valido,,,,chau
    if (!["weight", "name", "type"].includes(orderParam)) throw 'Not a valid ordenator';
    //sacamos los duplicados si llegaran en el array
    idsArray = [...new Set(idsArray)]; // unique ids
    let results = await Promise.all(idsArray.map(url => {
        return fetchPokemon(url)
    }));
    switch (orderParam) {
        case 'weight':
            results = results.sort((a, b) => a.weight - b.weight)
            break;
        case 'name':
            results = results.sort((a, b) => a.name.localeCompare(b.name))
            break;
        case 'type':
            // esta pàrte es rara porque los ordeno segun el nombre del primer type que tienen,,,,,
            results = results.sort((a, b) => a.types[0].type.name.localeCompare(b.types[0].type.name))
            break;
    }
    return results;
}


// Problema 4:
const arrayDetective = (array) => {
    const odds = array.filter(num => num % 2)
    const oddsPercent = odds.length / array.length * 100;
    const evenPercent = 100 - oddsPercent;
    const percentAboveThousand = array.filter(num => num > 1000).length / array.length * 100;
    const highestNum = Math.max(...array);
    const lowestNum = Math.min(...array);
    const average = (array.reduce((a, b) => a + b, 0) / array.length) || 0;
    //return final
    return {
        givenArray: array,
        oddPercent: `${oddsPercent}%`,
        evenPercent: `${evenPercent}%`,
        percentAboveThousand: `${percentAboveThousand}%`,
        highestNum: highestNum,
        lowestNum: lowestNum,
        highesNumPercent: {
            arrayAvg: average,
            highestNum: highestNum,
            lowestNum: lowestNum,
            lowestNumPercent: `${(lowestNum / highestNum) * 100}%`,
            averagePercent: `${(average / highestNum) * 100}%`,
        }
    }

}


// Problema 6:
const search_form = document.getElementById("search_form");
const spinner = document.getElementById("spinner");
search_form.onsubmit = async (event) => {
    const query = search_form['name'].value;
    event.preventDefault();
    if (query.length == 0) return;
    try {
        spinner.removeAttribute('hidden');
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}/`);
        const pokemon = await response.json();
        const divPoke = `
		<div class="card-container">
			<img class="round" src="${pokemon?.sprites?.front_default}" alt="pokemon_sprite" />
			<h3>${pokemon?.name}</h3>
			<h6>Id: ${pokemon?.id}</h6>
			<h6>Type: ${pokemon?.types[0]?.type?.name}</h6>
			<h6>Weight: ${pokemon?.weight} </h6>
			<h6>Height: ${pokemon?.height}</h6>
		</div>`
        search_form['name'].value = ""
        document.getElementById("pokemon_container").innerHTML = divPoke
    } catch (err) {
        console.log(err)
    } finally {
        spinner.setAttribute('hidden', '');
    }
}

///////////// Execs ////////////////////
//exec ej1
const resultado = multiplicar(4, 1); // probar cambiando los parámetros
console.log("El resultado de la multiplicación es:", resultado);

//exec ej2.0 con el type grass
/*
pokeByType(param = "grass").then(pokemons => { //cambiar los parámetros para probar
    console.log(`Problema 2.0: La cantidad de pokemones para el tipo ${param} es`, pokemons.pokemon.length);
});
*/

//exec ej2.1
/*
pokemonsWithBothTypes(param = "fire", param2 = "ghost").then(pokemons => { //cambiar los parámetros para probar
    console.log(`Problema 2.1: La cantidad de pokemones que son de tipo ${param} y ${param2} es de `, pokemons.length, pokemons);
});
*/

//exec ej2.2 con el nombre charmander
/*
fetchPokemon(param = "charmander").then(pokemon => { //cambiar los parámetros para probar
    console.log(`Problema 2.2: El id del pokemon ${param} es`, pokemon.id, `, El order es:`, pokemon.order);
});
*/

//exec ej2.3 con el name charmander
/*
fetchStats(param = "charmander").then(resp => { //cambiar los parámetros para probar
    console.log(`Problema 2.3: Las stats del pokemon ${param} son`, resp);
});
*/

//exec ej2.4 con [] ids ,,, de strings!!!
/*
pokesOrderBy(param = ["7", "2", "1"], param2 = "type").then(resp => { //cambiar los parámetros para probar
    console.log(`Problema 2.4:`, resp);
});
*/

//exec ej4
/*
console.log("El resultado al problema 4 es:", arrayDetective([100, 200, 300, 200, 1199]));
*/
