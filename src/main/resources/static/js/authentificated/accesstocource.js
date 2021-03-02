function paddNum(num, padsize) {

    return typeof num !== 'undefined'
        ? num.toString().length > padsize
            ? num
            : new Array(padsize - num.toString().length + 1).join('0') + num
        : undefined
        ;

}

function chunkArray(inputArray, chunkSize) {

    const results = [];

    while (inputArray.length) {
        results.push(inputArray.splice(0, chunkSize));
    }

    return results;

}

function areSameDates(date1, date2) {

    return (date1.getDate() === date2.getDate()) &&
        (date1.getMonth() === date2.getMonth()) &&
        (date1.getFullYear() === date2.getFullYear())
        ;

}

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}

var stompClient = null
const handlers = []

function connect() {
    const socket = new SockJS('/gs-guide-websocket')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/topic/activity', courceForStudents => {
            handlers.forEach(handler => handler(JSON.parse(courceForStudents.body)))
        })
    })
}

function addHandler(handler) {
    handlers.push(handler)
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect()
    }
    console.log("Disconnected")
}


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
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
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
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}


const formatRE = /,|\.|-| |:|\/|\\/;
const dayRE = /D+/;
const monthRE = /M+/;
const yearRE = /Y+/;
const hoursRE = /h+/i;
const minutesRE = /m+/;
const secondsRE = /s+/;



var courceForStudentsApi = Vue.resource('/courcestudents{/id}');

var courceApi = Vue.resource('/cource{/id}');
Vue.component('multiselect', window.VueMultiselect.default);

