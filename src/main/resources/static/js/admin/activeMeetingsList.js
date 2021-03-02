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


var llistApi = Vue.resource('/activeMeetings{/id}');


Vue.component('lection-list', {
    props: ['lections', 'groups'],
    data: function(){
        return {
            search:'',
            lections_filter:'4',
            groups_filter:'0',
        }
    },

    template:


        '<div style="position: relative;">'+
        '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Активные вебинарные комнаты</h1>'+
        '<div  v-show="!this.$root.showFrame">'+
            '<div class="card" style="margin-top: 15px; min-width: 900px;">'+
                '<div class="card-header text-white bg-primary"><h5 class="card-title" style="padding-top:5px;">Активные комнаты</h5></div>'+
                    '<div class="card-body">'+
                        '<label  style="margin: 5px;" for="deskId">Поиск:</label>'+
                        '<input style="margin: 5px;" v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                        '<h5 class="card-title" style="padding-top:5px;">Всего(с учетом результатов поиска): {{this.filteredLections.length}}</h5>'+
                        '<table class="table table-striped">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th width="5%"  scope="col" style="text-align: center">#</th>'+
                                    '<th width="40%" style="text-align: center;"><a href="#"  v-bind:class="byLectionName" @click="byLectionName">Лекция</a></th>'+
                                    '<th width="40%" style="text-align: center;"><a href="#"  v-bind:class="byLectionCourceId" @click="byLectionCourceId">Курс</a></th>'+
                                    '<th width="15%" style="text-align: center;">Действие</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<lection-row v-for="lection in filteredLections" :lections="lections" :key="lection.id" :lection = "lection"  />' +
                            '</tbody>' +
                        '</table>' +
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
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));

        }
    },
    methods: {

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

    }
});

Vue.component('lection-row' , {
    props: ['lection','lections'],

    template:
        '<tr>'+
            '<td align="left" width="5%">{{lections.indexOf(lection) + 1}}</td>'+
            '<td width="40%" style="text-align: center;">{{lection.lectionName}}(id: {{lection.id}}, автор: {{lection.user.lastname}}  {{lection.user.firstname}} {{lection.user.secname}} )</td>'+
            '<td width="40%" style="text-align: center;">{{lection.cource.courceName}}(id: {{lection.courceId}}, автор: {{lection.cource.user.lastname}}  {{lection.cource.user.firstname}} {{lection.cource.user.secname}} )</td>'+
            '<td width="20%" style="text-align: center;"><input style="margin: 5px;"  type = "button" class="btn btn-sm btn-danger" value="Присоединиться" @click="comeIn" /></td>'+
        '</tr>',
    data: {
        comeInUrl:'',



    },
    methods: {
        comeIn: function () {
                window.location.href = '/activeMeetings/'+this.lection.id;
        },


    }
});

app = new Vue({
    el: '#app',
    template:
        '<div>'+
        '<lection-list :lections="lections" />'+
        '</div>',
    data: {
        lections: [],
        groups: [],
        sortKey:'',
        showFrame:false,
        lectionName:'',
        courceName:'',
        watchUrl:'',


    },
    created: function () {

        llistApi.get().then(result =>
            result.json().then(data => ( this.lections = data ))
        );
    },
});



