import React from "react";
import {ShallowComponent} from "robe-react-commons";
import BarChart from "robe-react-ui/lib/charts/BarChart";

let data = [
    {name: "Page A", pb: 4900, pr: 1398, pv: 2210, fill: "#8884d8"},
    {name: "Page B", pb: 3000, pr: 1398, pv: 2210, fill: "#83a6ed"},
    {name: "Page C", pb: 2000, pr: 4500, pv: 2290, fill: "#8dd1e1"},
    {name: "Page D", pb: 2780, pr: 3908, pv: 2000, fill: "#82ca9d"},
];

let bars = [
    {dataKey: "pb", name: "Public", fill: "red", unit: "cd"},
    {dataKey: "pr", name: "Protected", fill: "blue"},
    {dataKey: "pv", name: "Private", fill: "green"}
];

export default class BarChartSample extends ShallowComponent {

    render():Object {
        return (
            <div>
                <div className="form-group">
                    <BarChart data={data} width={400} height={400} bars={bars}/>
                </div>
            </div>
        );
    }
}
