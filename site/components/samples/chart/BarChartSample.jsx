import React from "react";
import {ShallowComponent} from "robe-react-commons";
import BarChart from "robe-react-ui/lib/charts/BarChart";

let data = [
    {name: "Page A", uv: 4000, pv: 2400, amt: 2400, fill: "#8884d8"},
    {name: "Page B", uv: 3000, pv: 1398, amt: 2210, fill: "#83a6ed"},
    {name: "Page C", uv: 2000, pv: 9800, amt: 2290, fill: "#8dd1e1"},
    {name: "Page D", uv: 2780, pv: 3908, amt: 2000, fill: "#82ca9d"}
];
let bars = [
    {dataKey: "uv", name: "u-v", fill: "red"},
    {dataKey: "pv", name: "p-v", fill: "blue"},
    {dataKey: "amt", name: "a-m-t", fill: "green"}
];

export default class BarChartSample extends ShallowComponent {

    render():Object {
        return (
            <div style={{minHeight:500}}>
                <div className="form-group">
                    <BarChart data={data} width={500} height={300} bars={bars}/>
                </div>
            </div>
        );
    }
}
