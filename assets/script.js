const chNew = new BroadcastChannel('broadcast'); //BroadcastChannel para receber mensagens da dock

chNew.onmessage = async (e) => { //Função para receber mensagens do BroadcastChannel e executar a função adequada 
    if (e.data.title) { //Mensagem contendo title
        addTitle(e.data.title);
    } else if (e.data.bottomline) { //Mensagem contendo bottomline
        showBottomline();
        getWeather();
    } else if (e.data.gc) { //Mensagem contendo gerador de caracteres
        let name = e.data.gc.name;
        let desc = e.data.gc.desc;
        showGC(name, desc); //Função para mostrar o gerador de caracteres
    } else if (e.data.link) { //Mensagem contendo link
        let title = e.data.link.title;
        let url = await shortner(e.data.link.url);
        showForm(title, url);
    }
}

function addTitle(info) { //Função para trocar o título do evento
    let txtTitle = document.getElementById('title_txt')
    function switchTitle() {
        txtTitle.innerText = info
        txtTitle.className = 'stage_1';
    }
    if (txtTitle.className === 'stage_1' && txtTitle.innerText !== info) {
        txtTitle.className = 'stage_0';
        setTimeout(switchTitle, 400);
    } else {
        switchTitle();
        txtTitle.className = 'stage_1';
    }
}

async function shortner(site) {

    if (!(site.includes('http://') || site.includes('https://'))) {
        site = 'http://' + site
    }

    const url = 'https://url-shortener-service.p.rapidapi.com/shorten';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '8e0c799f10mshaa6a0eb0e70e63ep1d6116jsn200759d16a22',
            'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com'
        },
        body: new URLSearchParams({
            url: site
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return result.slice(15, -2).split('\\').join(''); //Retira as aspas e as barras do resultado por meio de gambiarra
    } catch (error) {
        console.error(error);
        return null;
    }
}

function showGC(name, desc) { //Função para mostrar o gerador de caracteres

    if (name === undefined) { //Se a função for chamada sem parâmetros, apenas troca o estado do GC
        if (gcBgBottom.classList.contains('stage_0')) {
            gcBgBottom.classList.replace('stage_0', 'stage_1');
            gcBgTop.classList.replace('stage_0', 'stage_1');
            gcName.classList.replace('stage_0', 'stage_1');
            gcDesc.classList.replace('stage_0', 'stage_1');
            gcBgImage.classList.replace('stage_0', 'stage_1');
        }

        else if (gcBgBottom.classList.contains('stage_1')) {
            gcBgBottom.classList.replace('stage_1', 'stage_0');
            gcBgTop.classList.replace('stage_1', 'stage_0');
            gcName.classList.replace('stage_1', 'stage_0');
            gcDesc.classList.replace('stage_1', 'stage_0');
            gcBgImage.classList.replace('stage_1', 'stage_0');
        }
    } else { //Se a função for chamada com parâmetros, troca o estado do GC e atualiza o nome e a descrição
        gcBgImage = document.getElementById('gc_bg_image');
        gcBgBottom = document.getElementById('gc_bg_bottom');
        gcBgTop = document.getElementById('gc_bg_top');
        gcName = document.getElementById('gc_name');
        gcDesc = document.getElementById('gc_desc');

        gcName.innerText = name;
        gcDesc.innerText = desc;

        if (gcBgBottom.classList.contains('stage_0')) {
            gcBgBottom.classList.replace('stage_0', 'stage_1');
            gcBgTop.classList.replace('stage_0', 'stage_1');
            gcName.classList.replace('stage_0', 'stage_1');
            gcDesc.classList.replace('stage_0', 'stage_1');
            gcBgImage.classList.replace('stage_0', 'stage_1');
        }

        else if (gcBgBottom.classList.contains('stage_1')) {
            gcBgBottom.classList.replace('stage_1', 'stage_0');
            gcBgTop.classList.replace('stage_1', 'stage_0');
            gcName.classList.replace('stage_1', 'stage_0');
            gcDesc.classList.replace('stage_1', 'stage_0');
            gcBgImage.classList.replace('stage_1', 'stage_0');
        }
    }
}

function showBottomline() { //Função para mostrar e ocultar a bottomline
    let btln = document.getElementById('bottomline');
    if (btln.className === 'bottomline_stage_1') {
        btln.className = 'bottomline_stage_0';
    } else {
        btln.className = 'bottomline_stage_1';
    }
}

