import React from "react";
import {ShallowComponent} from "robe-react-commons";
import PieChart from "robe-react-ui/lib/charts/PieChart";

let data = [
    {
        value: 4000,
        label: "Robe",
        unit: "ms",
        fill: "#8884d8",
        detail: [
            {
                value: 600,
                label: "Robe",
                unit: "ms",
                fill: "#82ca9d"
            },
            {
                value: 1000,
                label: "UI",
                unit: "ms",
                fill: "#d0ed57"
            },
            {
                value: 2400,
                label: "Module",
                unit: "ms",
                fill: "#ffc658"
            }
        ]
    },
    {
        value: 2400,
        label: "React",
        unit: "ms",
        fill: "#83a6ed",
        detail: [
            {
                value: 600,
                label: "Components",
                unit: "ms",
                fill: "#82ca9d"
            },
            {
                value: 1000,
                label: "Docs",
                unit: "ms",
                fill: "#d0ed57"
            },
            {
                value: 2400,
                label: "Examples",
                unit: "ms",
                fill: "#ffc658"
            }
        ]
    },
    {
        value: 2400,
        label: "Npm",
        unit: "ms",
        fill: "#8dd1e1",
        detail: [
            {
                value: 600,
                label: "Install",
                unit: "ms",
                fill: "#82ca9d"
            },
            {
                value: 1000,
                label: "Test",
                unit: "ms",
                fill: "#d0ed57"
            },
            {
                value: 2400,
                label: "Start",
                unit: "ms",
                fill: "#ffc658"
            }
        ]
    }
];


export default class PieChartSample extends ShallowComponent {

    render():Object {
        return (
            <div>
                <div className="form-group">
                    <PieChart size={400} data={data}/>
                </div>
            </div>
        );
    }
}

