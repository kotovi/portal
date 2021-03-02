function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function is_empty(x)
{
    return (
        (typeof x == 'undefined')
        ||
        (x == null)
        ||
        (x == false)  //same as: !x
        ||
        (x.length == 0)
        ||
        (x == "")
        ||
        (x.replace(/\s/g,"") == "")
        ||
        (!/[^\s]/.test(x))
        ||
        (/^\s*$/.test(x))
    );
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}



Vue.component('file-form', {
    props: ['files', 'fileAttr' ,  'showModal'],
    data: function() {
        return {
            id:'',
            fileName:'',
            fileDescription:'',
            randomFileName:'',
            creatorId:'',
            createDateTime:'',
            isSuccessFileUpload:false,
            isUnsuccessFileUpload:false,
        }
    },

    watch:{
        fileAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.fileName = newVal.fileName;
            this.fileDescription = newVal.fileDescription;
            this.randomFileName = newVal.randomFileName;
            this.creatorId = newVal.creatorId;
            this.createDateTime = newVal.createDateTime;
        }
    },
    template:


        '<div>'+
        '<div v-if="$root.showModal">'+
            '<div class="modal-mask">'+
                '<div class="modal-wrapper">'+
                    '<div class="modal-container">'+
                         '<div class="modal-title">'+
                            '<button class="close" @click="closeAlarmWindow">&times;</button>'+
                            'Добавление файла'+
                            '<hr>'+
                        '</div>'+
                        '<div v-if="($root.editClicked == false)" class="form-row">'+
                            '<div class="form-group col-md-12">'+
                                '<label>Прикрепить файл</label>'+
                                '<div class="custom-file">'+
                                    '<input type="file" class="custom-file-input" id="file" ref="file" v-on:change="handleFileUpload()">'+
                                    '<label class="custom-file-label" for="file">{{fileName}}</label>'+
                                    '<p class="alert alert-danger" v-show ="$root.fileSizeAlert">Размер файла не должен превышать 100МБ</p>'+
                                    '<p class="alert alert-danger" v-show ="$root.fileTypeAlert">Недопустимый тип файла! Загружать можно только .doc, .docx, .pdf или .odt! </p>'+
                                    '<p class="alert alert-danger" v-show ="$root.fileNameAlert">Не выбран файл! </p>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-row">'+
                            '<div class="form-group col-md-12">'+
                                '<label for="fileDescription">Описание файла</label>'+
                                '<div class="input-group">'+
                                    '<textarea type="text" class="form-control" id="fileDescription" v-model="fileDescription" placeholder="Аннотация длинной до 1000 символов" :maxlength="1000"></textarea>'+
                                    '<div v-show="fileDescription.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="1000 - fileDescription.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show ="$root.fileDescriptionAlert">Укажите аннотацию!</p>'+
                            '</div>'+
                        '</div>'+
                        '<br>'+
                        '<div  class="modal-footer">'+
                            '<button class="btn btn-success" @click="save">Сохранить</button>'+
                            '<button class="btn btn-danger"  @click="closeAlarmWindow">Отмена</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div v-if="($root.showSuccessMessage)">'+
            '<div class="modal-mask">'+
                '<div class="modal-wrapper">'+
                    '<div class="modal-container">'+
                        '<div v-if="$root.showSuccessMessage" class="modal-title">'+
                            '<button class="close" @click="closeMessageWindow">&times;</button>'+
                            'Файл успешно добавлен!'+
                        '</div>'+
                        '<div  class="modal-footer">'+
                            '<button class="btn btn-danger"  @click="closeMessageWindow">Ок</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '</div>',

    methods: {
        closeMessageWindow(){
            this.$root.showSuccessMessage=false;

        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
            this.fileName = this.file.name;
            this.ext = this.fileName.substr(this.fileName.lastIndexOf('.') + 1);
            this.randomFileName = `lection_${(+new Date).toString(16)}`+ '.'+this.ext;

            console.log('this.fileName: '+ this.fileName );
            console.log('this.ext: '+ this.ext );
            console.log('this.randomFileName: '+ this.randomFileName );
        },

        closeAlarmWindow(){
            this.fileName='';
            this.fileDescription='';
            this.lectionId='';
            this.randomFileName='';
            this.$root.showModal=false;

        },


        save: function () {
            if(!is_empty(this.fileName)){

                if(this.file.size >104857600){
                    this.$root.fileSizeAlert=true;
                    console.log('Проверка ограничения размера файла не пройдена');
                } else {
                    console.log('Проверка ограничения размера файла пройдена');

                    this.$root.fileSizeAlert=false;
                    this.ext = this.ext.toLowerCase();
                    console.log('Расширение файла: '+this.ext);

                    if (!((this.ext=='doc') || (this.ext=='docx') || (this.ext=='odt') || (this.ext=='pdf'))) {
                        this.$root.fileTypeAlert=true;
                        console.log('Проверка расширения файла не пройдена');
                    } else{
                        this.$root.fileTypeAlert=false;
                        console.log('Проверка расширения файла пройдена');
                    }
                }

            } else {
                // this.filename='1';
                //  this.randomFileName ='1';
                this.$root.fileSizeAlert=false;
                this.$root.fileTypeAlert=false;
            }

            var file = {
                fileName: this.fileName,
                fileDescription: capitalizeFirstLetter(this.fileDescription),
                lectionId: lectionId,
                randomFileName: this.randomFileName,

            };

            console.log();
            if (is_empty(this.fileName)) {
                this.$root.fileNameAlert = true;
                console.log('Проверка имени файла не пройдена');
            } else{
                this.$root.fileNameAlert = false;
                console.log('Проверка имени файла  пройдена');
            }

            if (is_empty(this.fileDescription)) {
                this.$root.fileDescriptionAlert = true;
                console.log('Проверка описания файла не пройдена');
            } else {
                console.log('Проверка описания файла пройдена');
                this.$root.fileDescriptionAlert = false;
            }
            console.log('LectionId:' + this.$root.lectionId);
            if (this.$root.lectionId>0) {
                console.log('Проверка lectionId пройдена');
                this.$root.lectionIdAlert = false;
            } else {
                console.log('Проверка lectionId не пройдена');
                this.$root.lectionIdAlert = true;
            }

            if ((!this.$root.fileNameAlert) &&
                (!this.$root.fileDescriptionAlert)&&
                (!this.$root.lectionIdAlert)&&
                (!this.$root.fileSizeAlert)&&
                (!this.$root.fileTypeAlert)
            ) {
                if(!is_empty(this.fileName)){
                    console.log('имя файла не пустое!');
                    let formData = new FormData();
                    this.ext = this.fileName.substr(this.fileName.lastIndexOf('.') + 1);

                    formData.append('file', this.file, this.randomFileName);

                    axios.post( '/upload',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    ).then (res =>{
                        console.log("res: " + {res});
                        Vue.resource('/file{/id}').save({}, file).then(result =>
                            result.json().then(data => {
                                this.files.push(data);
                                this.fileName='';
                                this.fileDescription='';
                                this.lectionId='';
                                this.randomFileName='';
                            })
                        );
                        this.$root.showModal=false;
                        this.$root.showSuccessMessage=true;
                    }).catch(function(){
                        this.isUnsuccessFileUpload=true;
                           console.log('Ошибка загрузки файла');
                           alert("Ошибка загрузки файла, попробуйте еще раз!")
                        });

                }

            }
        }
    }

});

