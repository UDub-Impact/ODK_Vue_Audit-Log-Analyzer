
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
=======
export default {
  name: "UploadFile",
  methods: {
    async onFilePicked(event) {
      var fileData = event.target.files[0];
      
      const fileReader = new FileReader();
      fileReader.readAsText(fileData, "UTF-8");

       const result = await new Promise((resolve, reject) => {
           fileReader.onload = readerEvent => {
                let auditStr = readerEvent.target.result;
                // auditData is a list of dictionaries s.t. each dictionary represents a row of the original audit CSV data
                let auditData = d3.csvParse(auditStr);
                
                // rows of the original CSV audit have events from many different submissions jumbled together
                // this function groups all events by submission
                // this gives us a dictionary that maps submission id to events for that submission
                groupedAuditData = this.methods.groupAuditData(auditData);

                // the first function here keeps the data in a similar format to groupedData but maps question names to
                // the time spent responding to that question (rather than a list of events)
                let groupedSubmissionTimes = reduceSubmissionQuestions(
                groupedAuditData,
                calculateQuestionTime
                );
                // this function takes submission ids out of the picture and calculates the average time spent responding to
                // each question across submissions
                let averageQuestionTimes = calculateAverageQuestionValues(
                groupedSubmissionTimes
                );

                console.log(averageQuestionTimes);
           }
       })
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
  
  // Ignores any events that aren't associated with an instanceID and node (question name)
  // Truncates node names to remove "/data/" prefix and truncates instanceIDs to remove "uuid:" prefix
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
  // Takes a list of events corresponding to a single question in one submission
  // Returns the total response time for the question in seconds
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

  // Takes submission data in the format returned by reduceSubmissionQuestions
  // Returns a list of dictionaries s.t. each dictionary maps "node" to question name and "value" to the average value of that question
  // across all submissions
  calculateAverageQuestionValues(groupedSubmissionValues) {
    let questionAggregate = {};
    let questionResponses = {};

    for (const [instanceID, questions] of Object.entries(
      groupedSubmissionValues
    )) {
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
>>>>>>> a3827e58350293fbbb28af0a3431f2fb8937358a
  },
};
</script>

<style scoped>
.custom-file-upload {
  align-content: center;
}
</style>
