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

function is_empty(x) {
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
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {

        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}



var groupApi = Vue.resource('/usergroup{/id}');

Vue.component('group-form', {
    props: ['groups', 'groupAttr', 'lang'],
    data: function() {
        return {
            id:'',
            groupName:'',
            groupAnnotation:'',
            groupType:-1,
        }
    },

    watch:{
        groupAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.groupName = newVal.groupName;
            this.groupAnnotation = newVal.groupAnnotation;
            this.groupType=newVal.groupType;
        }
    },
    template:
        '<div v-if="lang==1">'+
            '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;" >Группы пользователей</h1>'+
            '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary" value="Добавить" @click="addUserGroup">'+
            '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary" value="Параметры отображения" @click="$root.showViewConfig=!$root.showViewConfig">'+
            '<div v-if="$root.showInputForm==true" class="card" style="margin: 15px; width: 80%;">'+
                '<div v-if="($root.editClicked == false)" class="card-header text-white bg-primary"><h5>Добавить группу</h5></div>'+
                '<div v-if="($root.editClicked == true)"class="card-header text-white bg-primary"><h5>Редактирование группы</h5></div>'+
                '<div class="card-body">'+
                    '<form>'+
                        '<div class="form-group col" style="width: 90%;">'+
                            '<label for="groupName">Название группы пользователей</label>'+
                            '<input type="text" class="form-control" id="groupName" v-model="groupName" placeholder="Имя группы">'+
                            '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Укажите название группы пользователей!</p>'+
                        '</div>'+
                        '<div class="form-group col" style="width: 90%;">'+
                             '<label for="groupAnnotation">Аннотация группы</label>'+
                             '<textarea type="text" class="form-control" id="groupAnnotation" v-model="groupAnnotation" placeholder="Анотация"></textarea>'+
                             '<p class="alert alert-danger" v-show ="$root.userGroupAnnotationAlert">Укажите краткую аннотацию группы пользователей!</p>'+
                        '</div>'+
                        '<div class="form-group col" style="width: 90%;">'+
                             '<label for="active">Тип группы</label>'+
                             '<select class="custom-select" id="groupType" v-model="groupType">'+
                                 '<option selected value="-1" >Выбрать...</option>'+
                                 '<option  value="0">Администраторы</option>'+
                                 '<option  value="1">Лекторы</option>'+
                                 '<option  value="2">Слушатели</option>'+
                             '</select>'+
                             '<p class="alert alert-danger" v-show ="$root.userGroupTypeAlert">Укажите тип группы пользователей!</p>'+
                        '</div>'+
                        '<div class="form-group col" style="width: 90%;">'+
                             '<input style="margin: 5px;" v-if="($root.editClicked == false)" type="button"  class="btn btn-primary " value="Создать" @click="save"/>'+
                             '<input style="margin: 5px;" v-if="($root.editClicked == true)" type="button"  class="btn btn-primary " value="Сохранить" @click="save"/>'+
                             '<input style="margin: 5px;"  type="button" class="btn btn-danger" value="Отменить" @click="cancel">'+
                        '</div>'+
                    '</form>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div v-else>'+
            '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;" >Groups of users</h1>'+
            '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary" value="Create" @click="addUserGroup">'+
            '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary" value="Display options" @click="$root.showViewConfig=!$root.showViewConfig">'+
            '<div v-if="$root.showInputForm==true" class="card" style="margin: 15px; width: 80%;">'+
                '<div v-if="($root.editClicked == false)" class="card-header text-white bg-primary"><h5>Adding a group</h5></div>'+
                '<div v-if="($root.editClicked == true)"class="card-header text-white bg-primary"><h5>Editing a group</h5></div>'+
                '<div class="card-body">'+
                    '<form>'+
                    '<div class="form-group col" style="width: 90%;">'+
                        '<label for="groupName">User group name</label>'+
                        '<input type="text" class="form-control" id="groupName" v-model="groupName" placeholder="User group name">'+
                        '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Please enter a user group name!</p>'+
                    '</div>'+
                    '<div class="form-group col" style="width: 90%;">'+
                        '<label for="groupAnnotation">Group annotation</label>'+
                        '<textarea type="text" class="form-control" id="groupAnnotation" v-model="groupAnnotation" placeholder="Group annotation"></textarea>'+
                        '<p class="alert alert-danger" v-show ="$root.userGroupAnnotationAlert">Please provide a brief summary of the user group!</p>'+
                    '</div>'+
                    '<div class="form-group col" style="width: 90%;">'+
                        '<label for="active">Group type</label>'+
                        '<select class="custom-select" id="groupType" v-model="groupType">'+
                            '<option selected value="-1" >Choose...</option>'+
                            '<option  value="0">Administrators</option>'+
                            '<option  value="1">Lecturers</option>'+
                            '<option  value="2">Listeners</option>'+
                        '</select>'+
                        '<p class="alert alert-danger" v-show ="$root.userGroupTypeAlert">Please specify the type of user group!</p>'+
                    '</div>'+
                    '<div class="form-group col" style="width: 90%;">'+
                        '<input style="margin: 5px;" v-if="($root.editClicked == false)" type="button"  class="btn btn-primary " value="Create" @click="save"/>'+
                        '<input style="margin: 5px;" v-if="($root.editClicked == true)" type="button"  class="btn btn-primary " value="Save" @click="save"/>'+
                        '<input style="margin: 5px;"  type="button" class="btn btn-danger" value="Cancel" @click="cancel">'+
                    '</div>'+
                    '</form>'+
                '</div>'+
            '</div>'+
        '</div>'
    ,

    methods: {

        cancel: function() {

            if(this.$root.editClicked==true) {
                this.$root.showInputForm=false;
            }
            if((this.$root.editClicked==false)){
                this.$root.showInputForm=false;
                this.id = '';
                this.groupName = '';
                this.groupAnnotation = '';
                this.groupType = -1;

            }
            this.$root.editClicked=false;
            this.$root.userGroupNameAlert=false;
                this.$root.userGroupAnnotationAlert=false;
                this.$root.userGroupTypeAlert=false;

        },
        addUserGroup: function(){
            this.$root.showInputForm=true;
            if(this.$root.editBeenClicked==true){

                this.id='';
                this.groupName = '';
                this.groupAnnotation = '';
                this.groupType = -1;
                this.group = this.$root.tempUserGroup;
                const index = this.users.findIndex(item => item.id === this.user.id)

                if (index > -1) {
                    this.groups.splice(index, 1, this.user)
                } else {
                    this.groups.push(this.group)
                }
                this.$root.tempUserGroup = null;
                this.$root.editBeenClicked=false;
            }
        },

        save: function () {
            var group = {
                groupName: capitalizeFirstLetter(this.groupName),
                groupAnnotation: capitalizeFirstLetter(this.groupAnnotation),
                groupType: this.groupType,
            };


            if (is_empty(this.groupName)) {
                this.$root.userGroupNameAlert = true;
            } else this.$root.userGroupNameAlert = false;

            if (is_empty(this.groupAnnotation)) {
                this.$root.userGroupAnnotationAlert = true;
            } else this.$root.userGroupAnnotationAlert = false;
            if (this.groupType<0) {
                this.$root.userGroupTypeAlert = true;
            } else this.$root.userGroupTypeAlert = false;

            if ((!this.$root.userGroupAnnotationAlert) &&
                (!this.$root.userGroupNameAlert) &&
                (!this.$root.userGroupTypeAlert)
            ) {

                if (this.id) {
                    console.log("edit");
                    this.$root.editClicked = false;
                    groupApi.update({id: this.id}, group).then(result =>
                        result.json().then(data => {
                            var index = getIndex(this.groups, data.id);
                            this.$root.editClicked = false;
                            this.groups.splice(index, 1, data);
                            this.id = ''
                            this.groupName = ''
                            this.groupAnnotation = ''
                            this.groupType =-1
                        })
                        )
                    this.$root.showInputForm=false;
                } else {
                    console.log("create");
                    groupApi.save({}, group).then(result =>
                        result.json().then(data => {
                            this.groups.push(data);
                            this.groupName = ''
                            this.groupAnnotation = ''
                            this.groupType =-1

                        })
                        )
                    this.$root.showInputForm=false;
                }
            }
        }
    }
});

