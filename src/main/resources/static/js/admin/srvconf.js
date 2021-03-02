function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

function checkDefaultserver(list,defaultserver) {
    for (var i =0; i< list.length; i++) {
        if ((list[i].defaultserver == defaultserver)&&(defaultserver!=0)) {
            return 1;
        }
    }
    return 0;
}
function checkDefaultserverId(list,defaultserver) {
    for (var i =0; i< list.length; i++) {
        if ((list[i].defaultserver == defaultserver)&&(defaultserver!=0)) {
            return list[i].id;
        }
    }
    return 0;
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
var serverApi = Vue.resource('/srv{/id}');

Vue.component('server-form', {
    props: ['servers', 'serverAttr'],
    data: function() {
        return {
            id:'',
            serverName:'',
            serverDescription:'',
            serverUrl:'',
            serverSalt:'',
            serverDefault:'',
            serverPanelUrl:'',
        }
    },

    watch:{
        serverAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.serverName = newVal.serverName;
            this.serverDescription = newVal.serverDescription;
            this.serverUrl = newVal.serverUrl;
            this.serverSalt = newVal.serverSalt;
            this.serverDefault = newVal.serverDefault;
            this.serverPanelUrl = newVal.serverPanelUrl;
        }
    },
    template:
        '<div>'+
            '<div>'+
                '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Введите параметры сервера Big Blue Button для работы с системой</h1>'+
            '</div>'+
                '<form>'+
                    '<div>'+
                    '<div class="form-group row">'+
                        '<label for="serverName" class="col-sm-2 col-form-label">Название сервера</label>'+
                            '<div class="col-sm-10">'+
                                '<input type="text" class="form-control" id="server Name" v-model="serverName" placeholder="Название сервера">'+
                                '<p class="alert alert-danger" v-show="$root.serverNameAlert">Необходимо указать название сервера</p>'+
                            '</div>'+
                        '</div>'+
                    '<div class="form-group row">'+
                        '<label for="serverDescription" class="col-sm-2 col-form-label">Описание сервера</label>'+
                            '<div class="col-sm-10">'+
                                '<textarea type="text" class="form-control" id="serverDescription" v-model="serverDescription" placeholder="Описание сервера"></textarea>'+
                                '<p class="alert alert-danger" v-show="$root.serverDescriptionAlert" >Необходимо указать описание сервера</p>'+
                            '</div>'+
                    '</div>'+
                    '<div class="form-group row">'+
                        '<label for="serverDescription" class="col-sm-2 col-form-label">Адрес сервера</label>'+
                            '<div class="col-sm-10">'+
                                '<textarea type="text" class="form-control" id="serverUrl" v-model="serverUrl" placeholder="Адрес сервера"></textarea>'+
                                '<p class="alert alert-danger" v-show="$root.serverUrlAlert" >Необходимо указать адрес сервера</p>'+
                            '</div>'+
                    '</div>'+
                    '<div class="form-group row">'+
                        '<label for="serverDescription" class="col-sm-2 col-form-label">Соль сервера</label>'+
                            '<div class="col-sm-10">'+
                                '<textarea type="text" class="form-control" id="serverSalt" v-model="serverSalt" placeholder="Соль сервера"></textarea>'+
                                '<p class="alert alert-danger" v-show="$root.serverSaltAlert" >Необходимо указать соль сервера</p>'+
                            '</div>'+
                    '</div>'+
                    '<div class="form-group row">'+
                        '<label for="serverDefault" class="col-sm-2 col-form-label">Основной сервер?</label>'+
                            '<div class="col-sm-10">'+
                                '<select class="custom-select" id="serverDefault" v-model="serverDefault">'+
                                    '<option selected>Выбрать...</option>'+
                                    '<option value="1">Да</option>'+
                                    '<option value="0">Нет</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show="$root.serverDefaultAlert" >Необходимо указать является ли сервер основным</p>'+
                            '</div>'+
                    '</div>'+
        '<div class="form-group row">'+
        '<label for="serverPanelUrl" class="col-sm-2 col-form-label">URL панели</label>'+
        '<div class="col-sm-10">'+
        '<textarea type="text" class="form-control" id="serverPanelUrl" v-model="serverPanelUrl" placeholder="URL панели"></textarea>'+
        '<p class="alert alert-danger" v-show="$root.serverPanelUrlAlert" >Необходимо указать URL панели</p>'+
        '</div>'+
        '</div>'+
                '</div>'+
        '<div class="form-group row">'+
            '<div class="col-sm-10">'+
                '<input v-if="(($root.editClicked == false))" type="button"  class="btn btn-primary " value="Создать" @click="save">'+
                '<input v-if="$root.editClicked == true" type="button"  class="btn btn-primary " value="Сохранить" @click="save">'+
            '</div>'+
        '</div>'+

        '</form>'+
        '</div>',

    methods: {
        save: function () {
            var server = {
                serverName: capitalizeFirstLetter(this.serverName),
                serverDescription: capitalizeFirstLetter(this.serverDescription),
                serverUrl: this.serverUrl,
                serverSalt: this.serverSalt,
                serverDefault: this.serverDefault,
                serverPanelUrl: this.serverPanelUrl,
            };
//проверяем заполненность полей, если что то не заполнено - показываем ругательства
            if (is_empty(this.serverName)) {
                this.$root.serverNameAlert = true;
            } else {
                this.$root.serverNameAlert = false;
            }
            if (is_empty(this.serverDescription)) {
                this.$root.serverDescriptionAlert = true;
            } else {
                this.$root.serverDescriptionAlert = false;
            }
            if (is_empty(this.serverUrl)) {
                this.$root.serverUrlAlert = true;
            } else {
                this.$root.serverUrlAlert = false;
            }
            if (is_empty(this.serverPanelUrl)) {
                this.$root.serverPanelUrlAlert = true;
            } else {
                this.$root.serverPanelUrlAlert = false;
            }
            if (is_empty(this.serverSalt)) {
                this.$root.serverSaltAlert = true;
            } else {
                this.$root.serverSaltAlert = false;
            }
            if(!isNumeric(this.serverDefault)){
                this.$root.serverDefaultAlert = true;
            } else {
                this.$root.serverDefaultAlert = false;
            }
            if ((!this.$root.serverNameAlert) &&
                (!this.$root.serverDescriptionAlert) &&
                (!this.$root.serverUrlAlert) &&
                (!this.$root.serverPanelUrlAlert) &&
                (!this.$root.serverDefaultAlert) &&
                (!this.$root.serverSaltAlert)
            ) {
                    if (this.id) {
                            this.$root.defaultserverConflictAlert=false;
                            this.$root.editClicked = false;

                            serverApi.update({id: this.id}, server).then(result =>
                                result.json().then(data => {
                                    var index = getIndex(this.servers, data.id);
                                        this.servers.splice(index, 1, data);
                                        this.id = ''
                                        this.serverName = ''
                                        this.serverDescription = ''
                                        this.serverSalt = ''
                                        this.serverUrl = ''
                                        this.serverDefault = ''
                                        this.serverPanelUrl = ''
                                })
                            )
                    } else {
                            serverApi.save({}, server).then(result =>
                                result.json().then(data => {
                                    this.servers.push(data);
                                        this.serverName = ''
                                        this.serverDescription = ''
                                        this.serverSalt = ''
                                        this.serverUrl = ''
                                        this.defaultserver = ''
                                        this.serverDefault = ''
                                        this.serverPanelUrl = ''
                                })
                            )
                        }
                    }
            }
        }

});

