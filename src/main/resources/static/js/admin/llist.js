function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
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
        (x.toString().replace(/\s/g,"") == "")
        ||
        (!/[^\s]/.test(x))
        ||
        (/^\s*$/.test(x))
    );
}
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        if (property=="byAuthorLastname") {
            var result = (a.user.lastname < b.user.lastname) ? -1 : (a.user.lastname > b.user.lastname) ? 1 : 0;
            return result * sortOrder;
        } else if (property=="byCourceName") {
            var result = (a.cource.courceName < b.cource.courceName) ? -1 : (a.cource.courceName > b.cource.courceName) ? 1 : 0;
            return result * sortOrder;
        } else if (property=="byUserGroup"){
            var result = (a.uGroup.groupName < b.uGroup.groupName) ? -1 : (a.uGroup.groupName > b.uGroup.groupName) ? 1 : 0;
            return result * sortOrder;
        }
        else {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
}


var llistApi = Vue.resource('/lectionlist{/id}');


Vue.component('lection-list', {
    props: ['lections', 'groups'],
    data: function(){
        return {
            search:'',
            lections_filter:'4',
            groups_filter:'0',
            pageNumber: 0,
            moderatorComment:'',
            isModerated:false,

        }
    },

    template:
        '<div style="min-width: 800px">'+

        '<div v-if="$root.showModal">'+
                '<div class="modal-mask">'+
                    '<div class="modal-wrapper">'+
                        '<div class="modal-container">'+
                                '<div class="modal-title">'+
                                    '<button class="close" @click="closeModeratorWindow">&times;</button>'+
                                    'Параметры для лекции "{{$root.selectedLectionName}}"'+
                                '</div>'+
                                '<label for="custom-control custom-checkbox">Коментарий к лекции</label>'+
                                '<div>'+
                                    '<b-form-textarea id="moderatorComment"placeholder="Введите коментарий к лекции" rows="8" v-model="$root.moderatorComment" ></b-form-textarea>'+
                                '</div>'+
                                '<label for="custom-control custom-checkbox">Допустить лекцию</label>'+
                                '<div class="custom-control custom-checkbox">' +
                                    '<b-form-checkbox type="checkbox" class="form-check-input" id="$root.isModerated"  v-model="$root.isModerated" switch></b-form-checkbox>'+
                                '</div>'+

                                '<div class="modal-footer">'+
                                    '<button class="btn btn-primary" @click="saveMoreratedData">Сохранить</button>'+
                                    '<button class="btn btn-danger" @click="closeModeratorWindow">Отмена</button>'+
                                '</div>'+

                        '</div>'+
                    '</div>'+
                '</div>'+
        '</div>'+

        '<div v-else-if="($root.showLoader)" style="margin-top: 200px; margin-left: 360px; margin-bottom: 200px; margin-right: 360px; width: 800px; position: center;">' +
            '<div class="spinner-border text-primary" role="status">'+
                '<span class="sr-only">Загрузка...</span>'+
            '</div>'+
        '</div>'+

        '<div v-else style="position: relative;">'+

        '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;"  v-show="!this.$root.showFrame">Полный список лекций в системе</h1>'+

        '<div v-if="this.$root.showFrame">'+
            '<div class="modal-mask">'+
                '<div class="modal-video-wrapper">'+
                    '<div class="modal-video-container">'+
                        '<div class="modal-title">'+
                            '<button class="close" @click="closeFrame">&times;</button>'+
                        '</div>'+
                        '<div class="embed-responsive embed-responsive-21by9">'+
                            '<iframe class="embed-responsive-item" :src="this.$root.watchUrl" allowfullscreen></iframe>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+


        '<div  v-show="!this.$root.showFrame">'+
        '<div class="card" style="margin-top: 15px; min-width: 900px;">'+
                '<div class="card-header text-white bg-primary"><h5 class="card-title" style="padding-top:5px;">Лекции</h5></div>'+
                '<div class="card-body">'+

                    '<label  style="margin: 5px;" for="deskId">Статус лекции:</label>'+
                    '<select  style="margin: 5px;" class="custom-select" id="lections_filter"  v-model="lections_filter"  @change="bySection($event)">'+
                        '<option value="4" selected>Все</option>'+
                        '<option value="2" >Записанные</option>'+
                        '<option value="0" >Без записи</option>'+
                        '<option value="1" >Зависшие</option>'+
                        '<option value="5" >Удаленные</option>'+
                    '</select>'+

                    '<label  style="margin: 5px;" for="deskId">Группа пользователей:</label>'+
                    '<select  style="margin: 5px;" class="custom-select" id="groups_filter"  v-model="groups_filter" @change="byGroup($event)">'+
                        '<option value="0" selected>Все</option>'+
                        '<option v-for="group in groups"  v-bind:value="group.id">{{group.groupName}}</option>'+
                    '</select>'+

                    '<label  style="margin: 5px;" for="deskId">Поиск:</label>'+
                    '<input style="margin: 5px;" v-model="search" id="search" class="form-control" placeholder="Поиск">'+

                    '<h5 class="card-title" style="padding-top:50px;">Всего лекций(с учетом поиска): {{this.filteredLections.length}}</h5>'+

                    '<table class="table table-striped">'+
                        '<thead>'+
                            '<tr>'+
                                '<th><a href="#"  v-bind:class="byLectionName" @click="byLectionName">Лекция</a></th>'+
                                '<th><a href="#"  v-bind:class="byLectionCourceId" @click="byLectionCourceId">Курс</a></th>'+
                                '<th><a href="#"  v-bind:class="byAuthorLastname" @click="byAuthorLastname">Автор</a></th>'+
                                '<th><a href="#"  v-bind:class="byUserGroup" @click="byUserGroup">Группа</a></th>'+
                                '<th>Действие</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<lection-row v-for="lection in paginatedData" :lections="lections" :key="lection.id" :lection = "lection"  />' +
                        '</tbody>' +

                    '</table>' +

                '</div>'+
        '</div>'+
        '<div v-if="pageCount>1" align="center" style="margin: 15px;">'+
            '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"> < Назад</button> Страница {{this.pageNumber + 1}} из {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">Вперед > </button>'+
        '</div>'+
            '</div>'+
        '</div>'+
        '</div>',

    computed: {
        sortedLections() {
           const  d = this.lections_filter;
           const k = this.$root.sortKey;
           const g = this.groups_filter;
            if (g==0){
                var lectionsByGroup = this.lections;
            } else {
                lectionsByGroup = this.lections.filter(item => item.userGroup == this.groups_filter);
            }
            if (d==4) {
                if (is_empty(k)){
                    return lectionsByGroup;
                } else {
                    return lectionsByGroup.sort(dynamicSort(k));
                }
            } else if (d==5){
                var finput =lectionsByGroup.filter(item => item.deleted == true);
                return finput.sort(dynamicSort(k));

            }
            else {
                var finput =lectionsByGroup.filter(item => item.recordStatus == d);
                return finput.sort(dynamicSort(k));
            }
        },

        filteredLections() {
            const s = this.search.toLowerCase();
            return this.sortedLections.filter(sortedLection =>
                                                _.some(sortedLection, v => {
                                                    if (!(v instanceof Object)) {
                                                        this.pageNumber=0;
                                                        return  _.toLower(v).indexOf(s)>-1
                                                    } else {
                                                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                                                    }}));

        },
        pageCount(){
            let l = this.filteredLections.length,
                s = 20;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * 20,
                end = start + 20;

            return this.filteredLections.slice(start, end);

        },

    },
    methods: {
        saveMoreratedData: function(){
            console.log("moderatorComment: "+ this.moderatorComment);
            console.log("isModerated: "+this.isModerated);
            console.log("selectedLectionId: "+this.$root.selectedLectionId);
            console.log("selectedLectionName : "+this.$root.selectedLectionName );

            const moderatedLection = {
                id: this.$root.selectedLectionId,
                moderatorComment: this.$root.moderatorComment,
                isModerated: this.$root.isModerated,
            };
           llistApi.update({id: this.$root.selectedLectionId}, moderatedLection).then(result =>
               result.json().then(data => {

                 const index = this.lections.findIndex(item => item.id === data.id)
                   this.lections.splice(index, 1, data)
               })
           );
            //llistApi.update({id: this.$root.selectedLectionId}, moderatedLection);


            this.$root.showModal=false;
            this.$root.isModerated = '';
            this.$root.moderatorComment = '';
            this.$root.selectedLectionId = '';
            this.$root.selectedLectionName = '';

        },
        closeModeratorWindow: function(){

            this.$root.showModal=false;
            this.$root.isModerated = '';
            this.$root.moderatorComment = '';
            this.$root.selectedLectionId = '';
            this.$root.selectedLectionName = '';

        },
        bySection: function(event){

            console.log("Section: " + event.target.value);

        },
        byGroup: function(event){

            console.log("Group: " + event.target.value);

        },
        byAuthorLastname: function () {
            this.$root.sortKey = "byAuthorLastname";
        },

        byLectionName: function(){
            this.$root.sortKey="lectionName";
        },
        byLectionCourceId: function () {
            this.$root.sortKey="byCourceName";
        },

        byUserGroup: function () {
            this.$root.sortKey="byUserGroup";
        },
        closeFrame() {
            this.$root.showFrame = false;
        },
        nextPage(){
            this.pageNumber++;
        },
        prevPage(){
            this.pageNumber--;
        }

        }
});

