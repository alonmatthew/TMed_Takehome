import React, { useState, useEffect } from 'react';
import { Page } from '../components/Page';
import { Loading } from './Loading';

import axios from 'axios';

export const CoreDiabetes = () => {
    // NOTE: had some issues importing flot time plugin. 
    // x axis is in whole numbers instead of converted to military time.
    const [patient, setPatient] = useState({});
    const [graphData, setGraphData] = useState({});
    const [graphDates, setGraphDates] = useState([]);

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // fetch api data and set to patient variable
    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL)
        .then(res => {
            setPatient(res.data.patient);
        })
        .catch(err => {
            throw new Error(err);
        })
    }, []);

    // organize patient data to create graphs
    useEffect(() => {
        if(patient.glucose_data) {
            const arr = [];
            const obj = {};
            
            patient.glucose_data.forEach(data => {
                let date = data.result_dt_tm.split(' ')[0].replace(/\D/g,'');
                let time = data.result_dt_tm.split(' ')[1][0] + data.result_dt_tm.split(' ')[1][1];

                if(!obj[date]) {
                    obj[date] = [
                        {
                            result_id: data.result_id,
                            glucose_level: data.glucose_level,
                            time
                        }
                    ]
                } else {
                    obj[date].push(
                        {
                            result_id: data.result_id,
                            glucose_level: data.glucose_level,
                            time
                        }
                    )
                }
                arr.push(date);
            })
            const unique = arr.filter(onlyUnique)
            setGraphData(obj);
            setGraphDates(unique);
        }
    }, [patient]);

    // create graphs
    useEffect(() => {
        if(graphData) {
            const chartOptions = { 
                yaxis: { min: 0, max: 500 },
                xaxis: { min: 0, max: 24 },
                series: { 
                    lines: { show: true }, 
                    points: { show: true }
                }
            };

            graphDates.forEach(date => {
                const data = [];
                graphData[date].forEach(point => {
                    let arr = [];
                    arr.push(point.time, point.glucose_level);
                    data.push(arr);
                })
                window.$.plot(window.$(`.graph-${date}`), [ data ], chartOptions)
            })
        }
    }, [graphDates, graphData]);

    return (
        <Page>
            { !patient.demographics ? <Loading /> :
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-2 header-border">
                            <p>Core Diabetes App (TransformativeMed)</p>
                        </div>
                        <div className="col-sm-10 header-border">
                            <div className="row center-y h-100">
                                <div className="col-sm-10">
                                    <h4>{ patient.demographics.full_name }</h4>
                                </div>
                                <div className="col-sm-2">
                                    <h6>Age: { patient.demographics.age }</h6>
                                    <h6>Gender: { patient.demographics.gender }</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="graph-placeholder">
                        { graphDates.map(date => {
                            return (<div key={date} className="row graph-block">
                                <div className={`col-md-2 graph-date center-y`}>{date}</div>
                                <div className={`col-md-10 graph graph-${date}`}></div>
                                </div>)
                        }) }
                    </div>
                </div>
            }
        </Page>
    );
}