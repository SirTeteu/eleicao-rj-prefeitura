import React from 'react';

import PieChart from './PieChart';
import { getJornalData } from './api';
import DonutChart from './DonutChart';

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
            
            let topSource = sourceArray.slice(0, 5);
            let rest = sourceArray.slice(5);
            let total = rest.reduce((total, atual) => total += atual.number, 0);
            topSource.push({name: 'outros', number: total});

            return topSource;
        }

        return [];
    }

    generateArraySources = () => {
        let arraySource = [];

        if(this.state.crivella) {
            for(let source in this.state.crivella.src) {
                if(!arraySource.some(elem => {
                    if(elem.name == source) {
                        elem.data.push({
                            name: 'Crivella', 
                            number: this.state.crivella.src[source]
                        });
                        return true;
                    }
                    return false;
                })) {

                    arraySource.push({
                        name: source,
                        data: [{
                            name: 'Crivella',
                            number: this.state.crivella.src[source]
                        }]
                    });

                }
            }
        }

        if(this.state.freixo) {
            for(let source in this.state.freixo.src) {
                if(!arraySource.some(elem => {
                    if(elem.name == source) {
                        elem.data.push({
                            name: 'Freixo', 
                            number: this.state.freixo.src[source]
                        });
                        return true;
                    }
                    return false;
                })) {

                    arraySource.push({
                        name: source,
                        data: [{
                            name: 'Freixo',
                            number: this.state.freixo.src[source]
                        }]
                    });
                }
            }
        }

        console.log(arraySource);
        return arraySource;
    }

    render() {
        const total = [
            { name: 'Crivella', number: this.state.crivella.total },
            { name: 'Freixo', number: this.state.freixo.total }
        ];
        const last_week = [
            { name: 'Crivella', number: this.state.crivella.last_week },
            { name: 'Freixo', number: this.state.freixo.last_week }
        ];
        const sources = this.generateArraySources();

        const crivella_src = this.generateTopSource(this.state.crivella.src);
        const freixo_src = this.generateTopSource(this.state.freixo.src);

        return(
            <div>
                <h2>Dados da Eleição na mídia</h2>

                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <div>
                        <h3>Total de notícias dos candidatos</h3>
                        <PieChart width={300} height={300} data={total}/>
                    </div>

                    <div>
                        <h3>Notícias na última semana</h3>
                        <PieChart width={300} height={300} data={last_week}/>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <div>
                        <h3>Jornais que mais publicaram sobre Crivella</h3>
                        <DonutChart width={500} height={500} data={crivella_src}/>
                    </div>

                    <div>
                        <h3>Jornais que mais publicaram sobre Freixo</h3>
                        <DonutChart width={500} height={500} data={freixo_src}/>
                    </div>
                </div>

                <div>
                    <h3>Notícias dos candidatos em cada jornal</h3>
                    <div style={{display: 'flex', justifyContent: 'space-evenly', flexFlow: 'wrap'}}>
                        {sources.map((source, index) => (
                            <div key={index}>
                                <h2>{source.name}</h2>
                                <PieChart width={275} height={275} data={source.data} multiple/>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        )
    }

}

export default Midia;