<template>
    <div>
    <label class="custom-file-upload">
        <input @change="viewFile"  type="file" accept=".csv" />
    </label>
    </div>
</template>

<script>
export default {
    name: 'UploadFile',
    methods: {
        viewFile(event) {
            console.log(event.target.files[0]);
        }
  }
}
</script>

<style scoped>
.custom-file-upload {
    align-content: center;
}

</style>