Vue.component('lection-row' , {
    props: ['lection','lections'],

    template:
        '<tr>'+
            '<td v-if="lection.deleted==true" class="table-danger" >{{lection.lectionName}} (ID:{{lection.id}}; Дата создания: {{lection.lectionCreateDateTime}}; Дата удаления:{{lection.deleteDate}}; )</td>'+
            '<td v-else >{{lection.lectionName}}(ID: {{lection.id}};  Дата создания: {{lection.lectionCreateDateTime}})</td>'+

            '<td v-if="lection.cource.isDeleted==true" class="table-danger">{{lection.cource.courceName}}</td>'+
            '<td v-else>{{lection.cource.courceName}}( ID: {{lection.courceId}} )</td>'+
            '<td>{{lection.user.lastname}} {{lection.user.firstname}} {{lection.user.secname}} (ID: {{lection.user.id}})</td>'+
            '<td>{{lection.uGroup.groupName}}(ID: {{lection.uGroup.id}})</td>'+
            '<td>'+
                    '<div v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==0))" class="loader"></div>'+
                    '<input style="margin: 5px;"   v-if="(($root.isModerator) || ($root.isAdmin))" type = "button" class="btn btn-sm btn-primary" value="Модерация" @click="moderateRecord" />'+
                    '<input style="margin: 5px;"   v-if="(lection.lectionUrl!=null)" type = "button" class="btn btn-sm btn-success" value="Просмотр" @click="viewRecord" />'+
                    '<input style="margin: 5px;"   v-if="((lection.deleted==true) || (lection.cource.isDeleted==true))" type = "button" class="btn btn-sm btn-danger" value="X" @click="del" />'+
                '</td>'+

        '</tr>',
    methods: {
        viewRecord: function () {
            this.$root.watchUrl=this.lection.lectionUrl;
            this.$root.showFrame=true;
            this.$root.courceName=this.lection.cource.courceName;
            this.$root.lectionName =this.lection.lectionName;

        },

        del: function () {
            llistApi.remove({id: this.lection.id}).then(result => {
                if(result.ok){ this.lections.splice(this.lections.indexOf(this.lection), 1)}
            })
        },
        moderateRecord: function () {
            this.$root.showModal=true;
            this.$root.isModerated = this.lection.isModerated;
            this.$root.moderatorComment = this.lection.moderatorComment;
            this.$root.selectedLectionId = this.lection.id;
            this.$root.selectedLectionName = this.lection.lectionName;
        }
    }
});

