<script>
import { defineComponent } from "vue";
import { Bar } from "vue3-chart-v2";

export default defineComponent({
  name: "BarChart",
  props: {
    data: [],
    stylingLabels: {}
  },
  extends: Bar,
  data() {
    return {
      options: {
        responsive: true,
        title: {
          text: this.stylingLabels.text,
          display: true,
          fontSize: 24,
        },
        scales: {
          yAxes: [
            {
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
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.data[0],
      datasets: [
        {
          label: "Average Time (s)",
          backgroundColor: "#f87979",
          data:this.data[1],
        },
      ],
    }, this.options);
  },
});
</script>