Vue.component('file-row' , {
    props: ['file', 'editMethod', 'files'],
    template:
        '<tr>'+
        '<td width="10%" style="text-align: center">{{this.files.indexOf(this.file) + 1}}</td>'+
        '<td width="30%" style="text-align: center"><a target="_blank" v-bind:href="`/downloadFile/${file.randomFileName}`"> {{file.fileName}} </a></td>'+
        '<td width="20%" style="text-align: center">{{file.fileDescription}}</td>'+
        '<td width="20%" style="text-align: center">{{file.createDateTime}}</td>'+
        '<td width="20%" style="text-align: center">'+
            '<input type = "button" class="btn btn-danger  margin: 10px;" value="X" v-on:click="del"  @click="del" />'+
        '</td>'+
        '</tr>',
    methods: {
        edit: function(){
            this.editMethod(this.file);
        },
        del: function() {

                Vue.resource('/file{/id}').delete({id: this.file.id}).then(result => {
                    if (result.ok) {
                        this.files.splice(this.files.indexOf(this.file), 1) ;
                    }
                })

        }
    }

});

Vue.component('file-list', {
    props: ['files', 'lection'],
    data: function(){
        return {
            file: null
        }
    },

    template:
        ' <div style="position: relative;">'+
        '<h1 class="display-4 mt-5 mb-5" style="padding-top:40px;">Файлы для лекции "{{lection.lectionName}}"</h1>'+
        '<input style="margin: 5px;"  type="button" class="btn btn-primary " value="Добавить" @click="addFile"> '+
        '<input style="margin: 5px;"  type="button" class="btn btn-success " value="К курсу" @click="toCource"> '+

            '<file-form :files="files"  :fileAttr="file" />'+

            '<div v-show="this.$root.editClicked == false" class="card" style=" margin-top: 20px;">'+
                '<h5 class="card-header text-white bg-primary">Файлы для лекции</h5>'+
                '<div class="card-body">'+
                    '<table class="table">'+
                        '<thead>'+
                            '<tr>'+
                                '<th width="10%" scope="col" style="text-align: center">#</th>'+
                                '<th width="30%" scope="col" style="text-align: center">Имя</th>'+
                                '<th width="20%" scope="col" style="text-align: center">Аннотация</th>'+
                                '<th width="20%" scope="col" style="text-align: center">Добавлен</th>'+
                                '<th width="20%" scope="col" style="text-align: center">Действие</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<file-row v-for="file in files" :key="file.id" :file = "file" ' +
                            ':editMethod="editMethod" :files="files"/>' +
                        '</tbody>' +
                    '</table>' +
                '</div>'+
            '</div>'+
        '</div>',

    methods: {
        toCource: function(){
            window.location.href = '/lectionmaker?courceId=' + this.lection.cource.id;
        },
        editMethod: function(file){
            this.file = file;
        },
        addFile: function(){
            this.$root.showModal=true;
        }
    }

});

var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
        '<file-list :files="files" :lection="lection" /> '+
        '</div>',
    data: {

        files:[],
        lection:'',

        editClicked:false,
        fileNameAlert:false,
        fileDescriptionAlert:false,
        lectionIdAlert:false,
        fileIsEmpty:true,
        fileSizeAlert:false,
        fileTypeAlert:false,
        ext:'',
        randomFileName:'',
        showModal:false,
        lectionId:lectionId,

        showSuccessMessage:false,
        showUnsuccessMessage:false,
    },

    created: function () {

        Vue.resource('/file{/id}').get({id: this.$root.lectionId}).then(result =>
                result.json().then(data =>
                        data.forEach(file => {
                            this.files.push(file);
                                })
                        )
                    );

        Vue.resource('/lection/info/{id}').get({id: this.$root.lectionId}).then(result =>
            result.json().then(data =>
                 {
                    this.$root.lection = data;
                })

        );
    },
});
