import React from "react";
import {ShallowComponent} from "robe-react-commons";
import PieChart from "robe-react-ui/lib/charts/PieChart";

let data = [
    {
        value: 5000,
        label: "0",
        unit: "ms",
        fill: "rgb(71, 161, 157)",
        children: [
            {
                value: 4000,
                label: "01",
                unit: "ms",
                fill: "#8884d8",
                children: [
                    {
                        value: 2000,
                        label: "011",
                        unit: "ms",
                        fill: "#aba8e3",
                        children: [
                            {
                                value: 2000,
                                label: "0111",
                                unit: "ms",
                                fill: "#aba8e3"
                            },
                            {
                                value: 2000,
                                label: "0112",
                                unit: "ms",
                                fill: "#dbdaf3",
                                children: [
                                    {
                                        value: 2000,
                                        label: "01121",
                                        unit: "ms",
                                        fill: "#aba8e3"
                                    },
                                    {
                                        value: 2000,
                                        label: "01122",
                                        unit: "ms",
                                        fill: "#dbdaf3"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        value: 2000,
                        label: "012",
                        unit: "ms",
                        fill: "#dbdaf3",
                        children: [
                            {
                                value: 2000,
                                label: "0121",
                                unit: "ms",
                                fill: "#aba8e3"
                            },
                            {
                                value: 2000,
                                label: "0122",
                                unit: "ms",
                                fill: "#dbdaf3"
                            }
                        ]
                    }
                ]
            },
            {
                value: 1500,
                label: "02",
                unit: "ms",
                fill: "#4884d8",
                children: [
                    {
                        value: 600,
                        label: "021",
                        unit: "ms",
                        fill: "#7ea8e3"
                    },
                    {
                        value: 800,
                        label: "022",
                        unit: "ms",
                        fill: "#b5cdef"
                    }
                ]
            }
        ]
    },
    {
        value: 2000,
        label: "111",
        unit: "ms",
        fill: "#aba8e3",
        children: [
            {
                value: 2000,
                label: "1111",
                unit: "ms",
                fill: "#aba8e3"
            },
            {
                value: 2000,
                label: "1112",
                unit: "ms",
                fill: "#dbdaf3",
                children: [
                    {
                        value: 2000,
                        label: "11121",
                        unit: "ms",
                        fill: "#aba8e3"
                    },
                    {
                        value: 2000,
                        label: "11122",
                        unit: "ms",
                        fill: "#dbdaf3"
                    }
                ]
            }
        ]
    }
];


export default class PieChartSample extends ShallowComponent {

    render():Object {
        return (
            <div>
                <div className="form-group">
                    <PieChart size={400} data={data} />
                </div>
            </div>
        );
    }
}