Vue.component('server-row' , {
    props: ['server', 'editMethod', 'servers'],
    template:
        '<tr>'+
            '<td align="center" width="25%">{{server.serverName}}</td>'+
            '<td align="center" width="20%">{{server.serverUrl}}</td>'+
            '<td align="center" width="25%">{{server.serverSalt}}</td>'+
            '<td align="center" width="5%" ><p v-if="server.serverDefault==0">Нет</p><p v-if="server.serverDefault==1">Да</p></td>'+
            '<td align="center" width="25%">'+
                '<input type = "button" v-on:click="$root.editClicked = true" class="btn btn-primary" value="Изменить" @click="edit" />' +
                '<input type = "button"  class="btn btn-danger" value="X" @click="del" />'+
            '</td>'+
        '</tr>',
    methods: {
        edit: function(){
            this.editMethod(this.server);
        },
        del: function() {
            serverApi.remove({id: this.server.id}).then(result => {
                if (result.ok) {
                    this.servers.splice(this.servers.indexOf(this.server), 1)
            }
            })
        }
        }
});

Vue.component('servers-list', {
    props: ['servers'],
    data: function(){
        return {
            server: null
        }
    },

    template:
        '<div style="position: relative; width: 1000px;">'+
            '<server-form :servers="servers" :serverAttr="server"/>'+
                '<table style="width: 1000px;" class="table">'+
                    '<thead>'+
                        '<tr>'+
                            '<th width="25%" scope="col">Название сервера</th>'+
                            '<th width="20%" scope="col">URL сервера</th>'+
                            '<th width="25%" scope="col">Соль сервера</th>'+
                            '<th width="5%" scope="col">Основной</th>'+
                            '<th width="25%" scope="col">Действие</th>'+
                        '</tr>'+
                    '</thead>'+
                '<tbody>'+
            '<server-row v-for="server in servers" :key="server.id" :server = "server" ' +
            ':editMethod="editMethod" :servers="servers"/>' +
        '</tbody>' +
        '</table>' +
        '</div>',

    methods: {
        editMethod: function(server){
            this.server = server;
        },
    }

});

var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
        '<servers-list :servers="servers" /> ' +
        '</div>',
    data: {
        servers: [],
        serverNameAlert:false,
        serverDescriptionAlert:false,
        serverUrlAlert:false,
        serverSaltAlert:false,
        editClicked:false,
        serverDefaultAlert:false,
        serverPanelUrlAlert:false,


    },

    created: function () {
        serverApi.get({id: this.$root.lectionId}).then(result =>
                result.json().then(data =>
                    data.forEach(server => {this.servers.push(server);
                    })
                )
    )},
});