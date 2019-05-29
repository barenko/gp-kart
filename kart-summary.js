#!/usr/bin/env node
'use strict';

//imports
const fs = require('fs');
const readline = require('readline');

//nao separei em outro arquivo pq a solução é muito simples e não é necessário criar nenhuma estrutura adicional, de qualquer modo eu já deixei modularizado
const Fmt = {
    lPad:(value, size, char=" ")=>{
        let v = ""+value;
        let delta = size-v.length;
        if(delta < 0) return v.substr(0,size);
        return char.repeat(delta)+v;
    },
    
    rPad: (value, size, char=" ")=>{
        let v = ""+value;
        let delta = size-v.length;
        if(delta < 0) return v.substr(0,size);
        return v+char.repeat(delta);
    },
    
    time: (deltaMs) => {
        if(deltaMs < 0) return '--:--:--.---';
        return new Date(deltaMs).toJSON().replace(/.+T(.+)Z/,"$1")
    }    
}

//Obtém o timestamp de um tempo no formato 00:00.000
function getTime(timeStr){
    let token = timeStr.split(/[:.]/).map(i=>parseInt(i));
    return token[2]+token[1]*1000+token[0]*60000;
}

//Processa um registro do arquivo de log
function addKartData(map, header, line){
    let pilot = line[header.Piloto].split(/\s+\S\s+/);
    let code = pilot[0];
    let currLapTime = getTime(line[header['Tempo Volta']])
    let currVelocity = parseFloat(line[header['Velocidade média da volta']].replace(',', '.'))
    let currData = map.get(code) || {
                                    code, 
                                    name: pilot[1], 
                                    completedLaps:0, 
                                    totalTime:0, 
                                    bestLap:currLapTime, 
                                    velocity:0
                                };

    currData.velocity = (currVelocity + currData.velocity*currData.completedLaps) / (currData.completedLaps+1);
    currData.completedLaps += 1
    currData.totalTime += currLapTime;
    if(currData.bestLap > currLapTime) currData.bestLap = currLapTime;

    map.set(code, currData)
}


//Lê o arquivo linha a linha e gera o relatório do resultado
function main(file, laps=4){
    const kart = new Map();
    let header;
    const input = fs.createReadStream(file, { encoding: 'utf8' });

    readline.createInterface({ input })
    .on('line', line =>{
        let tokens = line.split(/\s{2,}/)
        if(!header){
            header = tokens.reduce((acc,v,i)=>{acc[v] = i; return acc;}, {})
        } else {
            addKartData(kart, header, tokens)
        }
    })
    .on('close', ()=>{
        function rankRule(a, b){
            if(a.completedLaps > b.completedLaps) return -1;
            if(a.completedLaps < b.completedLaps) return 1;
            if(a.totalTime < b.totalTime) return -1;
            return 1;
        }
        let ranking = Array.from(kart.values()).sort(rankRule);
        let bestTime;
        let position=0;
        let bestLap;
        let results = ranking.map(r=>{
            if(!bestTime){
                bestTime = r.totalTime
                r.deltaTime = 0;
            } else {
                if(r.completedLaps == laps){
                    r.deltaTime = r.totalTime-bestTime
                }else{
                    r.deltaTime = -1
                    r.totalTime = -1
                }
            }

            if(!bestLap || bestLap.time > r.bestLap) bestLap = {time: r.bestLap, code: r.code, name: r.name}

            r.position = ++position
            return r;
        });

        console.log("Resultados da corrida:\n")
        console.log(`Vencedor: ${results[0].code} ${results[0].name}`)
        console.log(`Tempo de prova: ${Fmt.time(results[0].totalTime)}`)
        console.log(`Melhor volta: ${Fmt.time(bestLap.time)} (${bestLap.code} ${bestLap.name})`)
        console.log("\nRanking:")
        console.log("Posição  Piloto             Num. voltas  Diferença     Tempo total   Melhor volta  Veloc.Média")
        results.forEach(r=>console.log(`${Fmt.lPad(r.position, 7)}  ${Fmt.rPad(r.code+" "+r.name, 20)}  ${Fmt.lPad(r.completedLaps, 8)}  ${Fmt.time(r.deltaTime)}  ${Fmt.time(r.totalTime)}  ${Fmt.time(r.bestLap)}  ${Fmt.lPad(r.velocity, 7)}Km/h`))
    })
};


//O programa começa por aqui.
if(process.argv.length == 3){
    main(process.argv[2]);
} else {
    console.log("Command instructions:")
    console.log("./kart-summary.js <filename.log>")
}

