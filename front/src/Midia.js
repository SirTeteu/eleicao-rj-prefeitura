import React from 'react';

import PieChart from './PieChart';
import { getJornalData } from './api';

class Midia extends React.Component {
    state = {
        crivella: {},
        freixo: {}
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        getJornalData().then(data => this.setState(data.data, () => console.log(this.state)));
    }

    generateTopSource = sources => {
        if(sources) {
            let sourceArray = [];
            for(let source in sources) {
                sourceArray.push({name: source, number: sources[source]});
            }

            sourceArray.sort((a,b) => b.number - a.number);
            
            let topSource = sourceArray.slice(0, 4);
            let rest = sourceArray.slice(4);
            let total = rest.reduce((total, atual) => total += atual.number, 0);
            topSource.push({name: 'outros', number: total});

            return topSource;
        }

        return [];
    }

    render() {
        const total = [
            { name: 'Crivella', number: this.state.crivella.total },
            { name: 'Freixo', number: this.state.freixo.total }
        ];
        const crivella_src = this.generateTopSource(this.state.crivella.src);

        return(
            <div>
                <h2>Dados da Eleição na mídia</h2>

                <h3>Total de notícias dos candidatos</h3>
                <PieChart width={300} height={300} data={total}/>

                <h3>Jornais que mais publicaram sobre Crivella</h3>
                <PieChart width={300} height={300} data={crivella_src}/>

            </div>
        )
    }

}

export default Midia;