Vue.component('date-pick', {
    props: {
        value: {type: String, default: ''},
        format: {type: String, default: 'YYYY-MM-DD'},
        displayFormat: {type: String},
        editable: {type: Boolean, default: true},
        hasInputElement: {type: Boolean, default: true},
        inputAttributes: {type: Object},
        selectableYearRange: {type: Number, default: 40},
        parseDate: {type: Function},
        formatDate: {type: Function},
        pickTime: {type: Boolean, default: false},
        pickMinutes: {type: Boolean, default: true},
        pickSeconds: {type: Boolean, default: false},
        isDateDisabled: {type: Function, default: () => false},
        nextMonthCaption: {type: String, default: 'Следующий месяц'},
        prevMonthCaption: {type: String, default: 'Предидущий месяц'},
        setTimeCaption: {type: String, default: 'Время:'},
        mobileBreakpointWidth: {type: Number, default: 500},
        weekdays: {
            type: Array,
            default: () => ([
                'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'
            ])
        },
        months: {
            type: Array,
            default: () => ([
                'Январь', 'Февраль', 'Март', 'Апрель',
                'Май', 'Июнь', 'Июль', 'Август',
                'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ])
        },
        startWeekOnSunday: {type: Boolean, default: false}
    },

    template:
        '<div class="vdpComponent" v-bind:class="{vdpWithInput: hasInputElement}">'+
            '<div class="input-group mb-3">'+
                '<input pattern="/^20[0-9]{2}[-]{1}[0-1]{1}[0-2]{1}[-]{1}[0-3]{1}[0-9]{1} [0-5]{1}[0-9]{1}[:][0-5]{1}[0-9]{1}[:][0-5]{1}[0-9]{1}$/" type="text" value="Выбрать дату" class="form-control" v-if="hasInputElement" aria-grabbed="" v-bind="inputAttributes" v-bind:readonly="isReadOnly" v-bind:value="inputValue" v-on:input="editable && processUserInput($event.target.value)" v-on:focus="editable && open()" v-on:click="editable && open()">'+
                '<div class="input-group-append">'+
                    '<button v-if="editable && hasInputElement && inputValue" class="btn btn-danger"  style="margin: 0px;  height: calc(1.5em + .75rem + 2px);" type="button" v-on:click="clear">X</button>' +
                '</div>'+
            '</div>'+

            '<transition name="vdp-toggle-calendar">'+
                '<div v-if="opened" class="vdpOuterWrap" ref="outerWrap" v-on:click="closeViaOverlay" v-bind:class="[positionClass, {vdpFloating: hasInputElement}]" >'+
                    '<div class="vdpInnerWrap">'+
                        '<header class="vdpHeader">'+
                            '<button class="vdpArrow vdpArrowPrev" v-bind:title="prevMonthCaption" type="button" v-on:click="incrementMonth(-1)">{{prevMonthCaption}}</button>'+
                            '<button class="vdpArrow vdpArrowNext" type="button" v-bind:title="nextMonthCaption" v-on:click="incrementMonth(1)">{{nextMonthCaption}}</button>'+

                            '<div class="vdpPeriodControls">'+
                                '<div class="vdpPeriodControl">'+
                                    '<button v-bind:class="directionClass" v-bind:key="currentPeriod.month" type="button">{{months[currentPeriod.month]}}</button>'+
                                    '<select v-model="currentPeriod.month">'+
                                        '<option v-for="(month, index) in months" v-bind:value="index" v-bind:key="month">{{month}}</option>'+
                                    '</select>'+
                                '</div>'+
                                '<div class="vdpPeriodControl">'+
                                    '<button v-bind:class="directionClass" v-bind:key="currentPeriod.year" type="button">{{currentPeriod.year}}г.</button>'+
                                    '<select v-model="currentPeriod.year">'+
                                        '<option v-for="year in yearRange" v-bind:value="year" v-bind:key="year">{{year}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+
                        '</header>'+
                        '<table class="vdpTable">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th class="vdpHeadCell" v-for="weekday in weekdaysSorted" v-bind:key="weekday">'+
                                        '<span class="vdpHeadCellContent">{{weekday}}</span>'+
                                    '</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody v-bind:key="currentPeriod.year - currentPeriod.month" v-bind:class="directionClass">'+
                                '<tr class="vdpRow" v-for="(week, weekIndex) in currentPeriodDates" v-bind:key="weekIndex">'+
                                    '<td class="vdpCell" v-for="item in week" v-bind:class="{ selectable: !item.disabled, selected: item.selected, disabled: item.disabled, today: item.today, outOfRange: item.outOfRange }" v-bind:data-id="item.dateKey" v-bind:key="item.dateKey" v-on:click="selectDateItem(item)">'+
                                        '<div class="vdpCellContent">{{item.date.getDate()}}</div>'+
                                    '</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                        '<div v-if="pickTime && currentTime" class="vdpTimeControls">'+
                            '<span class="vdpTimeCaption">{{setTimeCaption}}</span>'+
                            '<div class="vdpTimeUnit">'+
                                '<pre><span>{{currentTime.hoursPadded}}</span><br></pre>'+
                                '<input type="number" pattern="\d*" class="vdpHoursInput" v-on:input.prevent="inputTime(\'setHours\', $event)" v-bind:value="currentTime.hoursPadded">'+
                            '</div>'+
                            '<span v-if="pickMinutes" class="vdpTimeSeparator">:</span>'+
                            '<div v-if="pickMinutes" class="vdpTimeUnit">'+
                                '<pre><span>{{currentTime.minutesPadded}}</span><br></pre>'+
                                '<input v-if="pickMinutes" type="number" pattern="\d*" class="vdpMinutesInput" v-on:input="inputTime(\'setMinutes\' , $event)" v-bind:value="currentTime.minutesPadded">'+
                            '</div>'+
                            '<span v-if="pickSeconds" class="vdpTimeSeparator">:</span>'+
                            '<div v-if="pickSeconds" class="vdpTimeUnit">'+
                                '<pre><span>{{currentTime.secondsPadded}}</span><br></pre>'+
                                '<input v-if="pickSeconds" type="number" pattern="\d*" class="vdpSecondsInput" v-on:input="inputTime(\'setSeconds\', $event)" v-bind:value="currentTime.secondsPadded">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</transition>'+
        '</div>',

    data() {
        return {
            inputValue: this.valueToInputFormat(this.value),
            currentPeriod: this.getPeriodFromValue(this.value, this.format),
            direction: undefined,
            positionClass: undefined,
            opened: !this.hasInputElement
        };
    },
    computed: {

        valueDate() {

            const value = this.value;
            const format = this.format;

            return value
                ? this.parseDateString(value, format)
                : undefined
                ;

        },

        isReadOnly() {
            return !this.editable || (this.inputAttributes && this.inputAttributes.readonly);
        },

        isValidValue() {

            const valueDate = this.valueDate;
            return this.value ? Boolean(valueDate) : true;

        },

        currentPeriodDates() {

            const {year, month} = this.currentPeriod;
            const days = [];
            const date = new Date(year, month, 1);
            const today = new Date();
            const offset = this.startWeekOnSunday ? 1 : 0;

            // append prev month dates
            const startDay = date.getDay() || 7;

            if (startDay > (1 - offset)) {
                for (let i = startDay - (2 - offset); i >= 0; i--) {

                    const prevDate = new Date(date);
                    prevDate.setDate(-i);
                    days.push({outOfRange: true, date: prevDate});

                }
            }

            while (date.getMonth() === month) {
                days.push({date: new Date(date)});
                date.setDate(date.getDate() + 1);
            }

            // append next month dates
            const daysLeft = 7 - days.length % 7;

            for (let i = 1; i <= daysLeft; i++) {

                const nextDate = new Date(date);
                nextDate.setDate(i);
                days.push({outOfRange: true, date: nextDate});

            }

            // define day states
            days.forEach(day => {
                day.disabled = this.isDateDisabled(day.date);
                day.today = areSameDates(day.date, today);
                day.dateKey = [
                    day.date.getFullYear(), day.date.getMonth() + 1, day.date.getDate()
                ].join('-');
                day.selected = this.valueDate ? areSameDates(day.date, this.valueDate) : false;
            });

            return chunkArray(days, 7);

        },

        yearRange() {
            const years = [];
            const currentYear = this.currentPeriod.year;
            const startYear = currentYear - this.selectableYearRange;
            const endYear = currentYear + this.selectableYearRange;

            for (let i = startYear; i <= endYear; i++) {
                years.push(i);
            }

            return years;

        },

        currentTime() {

            const currentDate = this.valueDate;

            return currentDate ? {
                hours: currentDate.getHours(),
                minutes: currentDate.getMinutes(),
                seconds: currentDate.getSeconds(),
                hoursPadded: paddNum(currentDate.getHours(), 1),
                minutesPadded: paddNum(currentDate.getMinutes(), 2),
                secondsPadded: paddNum(currentDate.getSeconds(), 2)
            } : undefined;

        },

        directionClass() {

            return this.direction ? `vdp${this.direction}Direction` : undefined;

        },

        weekdaysSorted() {

            if (this.startWeekOnSunday) {
                const weekdays = this.weekdays.slice();
                weekdays.unshift(weekdays.pop());
                return weekdays;
            } else {
                return this.weekdays;
            }

        }

    },
    watch: {

        value(value) {

            if (this.isValidValue) {
                this.inputValue = this.valueToInputFormat(value);
                this.currentPeriod = this.getPeriodFromValue(value, this.format);
            }

        },

        currentPeriod(currentPeriod, oldPeriod) {

            const currentDate = new Date(currentPeriod.year, currentPeriod.month).getTime();
            const oldDate = new Date(oldPeriod.year, oldPeriod.month).getTime();

            this.direction = currentDate !== oldDate
                ? (currentDate > oldDate ? 'Вперед' : 'Назад')
                : undefined
            ;

        }

    },

    beforeDestroy() {

        this.removeCloseEvents();
        this.teardownPosition();

    },
    methods: {

        valueToInputFormat(value) {

            return !this.displayFormat ? value : this.formatDateToString(
                this.parseDateString(value, this.format), this.displayFormat
            ) || value;

        },

        getPeriodFromValue(dateString, format) {

            const date = this.parseDateString(dateString, format) || new Date();

            return {month: date.getMonth(), year: date.getFullYear()};

        },

        parseDateString(dateString, dateFormat) {

            return !dateString
                ? undefined
                : this.parseDate
                    ? this.parseDate(dateString, dateFormat)
                    : this.parseSimpleDateString(dateString, dateFormat)
                ;

        },

        formatDateToString(date, dateFormat) {

            return !date
                ? ''
                : this.formatDate
                    ? this.formatDate(date, dateFormat)
                    : this.formatSimpleDateToString(date, dateFormat)
                ;

        },

        parseSimpleDateString(dateString, dateFormat) {

            let day, month, year, hours, minutes, seconds;

            const dateParts = dateString.split(formatRE);
            const formatParts = dateFormat.split(formatRE);
            const partsSize = formatParts.length;

            for (let i = 0; i < partsSize; i++) {

                if (formatParts[i].match(dayRE)) {
                    day = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(monthRE)) {
                    month = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(yearRE)) {
                    year = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(hoursRE)) {
                    hours = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(minutesRE)) {
                    minutes = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(secondsRE)) {
                    seconds = parseInt(dateParts[i], 10);
                }

            };

            const resolvedDate = new Date(
                [paddNum(year, 4), paddNum(month, 2), paddNum(day, 2)].join('-')
            );

            if (isNaN(resolvedDate)) {
                return undefined;
            } else {

                const date = new Date(year, month - 1, day);

                [
                    [year, 'setFullYear'],
                    [hours, 'setHours'],
                    [minutes, 'setMinutes'],
                    [seconds, 'setSeconds']
                ].forEach(([value, method]) => {
                    typeof value !== 'undefined' && date[method](value);
                });

                return date;
            }

        },

        formatSimpleDateToString(date, dateFormat) {

            return dateFormat
                .replace(yearRE, match => date.getFullYear())
                .replace(monthRE, match => paddNum(date.getMonth() + 1, match.length))
                .replace(dayRE, match => paddNum(date.getDate(), match.length))
                .replace(hoursRE, match => paddNum(date.getHours(), match.length))
                .replace(minutesRE, match => paddNum(date.getMinutes(), match.length))
                .replace(secondsRE, match => paddNum(date.getSeconds(), match.length))
                ;

        },

        incrementMonth(increment = 1) {

            const refDate = new Date(this.currentPeriod.year, this.currentPeriod.month);
            const incrementDate = new Date(refDate.getFullYear(), refDate.getMonth() + increment);

            this.currentPeriod = {
                month: incrementDate.getMonth(),
                year: incrementDate.getFullYear()
            };

        },

        processUserInput(userText) {

            const userDate = this.parseDateString(
                userText, this.displayFormat || this.format
            );

            this.inputValue = userText;

            this.$emit('input', userDate
                ? this.formatDateToString(userDate, this.format)
                : userText
            );

        },

        open() {

            if (!this.opened) {
                this.opened = true;
                this.currentPeriod = this.getPeriodFromValue(this.value, this.format);
                this.addCloseEvents();
                this.setupPosition();
            }
            this.direction = undefined;

        },

        close() {

            if (this.opened) {
                this.opened = false;
                this.direction = undefined;
                this.removeCloseEvents();
                this.teardownPosition();
            }

        },

        closeViaOverlay(e) {

            if (this.hasInputElement && e.target === this.$refs.outerWrap) {
                this.close();
            }

        },

        addCloseEvents() {

            if (!this.closeEventListener) {

                this.closeEventListener = e => this.inspectCloseEvent(e);

                ['click', 'keyup', 'focusin'].forEach(
                    eventName => document.addEventListener(eventName, this.closeEventListener)
                );

            }

        },

        inspectCloseEvent(event) {

            if (event.keyCode) {
                event.keyCode === 27 && this.close();
            } else if (!(event.target === this.$el) && !this.$el.contains(event.target)) {
                this.close();
            }

        },

        removeCloseEvents() {

            if (this.closeEventListener) {

                ['click', 'keyup'].forEach(
                    eventName => document.removeEventListener(eventName, this.closeEventListener)
                );

                delete this.closeEventListener;

            }

        },

        setupPosition() {

            if (!this.positionEventListener) {
                this.positionEventListener = () => this.positionFloater();
                window.addEventListener('resize', this.positionEventListener);
            }

            this.positionFloater();

        },

        positionFloater() {

            const inputRect = this.$el.getBoundingClientRect();

            let verticalClass = 'vdpPositionTop';
            let horizontalClass = 'vdpPositionLeft';

            const calculate = () => {

                const rect = this.$refs.outerWrap.getBoundingClientRect();
                const floaterHeight = rect.height;
                const floaterWidth = rect.width;

                if (window.innerWidth > this.mobileBreakpointWidth) {

                    // vertical
                    if (
                        (inputRect.top + inputRect.height + floaterHeight > window.innerHeight) &&
                        (inputRect.top - floaterHeight > 0)
                    ) {
                        verticalClass = 'vdpPositionBottom';
                    }

                    // horizontal
                    if (inputRect.left + floaterWidth > window.innerWidth) {
                        horizontalClass = 'vdpPositionRight';
                    }

                    this.positionClass = ['vdpPositionReady', verticalClass, horizontalClass].join(' ');

                } else {

                    this.positionClass = 'vdpPositionFixed';

                }

            };

            this.$refs.outerWrap ? calculate() : this.$nextTick(calculate);

        },

        teardownPosition() {

            if (this.positionEventListener) {
                this.positionClass = undefined;
                window.removeEventListener('resize', this.positionEventListener);
                delete this.positionEventListener;
            }

        },

        clear() {

            this.$emit('input', '');

        },

        selectDateItem(item) {

            if (!item.disabled) {

                const newDate = new Date(item.date);

                if (this.currentTime) {
                    newDate.setHours(this.currentTime.hours);
                    newDate.setMinutes(this.currentTime.minutes);
                    newDate.setSeconds(this.currentTime.seconds);
                }

                this.$emit('input', this.formatDateToString(newDate, this.format));

                if (this.hasInputElement && !this.pickTime) {
                    this.close();
                }
            }

        },

        inputTime(method, event) {

            const currentDate = this.valueDate;
            console.log("const currentDate: "+ currentDate );
            console.log("method?: "+ method);
            const maxValues = {setHours: 23, setMinutes: 59, setSeconds: 59};

            let numValue = parseInt(event.target.value, 10) || 0;

            if (numValue > maxValues[method]) {
                numValue = maxValues[method];
            } else if (numValue < 0) {
                numValue = 0;
            }

            event.target.value = paddNum(numValue, method === 'setHours' ? 1 : 2);
            currentDate[method](numValue);
            this.$emit('input', this.formatDateToString(currentDate, this.format));

        }

    }

});

Vue.component('cfs-form', {
    props: ['courceForStudentss', 'courceForStudentsAttr', 'groups', 'lang'],



    data: function() {
        return {
            id:'',
            creatorId:'',
            courceId:'',
            userGroupId:'',
            createDate:'',
            lolDate:'',
            beginDate:'',
            endDate:'',
            userGroupObject: null,
        }
    },

    watch:{
        courceForStudentsAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.creatorId = newVal.creatorId;
            this.courceId = newVal.courceId;
            this.userGroupId = newVal.userGroupId;
            this.createDate = newVal.createDate;
            this.userGroupObject = this.groups.filter(v => v.id === this.userGroupId) [0];
            this.userGroupId = this.userGroupObject.id;
        }
    },
    template:
        '<div class="card" style="margin: 5px;">'+
            '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Добавление слушателей</h5><h5 v-else>Adding listeners</h5></div>'+
            '<div class="card-body">'+
                '<form>'+

                    '<div v-if="lang==1"  class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="userGroupObject">Группа слушателей</label>'+
                        '<multiselect v-model="userGroupObject" id="userGroupObject" style="width: 100%"  :options="groups" track-by="groupName" label="groupName"  :allow-empty="true" placeholder="Выбрать группу">' +
                            '<template slot="option" slot-scope="{option}">{{option.groupName}}(ID: {{option.id}})</template>'+
                            '<template slot="singleLabel" slot-scope="{ option }">{{option.groupName}} </strong></template>'+
                            '<template slot="noResult" slot-scope="{noResult}">Группа не найдена. Поиск осуществляется только по названию!</template>'+
                        '</multiselect>'+
                        '<p class="alert alert-danger" v-show ="$root.userGroupIdAlert">Группа слушателей не может быть пустой!</p>'+
                    '</div>'+
                    '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="userGroupObject">Group of listeners</label>'+
                        '<multiselect v-model="userGroupObject" id="userGroupObject" style="width: 100%"  :options="groups" track-by="groupName" label="groupName"  :allow-empty="true" placeholder="Select group">' +
                            '<template slot="option" slot-scope="{option}">{{option.groupName}}(ID: {{option.id}})</template>'+
                            '<template slot="singleLabel" slot-scope="{ option }">{{option.groupName}} </strong></template>'+
                            '<template slot="noResult" slot-scope="{noResult}">The group was not found. Search is carried out by name only!</template>'+
                        '</multiselect>'+
                        '<p class="alert alert-danger" v-show ="$root.userGroupIdAlert">The listener group cannot be empty!</p>'+
                    '</div>'+

                    '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="beginDate" >Открыть доступ</label>'+
                        '<div class="input-group">'+
                            '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="beginDate" id="beginDate"></date-pick>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="$root.beginDateAlert">Необходимо указать начало периода доступа к курсу!</p>'+
                        '<p class="alert alert-danger" v-show ="$root.beginNoDateAlert">Введенная дата некорректна!</p>'+
                    '</div>'+
                    '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="beginDate" >To open access</label>'+
                        '<div class="input-group">'+
                            '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="beginDate" id="beginDate"></date-pick>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="$root.beginDateAlert">You must indicate the beginning of the course access period!</p>'+
                        '<p class="alert alert-danger" v-show ="$root.beginNoDateAlert">The entered date is incorrect!</p>'+
                    '</div>'+

                    '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="endDate">Закрыть доступ</label>'+
                        '<div class="input-group">'+
                            '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="endDate" id="endDate"></date-pick>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="$root.endDateAlert">Необходимо указать окончание периода доступа к курсу!</p>'+
                        '<p class="alert alert-danger" v-show ="$root.endNoDateAlert">Введенная дата некорректна!</p>'+
                        '<p class="alert alert-danger" v-show ="$root.datePeriodAlert">Дата окончания периода не может быть раньше, либо равна его началу!</p>'+
                    '</div>'+
                    '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="endDate">Close access</label>'+
                        '<div class="input-group">'+
                            '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="endDate" id="endDate"></date-pick>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="$root.endDateAlert">You must indicate the end of the course access period!</p>'+
                        '<p class="alert alert-danger" v-show ="$root.endNoDateAlert">The entered date is incorrect!</p>'+
                        '<p class="alert alert-danger" v-show ="$root.datePeriodAlert">The end date of the period cannot be earlier, or equal to its beginning!</p>'+
                    '</div>'+

                    '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                        '<input style="margin: 5px;"  type="button"  class="btn btn-primary " value="Добавить" @click="save">'+
                        '<input style="margin: 5px;"  type="button"  class="btn btn-danger " value="Отмена" @click="cancel">'+
                    '</div>'+
                    '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                        '<input style="margin: 5px;"  type="button"  class="btn btn-primary " value="Create" @click="save">'+
                        '<input style="margin: 5px;"  type="button"  class="btn btn-danger " value="Cancel" @click="cancel">'+
                    '</div>'+
                '</form>'+
            '</div>'+
        '</div>',

    methods: {
        backToCourceList: function(){
            window.location.href = '/';

        },
        cancel: function(){
            this.$root.showInputForm = false;
        },

        save: function() {

            if(this.userGroupObject!=null){
                this.userGroupId=this.userGroupObject.id;
                this.$root.userGroupIdAlert=false;
            } else {
                console.log("не указана группа пользователей!");
                this.$root.userGroupIdAlert=true;
            }

            if(is_empty(this.beginDate)){
                console.log("Не указана дата начала открытия доступа!");
                this.$root.beginDateAlert=true;
            } else {
                this.$root.beginDateAlert=false;
                console.log("Дата начала предоставления доступа: " +  toTimestamp(this.beginDate));
                if(isNaN(toTimestamp(this.beginDate))){
                    this.$root.beginNoDateAlert=true;
                }else {
                    this.$root.beginNoDateAlert=false;
                }

            }
            if (is_empty(this.endDate)){
                console.log("Не указана дата закрытия доступа");
                this.$root.endDateAlert=true;
            } else{
                this.$root.endDateAlert=false;
                console.log("Дата завершения предоставления доступа: " + toTimestamp(this.endDate));
                if(isNaN(toTimestamp(this.endDate))){
                    this.$root.endNoDateAlert=true;
                }else {
                    this.$root.endNoDateAlert=false;
                }
            }
            if((this.$root.endDateAlert==false)&&(this.$root.beginDateAlert==false)){


                if(toTimestamp(this.endDate) <= toTimestamp(this.beginDate)){
                    console.log("дата окончания периода не может раньше, либо равна его началу!");
                    this.$root.datePeriodAlert=true;
                }
                else{
                    this.$root.datePeriodAlert=false;
                }
            }

            if((this.$root.datePeriodAlert==false)&&(this.$root.endDateAlert==false)&&(this.$root.beginDateAlert==false)&&(this.$root.userGroupIdAlert==false)){

                var courceForStudents = {
                    courceId: this.$root.courceId,
                    userGroupId: this.userGroupId,
                    //accessBeginDate: this.beginDate.replace(" ","T"),
                   // accessEndDate: this.endDate.replace(" ","T"),
                    accessBeginDate: this.beginDate,
                    accessEndDate: this.endDate,
                };


                if (this.courceForStudentss.find(x => x.userGroupId === this.userGroupId)!==undefined){
                    alert("Данная группа уже добавлена!");
                    this.userGroupId='';
                    this.beginDate='';
                    this.endDate='';
                } else {

                    console.log("Сохраняем");
                    courceForStudentsApi.save({}, courceForStudents).then(result =>
                        result.json().then(data => {
                            const index = this.courceForStudentss.findIndex(item =>item.id ===data.id)
                            if (index > -1) {
                                this.courceForStudentss.splice(index, 1, data)
                            } else {
                                this.courceForStudentss.push(data)
                            }
                        })
                    );
                    this.userGroupId='';
                    this.beginDate='';
                    this.endDate='';
                    this.$root.showInputForm=false;

                }



            }





        }
    }
});

Vue.component('cfs-card' , {
    props: ['courceForStudents', 'editMethod', 'courceForStudentss','lang'],
    template:

        '<div class="card">'+
            '<div  class="card-header text-white bg-primary"># {{courceForStudentss.indexOf(courceForStudents) + 1}}</div>'+
                '<ul v-if="lang==1" class="list-group list-group-flush">'+
                    '<li class="list-group-item"><b>ID: </b>{{courceForStudents.id}}</li>'+
                    '<li class="list-group-item"><b>Название: </b>{{courceForStudents.userGroup.groupName}} </li>'+
                    '<li class="list-group-item"><b>Добавил: </b>{{courceForStudents.user.lastname}} {{courceForStudents.user.firstname}}</li>'+
                    '<li class="list-group-item"><b>Добавлено: </b>{{courceForStudents.createDate}}</li>'+
                    '<li class="list-group-item"><b>Дата открытия доступа: </b>{{courceForStudents.accessBeginDate}}</li>'+
                    '<li class="list-group-item"><b>Дата закрытия доступа: </b>{{courceForStudents.accessEndDate}}</li>'+
                '</ul>'+
                '<ul v-else class="list-group list-group-flush">'+
                    '<li class="list-group-item"><b>ID: </b>{{courceForStudents.id}}</li>'+
                    '<li class="list-group-item"><b>Group name: </b>{{courceForStudents.userGroup.groupName}} </li>'+
                    '<li class="list-group-item"><b>Creator: </b>{{courceForStudents.user.lastname}} {{courceForStudents.user.firstname}}</li>'+
                    '<li class="list-group-item"><b>Added: </b>{{courceForStudents.createDate}}</li>'+
                    '<li class="list-group-item"><b>Access opening date: </b>{{courceForStudents.accessBeginDate}}</li>'+
                    '<li class="list-group-item"><b>Closing date: </b>{{courceForStudents.accessEndDate}}</li>'+
                '</ul>'+
            '<div v-if="lang==1" class="card-footer">'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-primary" value="Показать пользователей" @click="showUsers" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-success" value="Show users" @click="showUsers" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+'</div>'+
            '</div>'
    ,
    methods: {
        showUsers: function (){
            this.$root.selectedGroup = this.courceForStudents.userGroup;
            this.$root.showUsers=true;
        },
        del: function() {
            if (confirm("Вы действительно хотите убрать доступ у группы " + this.courceForStudents.userGroupId + "?")) {
                courceForStudentsApi.remove({id: this.courceForStudents.id}).then(result => {
                    if (result.ok){
                        const ldIndex = this.courceForStudentss.indexOf(this.courceForStudents);
                        if (ldIndex > -1 ){
                            this.courceForStudentss.splice(ldIndex , 1)
                        }
                    }
                })
            }
        }
    }

});

Vue.component('cfs-row' , {
    props: ['courceForStudents', 'editMethod', 'courceForStudentss', 'lang'],
    template:
        '<tr>'+
            '<td align="center" width="5%" >{{courceForStudents.id}}</td>'+
            '<td align="left" width="20%" >{{courceForStudents.userGroup.groupName}} </td>'+
            '<td align="left" width="15%" >{{courceForStudents.user.lastname}} {{courceForStudents.user.firstname}}</td>'+
            '<td align="left" width="15%" >{{courceForStudents.createDate}}</td>'+
            '<td align="left" width="15%" >{{courceForStudents.accessBeginDate}}</td>'+
            '<td align="left" width="15%" >{{courceForStudents.accessEndDate}}</td>'+
            '<td align="center" width="10%">'+
            '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-success" value="Пользователи" @click="showUsers" />'+
            '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
        '</tr>',
    methods: {
        showUsers: function (){
            this.$root.selectedGroup = this.courceForStudents.userGroup;
            this.$root.showUsers=true;
        },
        del: function() {
            if (confirm("Вы действительно хотите убрать доступ у группы " + this.courceForStudents.userGroupId + "?")) {

                courceForStudentsApi.remove({id: this.courceForStudents.id}).then(result => {
                    if (result.ok){
                        const ldIndex = this.courceForStudentss.indexOf(this.courceForStudents);
                        if (ldIndex > -1 ){
                            this.courceForStudentss.splice(ldIndex , 1)
                        }
                    }
                })
            }
        }
    }

});

Vue.component('cfs-list', {
    props: ['courceForStudentss', 'groups','cource','courceForStudents', 'lang'],
    data: function(){
        return {
            search: '',
            pageNumber: 0,
            tableView: true,
            noteCount:10,
        }
    },


    template:
        '<div style="position: relative; width: 900px;">'+
        '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Слушатели курса \"{{cource.courceName}}\"</h1>'+
        '<div v-show="$root.showInputForm==false"> '+
            '<input v-if="lang==1" style="margin: 5px;" type="button" class="btn btn-primary " value="Добавить" @click="addListener"> '+
            '<input v-if="lang==1" style="margin: 5px;" type="button" class="btn btn-primary " value="Параметры отображения" @click="showViewConfig"> '+
            '<input v-if="lang==1" style="margin: 5px;" type="button" class="btn btn-primary" value="К списку курсов" @click="backToCourceList" />'+
            '<input v-if="lang!=1" style="margin: 5px;" type="button" class="btn btn-primary " value="Add" @click="addListener"> '+
            '<input v-if="lang!=1" style="margin: 5px;" type="button" class="btn btn-primary " value="Display options" @click="showViewConfig"> '+
            '<input v-if="lang!=1" style="margin: 5px;" type="button" class="btn btn-primary" value="To the list of courses" @click="backToCourceList" />'+
        '</div>' +

        '<div v-show="$root.showInputForm==true"> '+
            '<cfs-form :courceForStudentss="courceForStudentss" :courceForStudentsAttr="courceForStudents" :groups="groups" :cource="cource" :lang="lang"/>'+
        '</div>' +

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
                            'Пользователи группы \"{{$root.selectedGroup.groupName}}\"'+
                        '</div>'+
                        '<div class="modal-body-auto">'+
                            '<ul class="list-group list-group-flush" >'+
                                '<li class="list-group-item" v-for="user in $root.selectedGroup.users"> {{user.lastname}} {{user.firstname}} {{user.secname}}</li>'+
                            '</ul>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                            '<button class="btn btn-primary" @click="closeUserWindow">Ок</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+


        '<div v-show="$root.showInputForm==false"> '+
        '<div  class="card" style="margin: 5px; min-width: 90%;">'+
            '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Слушатели</h5><h5 v-else>Cource listeners</h5></div>'+
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
                        '<table style="min-width: 800px;" class="table">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th width="5%" scope="col"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                    '<th width="25%" scope="col"><a href="#"  v-bind:class="byuserGroupId" @click="byuserGroupId">Слушатели</a></th>'+
                                    '<th width="15%" scope="col"><a href="#"  v-bind:class="bycreatorId" @click="bycreatorId">Кто добавил</a></th>'+
                                    '<th width="15%" scope="col"><a href="#"  v-bind:class="bycreateDate" @click="bycreateDate">Добавлено</a></th>'+
                                    '<th width="15%" scope="col"><a href="#"  v-bind:class="bycreateDate" @click="bycreateDate">Открытие</a></th>'+
                                    '<th width="15%" scope="col"><a href="#"  v-bind:class="bycreateDate" @click="bycreateDate">Закрытие</a></th>'+
                                    '<th width="10%" scope="col">Действие</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<cfs-row v-for="courceForStudents in paginatedData"  :key="courceForStudents.id" ' +
        '                       :courceForStudents = "courceForStudents" :editMethod="editMethod" :courceForStudentss="courceForStudentss" :lang="lang" />' +
                            '</tbody>' +
                        '</table>' +
                    '</div>'+
                    '<div v-else>'+
                        '<hr>'+
                        '<div class="card-columns">'+
                            '<cfs-card v-for="courceForStudents in paginatedData"  :key="courceForStudents.id" ' +
        '                   :courceForStudents = "courceForStudents" :editMethod="editMethod" :courceForStudentss="courceForStudentss" :lang="lang" />' +
                        '</div>'+
                        '<hr>'+
                    '</div>'+

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
        sortedcourceForStudentss() {
            const k = this.$root.sortKey;
            return this.courceForStudentss.sort(dynamicSort(k));

        },
        FcourceForStudentss() {
            const s = this.search.toLowerCase();
            //return this.sortedcourceForStudentss.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedcourceForStudentss.filter(sortedcourceForStudents =>
                _.some(sortedcourceForStudents, v => {
                    if (!(v instanceof Object)) {
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        },
        pageCount(){
            let l = this.FcourceForStudentss.length,
                s = parseInt(this.noteCount);
            return Math.ceil(l/s);

        },

        paginatedData(){
            const start = this.pageNumber * parseInt(this.noteCount),
                end = start + parseInt(this.noteCount);

            return this.FcourceForStudentss.slice(start, end);

        }

    },
    watch: {
        tableView(newTableView) {
            if(newTableView){
                localStorage.accesToCourceTableView=1;
            } else{
                localStorage.accesToCourceTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.accesToCourceNoteCount != newNoteCount){
                localStorage.accesToCourceNoteCount = newNoteCount;
            }
        },
        search(newSearch) {
            if(localStorage.accesToCourceSearch != newSearch){
                localStorage.accesToCourceSearch = newSearch;
            }
        },
    },

    mounted() {
        if (localStorage.accesToCourceNoteCount) {
            this.noteCount = localStorage.accesToCourceNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.accesToCourceSearch) {
            this.search = localStorage.accesToCourceSearch;
        } else {
            this.search='';
        }

        if (localStorage.accesToCourceTableView) {
            if(localStorage.accesToCourceTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }

    },

    methods: {
        showViewConfig: function (){
            this.$root.showViewConfig=true;
        },
        clearSearch: function (){
            this.search='';
        },
        closeViewConfigWindow: function (){
            this.$root.showViewConfig =false;

        },
        closeUserWindow: function (){
            this.$root.selectedGroup = null;
            this.$root.showUsers=false;
        },
        editMethod: function(courceForStudents){
            this.courceForStudents = courceForStudents;
        },
        byId: function(){
            this.$root.sortKey="id";
        },
        byuserGroupId: function(){
            this.$root.sortKey="userGroupId";
        },
        bycreatorId: function(){
            this.$root.sortKey="creatorId";
        },
        bycreateDate: function(){
            this.$root.sortKey="createDate";
        },
        backToCourceList: function(){
            window.location.href = '/courcemaker';

        },
        addListener: function() {
            this.$root.showInputForm = true;
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


connect();

app = new Vue({
    el: '#app',
    template:
        '<div style="position: relative; ">'+
        '<cfs-list :courceForStudentss="courceForStudentss"  :groups="groups" :cource="cource" :lang="lang" /> ' +
        '</div>',

    data: {
        courceForStudentss:[],
        courceForStudents:'',
        groups:[],
        cource:'',
        courceName:"",
        sortKey:'id',
        courceId: id,
        cid:'',
        showInputForm:false,
        userGroupIdAlert:false,
        beginDateAlert:false,
        endDateAlert:false,
        datePeriodAlert:false,

        beginNoDateAlert:false,
        endNoDateAlert:false,

        showViewConfig:false,
        showUsers:false,
        selectedGroup:[],

        lang:'',
    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},

    created: function () {

        axios.get('/studentgroup').then(result => {
            this.groups=result.data
        });

        this.$root.cid=this.cource.id;


        courceForStudentsApi.get({id: this.$root.courceId}).then(result =>
            result.json().then(data => (
                data.forEach(cfs => {this.courceForStudentss.push(cfs);
                })
                )));


        courceApi.get({id: this.$root.courceId}).then(result =>
            result.json().then(data => (
                
                this.cource=result.data)));




        addHandler(data=> {
            if (data.objectType === 'COURCEFORSTUDENTS') {
                if ((data.body.courceId===this.courceId)){

                    const index = this.courceForStudentss.findIndex(item => item.id === data.body.id)

                    switch (data.eventType) {
                        case 'CREATE':
                        case 'UPDATE':

                            if (data.body.accessEndDate!==null){
                                if (index > -1) {
                                    this.courceForStudentss.splice(index, 1)
                                    this.courceForStudentss =  this.courceForStudentss.sort((a, b) => (a.createDate - b.createDate))
                                }
                                break
                            }
                            if (index > -1) {
                                this.courceForStudentss.splice(index, 1, data.body)
                                this.courceForStudentss =  this.courceForStudentss.sort((a, b) => (a.createDate - b.createDate))
                            } else {
                                this.courceForStudentss.push(data.body)}
                            this.courceForStudentss =  this.courceForStudentss.sort((a, b) => (a.createDate - b.createDate))
                            break
                        case 'REMOVE':
                            console.error('REMOVE')
                            this.courceForStudentss.splice(index, 1)
                            this.courceForStudentss =  this.courceForStudentss.sort((a, b) => (a.createDate - b.createDate))
                            break
                        default:
                            console.error(`Looks like the event type if unknown "${data.eventType}"`)
                    }
                }

            } else {
                console.error(`Looks like the object type if unknown "${data.objectType}"`)
            }
        })
    },
});