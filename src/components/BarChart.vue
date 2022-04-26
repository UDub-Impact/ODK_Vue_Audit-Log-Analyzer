<script>
import { defineComponent } from "vue";
import { Bar } from "vue3-chart-v2";

export default defineComponent({
  name: "BarChart",
  props: {
    data: [Array],    // raw data to display on graph
    stylingLabels: {} // axis and title labels
  },
  watch: {
    data: function() {
      this.update();
    }
  },
  extends: Bar,
  methods: {
    /**
     * Updates and redraws the bar chart to reflect the current data.
     */
    update() {
      this.renderChart({
      labels: this.data[0],
      datasets: [
        {
          label: "Average Time (s)",
          backgroundColor: "#bc006b",
          data:this.data[1],
        },
      ],
    }, this.options);
    }
  },
  data() {
    /**
     * Configurations to style and label the bar chart.
     */
    return {
      options: {
        maintainAspectRatio: true,
        title: {
          text: this.stylingLabels["text"],
          display: true,
          fontSize: 24,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: Math.min(...this.data[1])-0.5
            },
              scaleLabel: {
                display: true,
                labelString: this.stylingLabels.labelStringY,
                fontColor: "teal",
                fontSize: 18,
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.stylingLabels.labelStringX,
                fontColor: "teal",
                fontSize: 18,
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.update();
  }
});
</script>

<style scoped>
canvas {
  width: 700px;
}
</style>