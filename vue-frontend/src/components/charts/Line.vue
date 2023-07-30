<template>
  <LineChartGenerator :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :styles="styles" />
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler,

} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler,
);

export default {
  name: "lineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {
          plugins: {
            legend: {
              display: false,
            },
          },
          fill: true,
          tension: 0.4,
          responsive: true,
          maintainAspectRatio: false,
          borderWidth: 5,
        }
      }
    },
    chartData: {
      type: Object,
      default: () => {
        return {
          labels: [
            "Sem 1",
            "Sem 2",
            "Sem 3",
            "Sem 4",
            "Sem 5",
          ],
          datasets: [
            {
              label: "Data One",
              backgroundColor: "#F5FBFF",
              borderColor: "#5BC4FF",
              data: [1000, 1500, 1500, 2000, 2500],
            },
            {
              label: "Data two",
              backgroundColor: "#F5FBFF",
              borderColor: "#5BC4FF",
              data: [1000, 1500, 1500, 2000, 2500],
            }
          ],
        }
      }
    },
    styles: {
      type: Object,
      default: () => {
        return {
          padding: '10px'
        }
      }
    },

  },
  data() {
    return {

    };
  },
};
</script>
