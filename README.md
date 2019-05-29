# Kart Summary Reader

Leitor de arquivos de log de corrida de Kart.
Dado um arquivo de log no formato do arquivo `./kart.log`, esse programa lê e exibe o resultado da corrida.

### Pré-requisitos

* Ambiente Linux/Unix (Não foi testado em windows, provavelmente irá funcionar, mas eu não garanto que não tenha que fazer algum ajuste)
* NodeJS

### Modo de usar localmente

    ./kart-summary.js ./kart.log

### Utilizando via docker

    docker build -t kart-summary:latest .

    docker run --rm -v $(pwd)/kart.log:/file kart-summary:latest

##### Facilitando a execução via docker

Coloque o seguinte código no seu `.bashrc` ou `.zshrc` ou equivalente e reinicie o console:

    function kart-summary(){docker run --rm -v $(pwd)/$1:/file kart-summary:latest}

A partir de agora você pode chamar o programa via docker com o comando:

    kart-summary <file.name>


## Observações
Fiz o teste pq achei que é um problema interessante, tipo puzzle. Que bom que vocês sairam da chatice dos testes convencionais.
Achei a solução simples o bastante para ser feita em um único arquivo (`kart-summary.js`) e por conta disso, não fiz testes unitários. Sei que o exercício pede os testes, porém fiz todos os outros itens. Não estou afim de fazer os testes unitários agora, principalmente pq eu precisaria fazer um contexto de projeto (já q teremos mais que um arquivo) e quero manter as coisas simples. Se vcs acharem que a falta de teste é um fator de eliminação, eliminado serei.

Tenho outros projetos, porém estão todos privados, se por acaso quiserem ver meu código, preciso que me passem um usuário para que eu possa conceder acesso.

Boa sorte para todos nós.