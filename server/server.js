const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const moment = require('moment');

const port = 5000;
const app = express();

app.use(cors());

app.listen(port, function () {
    console.log(`Server is running on ${port} port`);
});

app.get('/jornal-datas', function (req, res) {
    try {
        let workbook = XLSX.readFile("data/dados.xlsx", {type: "binary"});
        let workbookJSON = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, {raw:true, defval:null});
        
        let counters = {}
        const now = moment("2016-10-19");

        for(let register of workbookJSON) {
            // criando uma variavel pro codigo ficar limpo
            let candidato = register.candidato.toLowerCase();

            // criando a propriedade com o nome do candidato dentro do json
            if(!counters[candidato]) {
                counters[candidato] = {
                    total: 0,
                    last_week: 0,
                    src: {}
                };
            }

            // contando o total
            counters[candidato].total++;

            // contando se tiver menos que 7 dias depois que foi publicado
            if (now.diff(register.date_published) <= 7) {
                counters[candidato].last_week++;
            }

            // contando as fontes de cada noticia
            if(!counters[candidato].src[register.source]) {
                counters[candidato].src[register.source] = 1;
            } else {
                counters[candidato].src[register.source]++;
            }
        }
        
        res.json(counters);
    } catch(e) {
        res.send('<h1>DEU MERDA :(</h1>');
    }
});