Vue.component('group-row' , {
    props: ['group', 'editMethod', 'groups', 'lang'],
    template:
        '<tr v-if="lang==1">'+
            '<td width="5%"  style="text-align: left;">{{group.id}}</td>'+
        '<td width="35%" style="text-align: center;"">{{group.groupName}}</td>'+
        '<td width="30%" style="text-align: center;">{{group.groupAnnotation}}</td>'+
        '<td v-if="group.groupType==0" width="10%" style="text-align: center;">Администраторы</td>'+
        '<td v-if="group.groupType==1" width="10%" style="text-align: center;">Лекторы</td>'+
        '<td v-if="group.groupType==2" width="10%" style="text-align: center;">Слушатели</td>'+
        '<td width="20%" style="text-align: center;">'+
        '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
        '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
        '</td>'+
        '</tr>'+
        '<tr v-else>'+
        '<td width="5%"  style="text-align: left;">{{group.id}}</td>'+
        '<td width="35%" style="text-align: center;"">{{group.groupName}}</td>'+
        '<td width="30%" style="text-align: center;">{{group.groupAnnotation}}</td>'+
        '<td v-if="group.groupType==0" width="10%" style="text-align: center;">Administrators</td>'+
        '<td v-if="group.groupType==1" width="10%" style="text-align: center;">Lecturers</td>'+
        '<td v-if="group.groupType==2" width="10%" style="text-align: center;">Listeners</td>'+
        '<td width="20%" style="text-align: center;">'+
        '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +
        '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
        '</td>'+
        '</tr>',
    methods: {
        edit: function(){
            this.editMethod(this.group);
            this.$root.showInputForm=true;
            this.$root.editBeenClicked=true;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением необходимо завершить редактирование!");
            } else {
                alert(this.group.id)
                groupApi.remove({id: this.group.id}).then(result => {
                    if (result.ok) {
                        this.groups.splice(this.groups.indexOf(this.group), 1);

                    }
                })
            }

        }
    }

});

