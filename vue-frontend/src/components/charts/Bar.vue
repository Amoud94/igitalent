<template>
    <Bar 
    :chart-options="chartOptions" 
    :chart-data="chartData" 
    :chart-id="chartId" 
    :dataset-id-key="datasetIdKey"
    :plugins="plugins" 
    :css-classes="cssClasses" 
    :styles="styles" 

    />
</template>
  
<script>
import { Bar } from 'vue-chartjs/legacy'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: {
        Bar
    },
    props: {
        chartId: {
            type: String,
            default: 'bar-chart-payment'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        // width: {
        //     type: Number,
        //     default: 600
        // },
        // height: {
        //     type: Number,
        //     default: 300
        // },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => { }
        },
        chartOptions: {
            type: Object,
            default: () => {
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                    borderWidth: 1,
                    barPercentage: 0.8,
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                }
            },
        },
        chartData: {
            type: Object,
            default: () => {}
        },
        plugins: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
    
        }
    }
}
</script>
<style>
#bar-chart {
    width: 100% !important;
    height: auto !important;
}
</style>
  