app = new Vue({
    el: '#app',
    template:
        '<div>'+
            '<lection-list :lections="lections" :groups="groups" />'+
        '</div>',
    data: {
        lections: [],
        groups: [],
        sortKey:'',
        showFrame:false,
        lectionName:'',
        courceName:'',
        watchUrl:'',
        showModal:false,
        isAdmin:false,
        isUser:false,
        isModerator:false,
        isServerAdmin:false,
        isStudent:false,

        isModerated:false,
        moderatorComment:'',
        selectedLectionId:'',
        selectedLectionName:'',
        showLoader:true,


    },
    created: function () {
       // var llistApi = Vue.resource('/lectionlist{/id}');
       // llistApi.get().then(result =>
       // result.json().then(data => ( this.lections = data ))

       // axios.get('/lectionlist').then(result => {
       //     this.lections=result.data;
       // }).then(this.$root.showLoader=false);

        llistApi.get().then(result =>
            result.json().then(data =>{
                this.lections=data
            }).then(this.$root.showLoader=false)
        );

        axios.get('/usergroup').then(result => {
            this.groups=result.data.filter(item => item.groupType == 1);
            });

        axios.get('/nav').then(result => {
            this.nav=result.data;

            if(result.data.roles.includes("USER")){
                this.$root.isUser=true;
            }
            if(result.data.roles.includes("ADMIN")){
                this.$root.isAdmin=true;
            }
            if(result.data.roles.includes("SERVERADMIN")){
                this.$root.isServerAdmin=true;
            }
            if(result.data.roles.includes("MODERATOR")){
                this.$root.isModerator=true;
            }
            if(result.data.roles.includes("STUDENT")) {
                this.$root.isStudent = true;
            }

        });

    },
});



