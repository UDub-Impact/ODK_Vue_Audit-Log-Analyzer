
<template>
  <div>
    <label class="custom-file-upload">
      <input @change="processData" type="file" accept=".csv" />
    </label>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "UploadFile",
  methods: {
    // parse CSV file
    processData(e) {
      var file = e.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (readerEvent) => {
        let auditStr = readerEvent.target.result;
        let auditData = d3.csvParse(auditStr);

        // format data by grouping it by instanceID
        let groupedAuditData = this.groupAuditData(auditData);
        let groupedSubmissionTimes = this.reduceSubmissionQuestions(
          groupedAuditData,
          this.calculateQuestionTime
        );

        // dictionary that maps each question to the average time it took to answer that question
        let averageQuestionTimes = this.calculateAverageQuestionValues(
          groupedSubmissionTimes
        );
        console.log(averageQuestionTimes);
      };
    },

    calculateAverageQuestionValues(groupedSubmissionValues) {
      let questionAggregate = {};
      let questionResponses = {};

      for (const [instanceID, questions] of Object.entries(groupedSubmissionValues)) {
        for (const [node, value] of Object.entries(questions)) {
          if (!(node in questionAggregate)) {
            questionAggregate[node] = 0;
            questionResponses[node] = 0;
          }

          questionAggregate[node] += value;
          questionResponses[node]++;
        }
      }

      let questionAverages = [];
      for (const node of Object.keys(questionAggregate)) {
        let entry = {};
        entry.node = node;
        entry.value = questionAggregate[node] / questionResponses[node];
        questionAverages.push(entry);
      }

      return questionAverages;
    },

    calculateQuestionTime(events) {
      let totalTime = 0;
      for (const event of events) {
        if (event["end"] && event["start"]) {
          totalTime += event["end"] - event["start"];
        }
      }

      // convert time from ms to s
      return totalTime / 1000;
    },

    /* groups audit data by instanceID and node */
    groupAuditData(auditData) {
      let groupedData = {};
      for (const event of auditData) {
        // cut off "uuid:" portion of instanceID
        let splitInstanceID = event["instance ID"].split(":");
        let instanceID = splitInstanceID[splitInstanceID.length - 1];

        // cut off "/data/" portion of question names
        let splitNode = event["node"].split("/");
        let node = splitNode[splitNode.length - 1];

        // we skip events that aren't associated with an instanceID and a question name
        if (instanceID && node) {
          if (!(instanceID in groupedData)) {
            groupedData[instanceID] = {};
          }

          if (!(node in groupedData[instanceID])) {
            groupedData[instanceID][node] = [];
          }

          groupedData[instanceID][node].push(event);
        }
      }
      return groupedData;
    },

    reduceSubmissionQuestions(groupedData, fn) {
      let submissionTimes = {};
      for (const [instanceID, questions] of Object.entries(groupedData)) {
        submissionTimes[instanceID] = {};

        for (const [node, events] of Object.entries(questions)) {
          submissionTimes[instanceID][node] = fn(events);
        }
      }
      return submissionTimes;
    },
  },
};
</script>

<style scoped>
.custom-file-upload {
  align-content: center;
}
</style>