Vue.component('group-card' , {
    props: ['group', 'editMethod', 'groups', 'lang'],
    template:
        '<div class="card">'+
            '<div v-if="group.groupType==0" class="card-header text-white bg-danger"># {{groups.indexOf(group) + 1}}</div>'+
            '<div v-if="group.groupType==1" class="card-header text-white bg-primary"># {{groups.indexOf(group) + 1}}</div>'+
            '<div v-if="group.groupType==2" class="card-header text-white bg-warning"># {{groups.indexOf(group) + 1}}</div>'+
            '<ul v-if="lang==1" class="list-group list-group-flush">'+
                '<li class="list-group-item"><b>ID: </b>{{group.id}}</li>'+
                '<li class="list-group-item"><b>Название: </b>{{group.groupName}}</li>'+
                '<li class="list-group-item"><b>Аннотация: </b>{{group.groupAnnotation}}</li>'+
                '<li v-if="group.groupType==0" class="list-group-item"><b>Тип: </b>Администраторы</li>'+
                '<li v-if="group.groupType==1" class="list-group-item"><b>Тип: </b>Лекторы</li>'+
                '<li v-if="group.groupType==2" class="list-group-item"><b>Тип: </b>Слушатели</li>'+
                '<li v-if="group.groupType==2" class="list-group-item"><b>ISMU nid: </b>{{group.nidInIsmu}}</li>'+
                '<li  class="list-group-item"><b>Пользователей: </b>{{group.users.length}} </li>'+
            '</ul>'+


            '<ul v-else class="list-group list-group-flush">'+
                '<li class="list-group-item"><b>ID: </b>{{group.id}}</li>'+
                '<li class="list-group-item"><b>Name: </b>{{group.groupName}}</li>'+
                '<li class="list-group-item"><b>Annotation: </b>{{group.groupAnnotation}}</li>'+
                '<li v-if="group.groupType==0" class="list-group-item"><b>Type: </b>Administrators</li>'+
                '<li v-if="group.groupType==1" class="list-group-item"><b>Type: </b>Lecturers</li>'+
                '<li v-if="group.groupType==2" class="list-group-item"><b>Type: </b>Listeners</li>'+
                '<li v-if="group.groupType==2" class="list-group-item"><b>ISMU nid: </b>{{group.nidInIsmu}}</li>'+
                '<li  class="list-group-item"><b>Users count: </b>{{group.users.length}} </li>'+
            '</ul>'+
            '<div v-if="lang==1" class="card-footer">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                '<input v-if="group.users.length>0" style="margin: 5px;" type = "button" class="btn btn-sm btn-primary" value="Пользователи" @click="showUsers" />' +
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +
                '<input v-if="group.users.length>0" style="margin: 5px;" type = "button" class="btn btn-sm btn-primary" value="Пользователи" @click="showUsers" />' +
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
        '</div>'



    ,
    methods: {
        showUsers: function (){
            this.$root.group = this.group;
            this.$root.showUsers = true;
        },

        edit: function(){
            this.editMethod(this.group);
            this.$root.showInputForm=true;
            this.$root.editBeenClicked=true;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением необходимо завершить редактирование!");
            } else {
                alert(this.group.id)
                groupApi.remove({id: this.group.id}).then(result => {
                    if (result.ok) {
                        this.groups.splice(this.groups.indexOf(this.group), 1);
                    }
                })
            }
        }
    }

});