function showForm(title, url) {
    divTitle = document.getElementById('link-title');
    divQr = document.getElementById('link-qr').firstChild;
    divUrl = document.getElementById('link-url');

    divTitle.innerText = title;
    divUrl.innerText = url.slice(8);
    divQr.src = ('https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=015791&data=' + url);

    if (gcBgBottom.classList.contains('stage_1')) { //Se o GC estiver ativo, oculta o GC e mostra o link
        showGC();
        setTimeout(function() {if (link.classList.contains('stage1')) {
            link.classList.replace('stage1', 'stage2');
        } else {
            link.classList.replace('stage2', 'stage1');
        }}, 1500); //Repete a função após 8 segundo
    } else { //Se o GC estiver oculto, mostra o link
        if (link.classList.contains('stage1')) {
            link.classList.replace('stage1', 'stage2');
        } else {
            link.classList.replace('stage2', 'stage1');
        }
    }
}

function getWeather() { //Função para atualizar a temperatura na bottomline
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=-29.697982672747866&lon=-52.438414170073266&units=metric&appid=bc3da86c3b1cc90c6c22c1256b09ab5e";
    function updateWeather() {
        fetch(url)
        .then(function(response) {return response.json();})
        .then(function(data) {
            document.getElementById('weather').innerHTML = Math.round(data.main.temp) + "°C";
            const iconUrl = "assets/bl/weather/" + data.weather[0].icon + ".png";
            document.getElementById('weather_icon').src = iconUrl;
        })
        console.log('teperatura atualizada');
        setTimeout(updateWeather, 1800000); //Repete a função a cada 30 minutos
    }
    updateWeather();
}

function getClock() { //Função para atualizar o relógio na bottomline
    const date = new Date();
    const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const time = hours + ":" + minutes;
    document.getElementById('time').innerText = time;
    setTimeout(getClock, 1000); //Repete a função a cada 1 segundo
}

function getNews() { //Função para atualizar as notícias
    var proxy = "https://cors-proxy.fringe.zone/";
    var url = "https://www.unisc.br/pt/noticias?format=feed&type=atom";
    scraper = function (url) {
        let x = new XMLHttpRequest();
        x.onreadystatechange = function () {
            if (this.readyState == 4 &&
                this.status == 200) {

                let response = this.responseText;

                parser = new DOMParser();
                xmlDoc = parser.parseFromString(response, "text/html");

                // pega a somente a informação que está dentro da tag <title>
                let regex = /<title>(.+)<\/title>/gm;
                // o operador spread (...) converte o objeto em um array
                let res = [...response.matchAll(regex)];

                // mapeia o resultado para um array, pegando apenas o segundo elemento de cada array aninhado
                // e junta os elementos em uma string separados por quebra de linha
                let titles = res.map((title) => `<p>${title[1]}</p>`).join("\n");

                // insere o resultado na DOM
                document.getElementById("news-container").innerHTML = titles;
            }
        }

        x.open("GET", url);
        x.send();
    }
    scraper(proxy + url);

    let n = 0;
    newsSwitch();
    setInterval(newsSwitch,9000);    //Repete a função a cada 9 segundos

    function newsSwitch() { //Função para alternar as notícias
        news = document.getElementById('news-container');
        
        switch (n) {
            case 0:
                news.classList.replace('stage5', 'stage1');
                animate(news.children.item(n))
                n++;

                break;
            case 1:
                news.classList.replace('stage1', 'stage2');
                animate(news.children.item(n))
                n++;
                
                break;
            case 2:
                news.classList.replace('stage2', 'stage3');
                animate(news.children.item(n))
                n++;
                
                break;
            case 3:
                news.classList.replace('stage3', 'stage4');
                animate(news.children.item(n))
                n++;
                
                break;
            case 4:
                news.classList.replace('stage4', 'stage5');
                animate(news.children.item(n))
                n = 0;
                
                break;

            default:
                console.log('Erro: a variável "n" não é um número válido');
                
                break;
        }
    }

    function animate(noticia) { //Função para verificar se a notícia é maior que a tela e animar o texto
       if (noticia.scrollWidth > 1041) {
        noticia.style = `
            transform: translateX(-${(noticia.scrollWidth - 1040)}px);
            transition: all 7s ease-in-out;
            transition-delay: 1s;
            `;

            setTimeout(function () {
                let newStyle = ` `;
                noticia.style = newStyle;
            }, 11000);
        } else {
            // posiciona o texto no centro da tela
            let newStyle = ` 
            transform: translateX(${(1041 - noticia.scrollWidth) / 2}px);
            `;
            
            noticia.style = newStyle;
        }
    }
}

