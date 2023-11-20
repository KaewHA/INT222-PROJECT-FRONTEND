<script setup >
defineEmits(['newfile'])
import { onMounted } from 'vue';


onMounted(async () => {
    var dropArea = document.getElementById('dropArea');
        var fileInput = document.getElementById('fileInput');
        var fileList = document.getElementById('fileList');
        dropArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            dropArea.classList.add('highlight');
        });

        // Remove the highlight when the drag leaves the drop area
        dropArea.addEventListener('dragleave', function () {
            dropArea.classList.remove('highlight');
        });

        // Handle dropped files
        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            dropArea.classList.remove('highlight');

            var files = e.dataTransfer.files;
            handleFiles(files);
        });

        // Clicking on the drop area triggers the hidden file input
        dropArea.addEventListener('click', function () {
            fileInput.click();
        });

        // Handle selected files when using the file input
        fileInput.addEventListener('change', function () {
            var files = fileInput.files;
            if(files.length>5){
               let selectedFiles = Array.from(files).slice(0, 5);
               fileInput.files=selectedFiles
               handleFiles(selectedFiles);
            }else{
                console.log(files);
                handleFiles(files);
            }
            var formData = new FormData();
            formData.append('key1', 'value1');
formData.append('key2', 'value2');
formData.append('key3', 'value3');

// แสดงข้อมูลที่อยู่ใน FormData

            for (var i = 0; i < files.length; i++) {
                formData.append(`file${i}`, files[i]);
            }
            for (const entry of formData.entries()) {
    console.log(entry[0], entry[1]);
}
        });

        // Function to handle dropped or selected files
        function handleFiles(files) {
            fileList.innerHTML = ''; // Clear the previous file list

            for (var i = 0; i < files.length; i++) {
                var listItem = document.createElement('li');
                listItem.textContent = files[i].name;
                fileList.appendChild(listItem);
            }
        }
})
       
       

</script>

<template>
   

   <div class="absolute bottom-3 right-3 rounded-full  hover:scale-110 shadow-2xl cursor-pointer transition duration-150 z-50" id="filemanagement" @click="filemanage=false"><img src="/images/cross.png" alt="logo.png" class="h-14 w-14"></div>
         <div class="w-full h-full relative">
           <h1 class="w-full flex justify-center text-3xl my-6 ">File Attachments</h1>
          <div id="dropArea" class="drop-area w-full h-[50%] flex items-center justify-center">
            <div class="flex-col">      
        <span class="material-symbols-outlined text-6xl">cloud_upload</span>
         <p>Drag and drop files here or click to select files</p>
        </div>
        <input type="file" id="fileInput"  multiple style="display:none;">
    </div>
    <ul id="fileList"></ul>


         </div>


</template>

<style scoped>
  #dropArea {
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            cursor: pointer;
        }

        #dropArea.highlight {
            border-color: #2196F3;
        }
</style>