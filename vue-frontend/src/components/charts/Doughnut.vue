<template>
    <Doughnut :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :styles="styles" />
</template>
  
<script>
import { Doughnut } from 'vue-chartjs/legacy'
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartJsPluginDataLabels)

export default {
    name: 'DoughnutChart',
    components: {
        Doughnut
    },
    props: {
        chartId: {
            type: String,
            default: 'doughnut-chart-payment'
        },
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 130
        },
        styles: {
            type: Object,
            default: () => {
                return {
                    //padding: '10px',

                }
            }
        },
        chartData: {
            type: Object,
            default: () => {
                return {
                    labels: [
                        'SAV',
                        'Convoyage',
                        'Test drive',
                        'IA check',
                    ],
                    datasets: [{
                        label: 'My First Dataset',
                        data: [300, 50, 100, 20],
                        backgroundColor: [
                            '#0086C9',
                            '#026AA2',
                            '#065986',
                            '#0B4A6F',
                        ],
                        hoverOffset: 4
                    }]
                }
            }
        },
        chartOptions: {
            type: Object,
            default: () => {
                return {
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    backgroundColor: '#5B93FF0D',
                    cutout:190,
                    angle: [50],
                    borderRadius: [{ innerEnd: 10, outerEnd: 10, innerStart: 10, outerStart: 10}],
                    spacing: -50,
                    borderWidth: 0,
                }
            }
        }
    },
    data() {
        return {
        }
    }
}
</script>
<style></style>
  