Vue.component('groups-list', {
    props: ['groups', 'lang'],
    data: function(){
        return {
            group: null,
            sortKey: 'id',
            search: '',
            pageNumber: 0,
            tableView: true,
            noteCount:10,
            groupType:1,
        }
    },

    template:
        ' <div style="position: relative;">'+
            '<group-form :groups="groups" :groupAttr="group" :lang="lang"/>'+
            '<div v-if="$root.showViewConfig">'+
                '<div class="modal-mask">'+
                    '<div class="modal-wrapper">'+
                        '<div class="modal-container">'+
                            '<div v-if="lang==1" class="modal-title">'+
                                '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
                                'Параметры отображения'+
                            '</div>'+
                            '<div v-else class="modal-title">'+
                                '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
                                    'Display options'+
                            '</div>'+
                            '<hr>'+
                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="custom-control custom-checkbox">Вид</label>'+
                                '<div style ="margin-left: 2px;" class="row">'+
                                    '<div class="custom-control custom-checkbox">' +
                                        '<b-form-checkbox type="checkbox" class="form-check-input" id="tableView"  v-on:change="tableView=!tableView" switch></b-form-checkbox>'+
                                    '</div>'+
                                    '<label v-if="tableView">Таблица</label>'+
                                    '<label v-else>Карточки</label>'+
                                '</div>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="custom-control custom-checkbox">View</label>'+
                                '<div style ="margin-left: 2px;" class="row">'+
                                    '<div class="custom-control custom-checkbox">' +
                                        '<b-form-checkbox type="checkbox" class="form-check-input" id="tableView"  v-on:change="tableView=!tableView" switch></b-form-checkbox>'+
                                    '</div>'+
                                    '<label v-if="tableView">Table</label>'+
                                    '<label v-else>Cards</label>'+
                                '</div>'+
                            '</div>'+
                            '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label v-if="lang==1" for="noteCount">Записей на страницу</label>'+
                                '<label v-else for="noteCount">Posts per page</label>'+
                                '<select class="custom-select" id="noteCount" v-model="noteCount" required>'+
                                    '<option value="5">5</option>'+
                                    '<option value="10">10</option>'+
                                    '<option value="15">15</option>'+
                                    '<option value="20">20</option>'+
                                    '<option value="25">25</option>'+
                                    '<option value="30">30</option>'+
                                '</select>'+
                            '</div>'+

                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="groupType">Тип</label>'+
                                '<select class="custom-select" id="groupType" v-model="groupType" required>'+
                                    '<option selected value="-1">Все</option>'+
                                    '<option value="0">Администраторы</option>'+
                                    '<option value="1">Пользователи</option>'+
                                    '<option value="2">Слушатели</option>'+
                                '</select>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="groupType">Group type</label>'+
                                '<select class="custom-select" id="groupType" v-model="groupType" required>'+
                                    '<option selected value="-1">All</option>'+
                                    '<option value="0">Administrators</option>'+
                                    '<option value="1">Users</option>'+
                                    '<option value="2">Listeners</option>'+
                                '</select>'+
                            '</div>'+

                            '<br>'+
                            '<div class="modal-footer">'+
                                '<button class="btn btn-primary" @click="closeViewConfigWindow">Ок</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+

            '<div v-if="$root.showUsers">'+
                '<div class="modal-mask">'+
                    '<div class="modal-wrapper">'+
                        '<div class="modal-container">'+
                            '<div class="modal-title">'+
                                '<button class="close" @click="closeUserWindow">&times;</button>'+
                                'Пользователи группы \"{{$root.group.groupName}}\"'+
                            '</div>'+
                            '<div class="modal-body-auto">'+
                                '<ul class="list-group list-group-flush" >'+
                                    '<li class="list-group-item" v-for="user in $root.group.users">{{user.lastname}} {{user.firstname}} {{user.secname}}</li>'+
                                '</ul>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                                '<button class="btn btn-sm btn-primary" @click="closeUserWindow">Ок</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+


            '<div v-if="$root.showInputForm==false" class="card" style="margin-top: 5px; min-width: 90%;" >'+
                '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Группы пользователей</h5><h5 v-else>Users groups</h5></div>'+
                '<div class="card-body">'+

                    '<div v-if="lang==1" class="input-group mb-3">'+
                        '<input  v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                        '<div class="input-group-append">'+
                            '<button v-show="search.length>0"  class="btn btn-danger" style="margin: 0px;"  @click="clearSearch" type="button">Очистить</button>'+
                        '</div>'+
                    '</div>'+
                    '<div v-else class="input-group mb-3">'+
                        '<input v-model="search" id="search" class="form-control"  placeholder="Search">'+
                        '<div class="input-group-append">'+
                            '<button v-show="search.length>0"  class="btn btn-danger" style="margin: 0px;"   @click="clearSearch" type="button">Clear</button>'+
                        '</div>'+
                    '</div>'+

                    '<div v-if="tableView">'+
                        '<table class="table" style="margin: 5px;">'+
                            '<thead>'+
                                '<tr v-if="lang==1">'+
                                    '<th width="5%" scope="col" style="text-align: left;"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                    '<th width="35%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byGroupName" @click="byGroupName">Имя группы</a></th>'+
                                    '<th width="30%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byGroupAnnotation" @click="byGroupAnnotation">Аннотация</a></th>'+
                                    '<th width="10%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byGroupType" @click="byGroupType">Тип</a></th>'+
                                    '<th width="20%" scope="col" style="text-align: center;">Действие</th>'+
                                '</tr>'+
                                '<tr v-else>'+
                                    '<th width="5%" scope="col" style="text-align: left;"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                    '<th width="35%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byGroupName" @click="byGroupName">Group name</a></th>'+
                                    '<th width="30%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byGroupAnnotation" @click="byGroupAnnotation">Group description</a></th>'+
                                    '<th width="10%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byGroupType" @click="byGroupType">Type</a></th>'+
                                    '<th width="20%" scope="col" style="text-align: center;">Action</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<group-row v-for="group in paginatedData" :key="group.id" :group = "group" :editMethod="editMethod" :groups="groups" :lang="lang"/>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>'+
                    '<div v-else>'+
                        '<hr>'+
                        '<div class="card-columns">'+
                            '<group-card v-for="group in paginatedData" :key="group.id" :group = "group" :editMethod="editMethod" :groups="groups" :lang="lang"/>' +
                        '</div>'+
                        '<hr>'+
                    '</div>'+
                '</div>'+
            '</div>'+

            '<div v-if="((pageCount!=1)&($root.showInputForm==false)&(lang==1))"  align="center" style="margin: 15px;">'+
                '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
            '<div v-if="((pageCount!=1)&($root.showInputForm==false)&(lang==2))"  align="center" style="margin: 15px;">'+
                '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
        '</div>',
    computed: {
        sortedGroups() {
            const k = this.sortKey;
            if(this.groupType > -1){
                 return  this.groups.filter(group => group.groupType ==this.groupType).sort(dynamicSort(k));
            } else
            return this.groups.sort(dynamicSort(k));
        },
        filteredGroups() {
            const s = this.search.toLowerCase();
            //return this.sortedGroups.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedGroups.filter(sortedGroup =>
                _.some(sortedGroup, v => {
                    if (!(v instanceof Object)) {
                        this.pageNumber=0;
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        },
        pageCount(){
            let l = this.filteredGroups.length,
                s = parseInt(this.noteCount);
            return Math.ceil(l/s);

        },

        paginatedData(){
            const start = this.pageNumber * parseInt(this.noteCount),
                end = start + parseInt(this.noteCount);

            return this.filteredGroups.slice(start, end);

        }
    },
    watch: {
        tableView(newTableView) {
            if(newTableView){
                localStorage.userGroupTableView=1;
            } else{
                localStorage.userGroupTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.userGroupNoteCount != newNoteCount){
                localStorage.userGroupNoteCount = newNoteCount;
            }
        },
        search(newSearch) {
            if(localStorage.userGroupSearch != newSearch){
                localStorage.userGroupSearch = newSearch;
            }
        },
    },
    mounted() {
        if (localStorage.userGroupNoteCount) {
            this.noteCount = localStorage.userGroupNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.userGroupSearch) {
            this.search = localStorage.userGroupSearch;
        } else {
            this.search='';
        }

        if (localStorage.userGroupTableView) {
            if(localStorage.userGroupTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }

    },
    methods: {
        closeUserWindow: function (){
            this.$root.users = null;
            this.$root.showUsers = false;
        },
        clearSearch: function (){
            this.search='';
        },

        editMethod: function(group){
            this.group = group;
        },
        closeViewConfigWindow: function(){
            this.$root.showViewConfig=false;
        },
        byId: function(){
            this.sortKey="id";
        },
        byGroupName: function(){
            this.sortKey="groupName";
        },
        byGroupAnnotation: function(){
            this.sortKey="groupAnnotation";
        },
        byGroupType: function(){
        this.sortKey="groupType";
        },
        nextPage(){
            this.pageNumber++;
        },
         prevPage(){
            this.pageNumber--;
        }
    }

});

var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
            '<groups-list :groups="groups" :lang="lang" /> ' +
        '</div>',
    data: {
        groups: [],
        editClicked:false,
        userGroupNameAlert:false,
        userGroupAnnotationAlert:false,
        showInputForm:false,
        editBeenClicked:false,
        tempUserGroup:null,
        userGroupTypeAlert:false,
        showViewConfig:false,
        lang:'',
        showViewConfig:false,
        group:'',
        showUsers:false,
    },

    created: function () {
        groupApi.get({id: this.$root.id}).then(result =>
                result.json().then(data =>
                    this.groups=data
                )
         )
    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},

});