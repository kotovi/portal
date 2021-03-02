
function paddNum(num, padsize) {

    return typeof num !== 'undefined'
        ? num.toString().length > padsize
            ? num
            : new Array(padsize - num.toString().length + 1).join('0') + num
        : undefined
        ;

}

function ololo(sanitazedString){
    sanitazedString.replace(/&quot;/g, "\"").replace(/&#40;/g, "\(").replace(/&#41;/g, "\)").replace(/&quot;/g, "\"").replace(/&#39;/g, "\'");
    return sanitazedString;
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
        stompClient.subscribe('/topic/activity', lection => {
            handlers.forEach(handler => handler(JSON.parse(lection.body)))
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

function sendLection(lection) {
    stompClient.send("/app/changeLection", {}, JSON.stringify(lection))
}


function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

function checkLectionPosition(list,lectionPosition,id) {
    for (var i =0; i< list.length; i++) {
        if ((list[i].lectionPosition ==lectionPosition)&&(list[i].id!=id)) {
            return 1;
        }
    }
    return 0;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
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
var lectionApi = Vue.resource('/lection{/id}');
//"/completed/intermediate/{id}"
var complitedIntemediateTestApi = Vue.resource('/test/completed/intermediate/{id}');


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




Vue.component('lection-form', {
    props: ['lections', 'lectionAttr', 'existedLections', 'lang', 'completedIntermediateTest'],
    data: function() {
        return {
            id:'',
            lectionName:'',
            lectionDescription:'',
            lectionUrl:'',
            lectionPosition:0,
            lectionUrlForRecord:'',
            meetingStatus:'',
            recordStatus:'',
            lectionRewrite:'0',
            accessBeginDate:'',
            lectionForCopy:'0',
            lectionForCopyObject:null,
            testObject:null,
            testId:'',

        }
    },

    watch:{
        lectionAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.lectionName = newVal.lectionName;
            this.lectionDescription = newVal.lectionDescription;
            this.lectionUrl = newVal.lectionUrl;
            this.lectionPosition = newVal.lectionPosition;
            this.lectionUrlForRecord = newVal.lectionUrlForRecord;
            this.lectionRecordType = newVal.lectionRecordType;
            this.lectionRewrite = newVal.lectionRewrite;
            this.accessBeginDate = newVal.accessBeginDate;
            this.lectionForCopy = newVal.lectionForCopy;
            this.testId = newVal.testId;
            this.testObject = this.completedIntermediateTest.filter(test => test.id === this.testId)[0];
        }
    },
    template:
    '<div>'+
        '<h1 v-if="lang==1" class="display-4 mt-5 mb-5" style="padding-top:20px;"v-show="!this.$root.showFrame">Лекции курса "{{this.$root.courceName}}"</h1>'+
        '<h1 v-else class="display-4 mt-5 mb-5" style="padding-top:20px;"v-show="!this.$root.showFrame">Lections for cource "{{this.$root.courceName}}"</h1>'+
        '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;"v-show="this.$root.showFrame">{{this.$root.lectionName}}({{this.$root.courceName}})</h1>'+

            '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&&(this.lections.length < Number($root.lectionCount))&(lang==1))" type="button" class="btn btn-primary " value="Добавить" @click="addLection"> '+
            '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&&(this.lections.length < Number($root.lectionCount))&(lang!=1))" type="button" class="btn btn-primary " value="Create a lecture" @click="addLection"> '+
            '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&(lang==1))" type = "button" class="btn btn-primary" value="К списку курсов" @click="backToCourceList" />'+
            '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&(lang!=1))" type = "button" class="btn btn-primary" value="Back to cource list" @click="backToCourceList" />'+
            '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&(lang==1))" type="button" class="btn btn-primary " value="Параметры отображения" @click="$root.showViewConfig=!$root.showViewConfig">'+
            '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&(lang!=1))" type="button" class="btn btn-primary " value="Display options" @click="$root.showViewConfig=!$root.showViewConfig">'+

            '<div v-if="($root.showInputForm==true)" class="card" style="margin: 15px;">'+
                '<div v-if="($root.editClicked == false)" class="card-header text-white bg-primary"><h5 v-if="lang==1">Добавление лекции</h5><h5 v-else>Adding a lecture</h5></div>'+
                '<div v-if="($root.editClicked == true)"class="card-header text-white bg-primary"><h5 v-if="lang==1">Редактирование лекции</h5><h5 v-else>Editing a lecture</h5></div>'+
                '<div v-if="(((this.lections.length < Number($root.lectionCount)) && ($root.editClicked == false))||($root.editClicked == true))">'+
                    '<form v-if="lang==1">'+
                        '<div class="card-body">'+
                            '<div v-if="($root.editClicked==false)&(existedLections!==null)" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionForCopy">Копировать лекцию</label>'+
                                '<multiselect v-model="lectionForCopyObject" id="lectionForCopyObject" style="width: 100%"  :options="existedLections" track-by="lectionName" label="lectionName"  :allow-empty="true" placeholder="Выберете лекцию для копирования">' +
                                    '<template slot="option" slot-scope="{option}">{{option.lectionName}}({{option.user.lastname}} {{option.user.firstname}})</template>'+
                                    '<template slot="singleLabel" slot-scope="{ option }">{{option.lectionName}} </strong></template>'+
                                    '<template slot="noResult" slot-scope="{noResult}">Лекция не найдена. Поиск осуществляется только по названию!</template>'+
                                    '</multiselect>'+
                            '</div>'+

                            '<div v-if="((lectionForCopyObject==null)&($root.editClicked==false))" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionName">Название Лекции</label>'+
                                '<div class="input-group">'+
                                    '<input type="text" class="form-control" id="lectionName" v-model="lectionName" placeholder="Название лекции" :maxlength="1000" required>'+
                                    '<div v-show="lectionName.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="1000 - lectionName.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.lectionNameAlert">Необходимо указать название лекции</p>'+
                            '</div>'+

                            '<div v-if="((lectionForCopyObject==null)&($root.editClicked==false))" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionDescription">Аннотация лекции</label>'+
                                '<div class="input-group">'+
                                    '<textarea type="text" class="form-control" id="lectionDescription" v-model="lectionDescription" placeholder="Аннотация лекции" :maxlength="3000" required></textarea>'+
                                    '<div v-show="lectionDescription.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="3000 - lectionDescription.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.lectionDescriptionAlert" >Необходимо заполнить аннотацию лекции</p>'+
                            '</div>'+

                            '<div v-if="($root.editClicked==true)" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionName">Название лекции</label>'+
                                '<div class="input-group">'+
                                    '<input type="text" class="form-control" id="lectionName" v-model="lectionName" placeholder="Название лекции" :maxlength="1000" required>'+
                                    '<div v-show="lectionName.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="1000 - lectionName.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.lectionNameAlert">Необходимо указать название лекции</p>'+
                            '</div>'+

                            '<div v-if="($root.editClicked==true)" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionDescription">Аннотация лекции</label>'+
                                '<div class="input-group">'+
                                    '<textarea type="text" class="form-control" id="lectionDescription" v-model="lectionDescription" placeholder="Аннотация лекции" :maxlength="3000" required></textarea>'+
                                    '<div v-show="lectionDescription.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="3000 - lectionDescription.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.lectionDescriptionAlert" >Необходимо заполнить аннотацию лекции</p>'+
                            '</div>'+

                            '<div v-if="($root.editClicked==true)" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionUrl">Перезаписать лекцию?</label>'+
                                '<select class="custom-select" id="lectionRewrite" v-model="lectionRewrite">'+
                                    '<option :value="1">Да</option>'+
                                    '<option selected :value="0">Нет</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.lectionUrlAlert">Укажите что делать с лекцией</p>'+
                            '</div>'+

                            '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionPosition">Порядковый номер в курсе</label>'+
                                '<select class="custom-select" id="lectionPosition" v-model="lectionPosition">'+
                                    '<option value="0">Выбрать...</option>'+
                                    '<option :value="n" v-for=" n in Number($root.lectionCount)">{{n}}</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.lectionPositionAlert">Укажите порядковый номмер лекции</p>'+
                                '<p class="alert alert-danger" v-show ="$root.lectionPositionExistAlert">Лекция с таким номером уже существует!</p>'+
                            '</div>'+



                            '<div v-if="((Number($root.testEnable)==2)||(Number($root.testEnable)==4))" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="lectionForCopy">Привязать тестирование</label>'+
                                '<multiselect v-model="testObject" id="testObject" style="width: 100%"  :options="completedIntermediateTest" track-by="id" label="testName"  :allow-empty="true" placeholder="Необходимо привязать тестирование">' +
                                    '<template slot="option" slot-scope="{option}">{{option.testName}} (Id: {{option.id}} Вопросов: {{option.questionsCount}} Пользователю: {{option.questionsCountForUser}} Порог: {{option.minimalBall}}%)</template>'+
                                    '<template slot="singleLabel" slot-scope="{ option }">{{option.testName}} </strong></template>'+
                                    '<template slot="noResult" slot-scope="{noResult}">Тестирование не найдено. Поиск осуществляется только по названию!</template>'+
                                '</multiselect>'+
                            '</div>'+

                            '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="beginDate">Открыть доступ</label>'+
                                '<div class="input-group">'+
                                    '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="accessBeginDate" id="accessBeginDate"></date-pick>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show ="$root.beginDateAlert">Необходимо указать начало периода доступа к лекции!</p>'+
                                '<p class="alert alert-danger" v-show ="$root.beginNoDateAlert">Введенная дата не корректна!</p>'+
                            '</div>'+




                        '</div>'+
                        '<div class="col" style="width: 90%; margin-top: 10px;">'+
                            '<input style="margin: 15px;" v-if="((this.lections.length < Number($root.lectionCount)) && ($root.editClicked == false))" type="button"  class="btn btn-primary " value="Создать" @click="save">'+
                            '<input style="margin: 15px;" v-if="$root.editClicked==true" type="button" class="btn btn-primary " value="Сохранить" @click="save">'+
                            '<input style="margin: 15px;"  type="button" class="btn btn-danger" value="Отменить" @click="cancel">'+
                        '</div>'+
                    '</form>'+
                    '<form v-else>'+
                    '<div class="card-body">'+
        '<div v-if="($root.editClicked==false)&(existedLections!==null)" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionForCopy">Copy lecture</label>'+
        '<multiselect v-model="lectionForCopyObject" id="lectionForCopyObject" style="width: 100%"  :options="existedLections" track-by="lectionName" label="lectionName"  :allow-empty="true" placeholder="Select a lecture to copy">' +
        '<template slot="option" slot-scope="{option}">{{option.lectionName}}({{option.user.lastname}} {{option.user.firstname}})</template>'+
        '<template slot="singleLabel" slot-scope="{ option }">{{option.lectionName}} </strong></template>'+
        '<template slot="noResult" slot-scope="{noResult}">Lecture not found. Search is carried out by name only!</template>'+
        '</multiselect>'+
        '</div>'+

        '<div v-if="((lectionForCopyObject==null)&($root.editClicked==false))" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionName">Lection name</label>'+
        '<div class="input-group">'+
        '<input type="text" class="form-control" id="lectionName" v-model="lectionName" placeholder="Lection name" :maxlength="1000" required>'+
        '<div v-show="lectionName.length>0" class="input-group-prepend">' +
        '<div class="input-group-text" v-text="1000 - lectionName.length">@</div>' +
        '</div>'+
        '</div>'+
        '<p class="alert alert-danger" v-show="$root.lectionNameAlert">You must specify the title of the lecture</p>'+
        '</div>'+

        '<div v-if="((lectionForCopyObject==null)&($root.editClicked==false))" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionDescription">Lecture abstract</label>'+
        '<div class="input-group">'+
        '<textarea type="text" class="form-control" id="lectionDescription" v-model="lectionDescription" placeholder="Lecture abstract" :maxlength="3000" required></textarea>'+
        '<div v-show="lectionDescription.length>0" class="input-group-prepend">' +
        '<div class="input-group-text" v-text="3000 - lectionDescription.length">@</div>' +
        '</div>'+
        '</div>'+
        '<p class="alert alert-danger" v-show="$root.lectionDescriptionAlert" >It is necessary to fill in the abstract of the lecture</p>'+
        '</div>'+

        '<div v-if="($root.editClicked==true)" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionName">Lection name</label>'+
        '<div class="input-group">'+
        '<input type="text" class="form-control" id="lectionName" v-model="lectionName" placeholder="lection name" :maxlength="1000" required>'+
        '<div v-show="lectionName.length>0" class="input-group-prepend">' +
        '<div class="input-group-text" v-text="1000 - lectionName.length">@</div>' +
        '</div>'+
        '</div>'+
        '<p class="alert alert-danger" v-show="$root.lectionNameAlert">You must specify the title of the lecture</p>'+
        '</div>'+

        '<div v-if="($root.editClicked==true)" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionDescription">Lecture abstract</label>'+
        '<div class="input-group">'+
        '<textarea type="text" class="form-control" id="lectionDescription" v-model="lectionDescription" placeholder="Lecture abstract" :maxlength="3000" required></textarea>'+
        '<div v-show="lectionDescription.length>0" class="input-group-prepend">' +
        '<div class="input-group-text" v-text="3000 - lectionDescription.length">@</div>' +
        '</div>'+
        '</div>'+
        '<p class="alert alert-danger" v-show="$root.lectionDescriptionAlert" >It is necessary to fill in the abstract of the lecture</p>'+
        '</div>'+

        '<div v-if="($root.editClicked==true)" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionUrl">Overwrite the lecture?</label>'+
        '<select class="custom-select" id="lectionRewrite" v-model="lectionRewrite">'+
        '<option :value="1">Yes</option>'+
        '<option selected :value="0">No</option>'+
        '</select>'+
        '<p class="alert alert-danger" v-show ="$root.lectionUrlAlert">Indicate what to do with the lecture</p>'+
        '</div>'+

        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionPosition">Serial number in the course</label>'+
        '<select class="custom-select" id="lectionPosition" v-model="lectionPosition">'+
        '<option value="0">Select...</option>'+
        '<option :value="n" v-for=" n in Number($root.lectionCount)">{{n}}</option>'+
        '</select>'+
        '<p class="alert alert-danger" v-show ="$root.lectionPositionAlert">Indicate the serial number of the lecture</p>'+
        '<p class="alert alert-danger" v-show ="$root.lectionPositionExistAlert">A lecture with this number already exists!</p>'+
        '</div>'+

        '<div v-if="((Number($root.testEnable)==2)||(Number($root.testEnable)==4))" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionForCopy">Link testing</label>'+
        '<multiselect v-model="testObject" id="testObject" style="width: 100%"  :options="completedIntermediateTest" track-by="id" label="testName"  :allow-empty="true" placeholder="Testing needs to be tied">' +
        '<template slot="option" slot-scope="{option}">{{option.testName}} (Id: {{option.id}} Questions: {{option.questionsCount}} For listener: {{option.questionsCountForUser}} Treshold: {{option.minimalBall}}%)</template>'+
        '<template slot="singleLabel" slot-scope="{ option }">{{option.testName}} </strong></template>'+
        '<template slot="noResult" slot-scope="{noResult}">No testing found. Search is carried out by name only!</template>'+
        '</multiselect>'+
        '</div>'+

        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="beginDate">To open access</label>'+
        '<div class="input-group">'+
        '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="accessBeginDate" id="accessBeginDate"></date-pick>'+
        '</div>'+
        '<p class="alert alert-danger" v-show ="$root.beginDateAlert">You must indicate the beginning of the lecture access period!</p>'+
        '<p class="alert alert-danger" v-show ="$root.beginNoDateAlert">The entered date is not correct!</p>'+
        '</div>'+
        '</div>'+



        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<input style="margin: 15px;" v-if="((this.lections.length < Number($root.lectionCount)) && ($root.editClicked == false))" type="button"  class="btn btn-primary " value="Create" @click="save">'+
        '<input style="margin: 15px;" v-if="$root.editClicked==true" type="button" class="btn btn-primary " value="Save" @click="save">'+
        '<input style="margin: 15px;"  type="button" class="btn btn-danger" value="Cancel" @click="cancel">'+
        '</div>'+
        '</form>'+
                '</div>'+
            '</div>'+
    '</div>',

    methods: {
        backToCourceList: function () {
            window.location.href = '/courcemaker';

        },

        cancel: function () {

            if (this.$root.editClicked == true) {
                this.$root.showInputForm = false;
            }
            if ((this.$root.editClicked == false)) {
                this.$root.showInputForm = false;
                this.id = ''
                this.lectionName = ''
                this.lectionDescription = ''
                this.lectionUrl = ''
                this.lectionPosition = 0
                this.lectionRewrite = '0'

            }
            this.$root.editClicked = false;
            this.$root.ectionNameAlert = false;
            this.$root.lectionDescriptionAlert = false;
            this.$root.lectionUrlAlert = false;
            this.$root.lectionPositionAlert = false;
            this.$root.lectionPositionExistAlert = false;
            this.$root.beginNoDateAlert = false;
            this.$root.beginDateAlert = false;

        },
        addLection: function () {
            this.$root.showInputForm = true;
            if (this.$root.editBeenClicked == true) {

                this.id = '';
                this.lectionName = '';
                this.lectionDescription = '';
                this.lectionUrl = '';
                this.lectionPosition = 0;
                this.lectionRewrite = '0';
                this.lectionForCopyObject = null;
                this.lection = this.$root.tempLection;
                this.testObject= null;

                const index = this.lections.findIndex(item => item.id === this.lection.id)

                if (index > -1) {
                    this.lections.splice(index, 1, this.lection)
                } else {
                    this.lections.push(this.lection)
                }
                this.$root.tempUserGroup = null;
                this.$root.editBeenClicked = false;
            }
        },
        save: function () {
            console.log("lection for copy id: " + this.lectionForCopyObject )

            if (this.lectionForCopyObject != null) {
                if (is_empty(this.accessBeginDate)) {
                    console.log("Не указана дата начала открытия доступа!");
                    this.$root.beginDateAlert = true;
                } else {
                    this.$root.beginDateAlert = false;
                    console.log("Дата начала предоставления доступа: " + toTimestamp(this.accessBeginDate));
                    if (isNaN(toTimestamp(this.accessBeginDate))) {
                        this.$root.beginNoDateAlert = true;
                    } else {
                        this.$root.beginNoDateAlert = false;
                    }
                }

                if (this.lectionPosition==0) {
                    this.$root.lectionPositionAlert = true;
                } else {
                    this.$root.lectionPositionAlert = false;
                }

                if (checkLectionPosition(this.lections, this.lectionPosition, this.id) === 1) {
                    this.$root.lectionPositionExistAlert = true;
                } else {
                    this.$root.lectionPositionExistAlert = false;
                }

                if(
                    (!this.$root.lectionPositionExistAlert)&
                    (!this.$root.beginNoDateAlert)&
                    (!this.$root.beginDateAlert)&
                    (!this.$root.lectionPositionAlert)
                ){
                    var sourceLection = '';

                    for(i = 0; i < this.$root.existedLections.length; i++){
                        if(this.$root.existedLections[i].id == this.lectionForCopyObject.id){
                            this.sourceLection = this.$root.existedLections[i];
                        }
                    }
                    console.log("lectionName: "+ this.sourceLection.lectionName);
                    console.log("lectionURL: "+ this.sourceLection.lectionUrl);



                    const lectionCopy = {
                        lectionName: this.sourceLection.lectionName,
                        lectionDescription: this.sourceLection.lectionDescription,
                        courceId: courceId,
                        authorId: this.sourceLection.user.id,
                        lectionUrl: this.sourceLection.lectionUrl,
                        lectionPosition: this.lectionPosition,
                        accessBeginDate: this.accessBeginDate,
                        testId: this.sourceLection.testId,



                    };

                    Vue.resource('/lection/copy/').save({}, lectionCopy).then(result =>
                        result.json().then(data => {
                            const index = this.lections.findIndex(item => item.id === data.id)
                            if (index > -1) {
                                this.lections.splice(index, 1, data)
                            } else {
                                this.lections.push(data)
                            }
                        })
                    )
                    this.id = '';
                    this.lectionName = '';
                    this.lectionDescription = '';
                    this.lectionUrl = '';
                    this.lectionPosition = 0;
                    this.lectionRewrite = '0';
                    this.$root.showInputForm = false;
                    this.lectionForCopy = 0;
                    this.lectionForCopyObject=null;
                }
            } else {

                //проверяем дату предоставления доступа
                if (is_empty(this.accessBeginDate)) {
                console.log("Не указана дата начала открытия доступа!");
                this.$root.beginDateAlert = true;
            } else {
                this.$root.beginDateAlert = false;
                console.log("Дата начала предоставления доступа: " + toTimestamp(this.accessBeginDate));
                if (isNaN(toTimestamp(this.accessBeginDate))) {
                    this.$root.beginNoDateAlert = true;
                } else {
                    this.$root.beginNoDateAlert = false;
                }
            }
                //проверяем предусмотрено ли тестирование

            if((Number(this.$root.testEnable)==2)||(Number(this.$root.testEnable)==4)) {
                if(this.testObject!=null){
                    this.testId = this.testObject.id;
                }
            }
            const lection = {
                id: this.id,
                lectionName: capitalizeFirstLetter(this.lectionName),
                lectionDescription: capitalizeFirstLetter(this.lectionDescription),
                lectionPosition: this.lectionPosition,
                courceId: courceId,
                lectionRewrite: this.lectionRewrite,
                accessBeginDate: this.accessBeginDate,
                testId: this.testId,
            };
            //Проверяем заполненность полей формы
            if (is_empty(this.lectionName)) {
                this.$root.lectionNameAlert = true;
            } else {
                this.$root.lectionNameAlert = false;
            }

            if (is_empty(this.lectionDescription)) {
                this.$root.lectionDescriptionAlert = true;
            } else {
                this.$root.lectionDescriptionAlert = false;
            }

            if (this.lectionPosition==0) {
                this.$root.lectionPositionAlert = true;
            } else {
                this.$root.lectionPositionAlert = false;
            }
            if ((!this.$root.lectionPositionAlert) &
                (!this.$root.lectionDescriptionAlert) &
                (!this.$root.lectionNameAlert)&
                (!this.$root.lectionPositionExistAlert)&
                (!this.$root.beginNoDateAlert)&
                (!this.$root.beginDateAlert)
               ){

                if (this.id) {
                    if (checkLectionPosition(this.lections, this.lectionPosition, this.id) === 1) {
                        this.$root.lectionPositionExistAlert = true;
                    } else {
                        this.$root.lectionPositionExistAlert = false;
                        this.$root.editClicked = false;

                        lectionApi.update({id: this.id}, lection).then(result =>
                            result.json().then(data => {

                                const index = this.lections.findIndex(item => item.id === data.id)
                                this.lections.splice(index, 1, data)
                            })
                        )
                        this.id = ''
                        this.lectionName = ''
                        this.lectionDescription = ''
                        this.lectionUrl = ''
                        this.lectionPosition = 0
                        this.lectionRewrite = '0'
                        this.$root.showInputForm = false;
                        this.testObject = null
                        this.testId = ''
                    }
                } else {
                    if (checkLectionPosition(this.lections, this.lectionPosition, this.id) === 1) {
                        this.$root.lectionPositionExistAlert = true;
                    } else {
                        this.$root.lectionPositionExistAlert = false;

                        lectionApi.save({}, lection).then(result =>
                            result.json().then(data => {
                                const index = this.lections.findIndex(item => item.id === data.id)
                                if (index > -1) {
                                    this.lections.splice(index, 1, data)
                                } else {
                                    this.lections.push(data)
                                }
                            })
                        )
                        this.id = ''
                        this.lectionName = ''
                        this.lectionDescription = ''
                        this.lectionUrl = ''
                        this.lectionPosition = 0
                        this.lectionRewrite = '0'
                        this.$root.showInputForm = false;
                        this.testObject = null
                        this.testId = ''
                    }
                }
            }
        }
    }
    }
});

Vue.component('lection-row' , {
    props: ['lection', 'editMethod', 'lections', 'lang'],
    template:
    '<tr v-if="lang==1">'+
        '<td style="text-align: center; width: 5%;">{{lection.lectionPosition}}</td>'+
        '<td style="text-align: center; width: 35%;">{{lection.lectionName}} (Автор: {{lection.user.lastname}} {{lection.user.firstname}}, Дата создания: {{lection.lectionCreateDateTime}}) </td>'+
        '<td style="text-align: center; align-content:center; alignment:center; width: 10%;">'+
            '<input style="margin: 5px;"  v-show="Number(lection.recordStatus)==2" type = "button" class="btn btn-sm btn-success" value="Просмотр" @click="viewRecord" />'+
            '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==0) & (Number(lection.user.id) == Number($root.userId))) " type = "button" class="btn btn-sm btn-danger" value="Записать" @click="makeRecord" />'+
            '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==1)&(lection.user.id==$root.userId))" type = "button" class="btn btn-sm btn-danger" value="Возобновить" @click="makeRecord" />'+
            '<input type="button" disabled v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==0))" class="loader" style="align-content: center; text-align: center"></input>'+
        '</td>'+
        '<td style="text-align: center; width: 10%;">{{lection.accessBeginDate}}</td>'+
        '<td style="text-align: center; align-content: center; width: 40%;">'+
            '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
            '<input style="margin: 2px;"  type = "button" class="btn btn-sm btn-info" value="Статистика" @click="showStatistic" />'+
            '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" class="btn btn-sm btn-info" value="Файл" @click="showFiles" />'+
            '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
        '</td>'+
    '</tr>'+
        '<tr v-else>'+
        '<td style="text-align: center; width: 5%;">{{lection.lectionPosition}}</td>'+
        '<td style="text-align: center; width: 35%;">{{lection.lectionName}} (Author: {{lection.user.lastname}} {{lection.user.firstname}}, Create date: {{lection.lectionCreateDateTime}}) </td>'+
        '<td style="text-align: center; align-content:center; alignment:center; width: 10%;">'+
        '<input style="margin: 5px;"  v-show="Number(lection.recordStatus)==2" type = "button" class="btn btn-sm btn-success" value="View" @click="viewRecord" />'+
        '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==0) & (Number(lection.user.id) == Number($root.userId))) " type = "button" class="btn btn-sm btn-danger" value="Make record" @click="makeRecord" />'+
        '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==1)&(lection.user.id==$root.userId))" type = "button" class="btn btn-sm btn-danger" value="Resume" @click="makeRecord" />'+
        '<input type="button" disabled v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==0))" class="loader" style="align-content: center; text-align: center"></input>'+
        '</td>'+
        '<td style="text-align: center; width: 10%;">{{lection.accessBeginDate}}</td>'+
        '<td style="text-align: center; align-content: center; width: 40%;">'+
        '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Edit" @click="edit" />' +
        '<input style="margin: 2px;"  type = "button" class="btn btn-sm btn-info" value="Statistic" @click="showStatistic" />'+
        '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" class="btn btn-sm btn-info" value="Files" @click="showFiles" />'+
        '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
        '</td>'+
        '</tr>',
    methods: {
        showFiles: function(){
            window.location.href = '/filesForLection?lectionId=' + this.lection.id;
        },
        edit: function(){
            if ((this.lection.user.id==this.$root.userId)||(this.$root.isAdmin==1)){
                this.editMethod(this.lection);
                this.$root.showInputForm = true;
                this.$root.editBeenClicked = true;
            } else {
                //alert("Вы не являетесь автором данной лекции! Изменить лекцию может только ее создатель!")
                if(this.lang==1){
                    this.$root.alarmBody="Вы не являетесь автором данной лекции! Изменить лекцию может только ее создатель!";
                } else {
                    this.$root.alarmBody="You are not the author of this lecture! Only the creator can change the lecture!";
                }

                this.$root.showModal=true;
            }
        },

        showStatistic: function(){
            window.location.href = '/lectionStatistic?lectionId=' + this.lection.id;

        },
        lectionType: function(){
            return this.lectionType = this.lectionType === 'record' ? 'lectionUrl' : 'record'
        },
        makeRecord: function(){
            console.log("this.lection.user.id: "+ this.lection.user.id);
            console.log("this.$root.userId: "+ this.$root.userId);
            if ((this.lection.user.id==this.$root.userId)||(this.$root.isAdmin==1)){
                window.location.href = '/record/'+this.lection.id;
            } else {
               // alert("Вы не являетесь автором данной лекции! Запись может произвести только ее создатель!")
                if(this.lang==1){
                    this.$root.alarmBody="Вы не являетесь автором данной лекции! Запись может произвести только ее создатель!";
                } else {
                    this.$root.alarmBody="You are not the author of this lecture! Recording can only be made by its creator!";
                }
                this.$root.showModal=true;

            }


        },
        viewRecord: function(){
            //window.open(this.lection.lectionUrl, '_blank');
            this.$root.watchUrl=this.lection.lectionUrl;
            this.$root.showFrame=true;
            this.$root.courceName=this.lection.cource.courceName;
            this.$root.lectionName =this.lection.lectionName;

        },
        del: function() {
            if ((this.lection.user.id==this.$root.userId)||(this.$root.isAdmin==1)){

                    if (this.$root.editClicked == true) {
                      //  alert("Пееред удалением записи необходимо завершить редактирование!");
                        if(this.lang==1){
                            this.$root.alarmBody="Пееред удалением записи необходимо завершить редактирование!";
                        } else {
                            this.$root.alarmBody="Before deleting a record, you must complete editing!";
                        }

                        this.$root.showModal=true;

                    } else {
                        if (this.lang==1){
                            this.$root.alarmBody="В случае удаления лекции " + this.lection.lectionName + " будут так же удалены все связанные с ней данные! Вы подтверждаете удаление?";
                        }
                        else {
                            this.$root.alarmBody="In case of deleting a lecture " + this.lection.lectionName + " all data associated with it will also be deleted! You confirm the deletion?";
                        }

                        this.$root.showModal=true;
                        this.$root.confirmModalAlert=true;
                        this.$root.deleteLectionAlarm=true;
                        this.$root.lection = this.lection;
                    }
            }
            else {
                if(this.lang==1){
                    this.$root.alarmBody="Вы не являетесь автором данной лекции! Удалить лекцию может только ее создатель!";
                } else {
                    this.$root.alarmBody="You are not the author of this lecture! Only its creator can delete a lecture!";
                }
                this.$root.showModal=true;
            }

        }
    }

});

Vue.component('lection-card' , {
    props: ['lection', 'editMethod', 'lections', 'lang'],
    template:
    '<div class="card">'+
            '<div class="card-header text-white bg-primary"># {{lections.indexOf(lection) + 1}}</div>'+
                '<ul v-if="lang==1" class="list-group list-group-flush">'+
                '<li class="list-group-item"><b>Название: </b>{{lection.lectionName}}</li>'+
                '<li v-if="lection.user!=null" class="list-group-item"><b>Автор: </b>{{lection.user.lastname}} {{lection.user.firstname}}</li>'+
                '<li class="list-group-item "><b>Порядковый номер: </b>{{lection.lectionPosition}}</li>'+
                '<li class="list-group-item"><b>Дата создания: </b>{{lection.lectionCreateDateTime}}</li>'+
            '</ul>'+
            '<ul v-else class="list-group list-group-flush">'+
                '<li class="list-group-item"><b>Name: </b>{{lection.lectionName}}</li>'+
                '<li v-if="lection.user!=null" class="list-group-item"><b>Creator: </b>{{lection.user.lastname}} {{lection.user.firstname}}</li>'+
                '<li  class="list-group-item "><b>Lecture position: </b>{{lection.lectionPosition}}</li>'+
                '<li class="list-group-item"><b>Create date: </b>{{lection.lectionCreateDateTime}}</li>'+
            '</ul>'+
            '<div v-if="lang==1" class="card-footer">'+
                '<input style="margin: 5px;"  v-show="Number(lection.recordStatus)==2" type = "button" class="btn btn-sm btn-success" value="Просмотр" @click="viewRecord" />'+
                '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==0) & (Number(lection.user.id) == Number($root.userId))) " type = "button" class="btn btn-sm btn-danger" value="Записать" @click="makeRecord" />'+
                '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==1)&(lection.user.id==$root.userId))" type = "button" class="btn btn-sm btn-danger" value="Возобновить" @click="makeRecord" />'+
                '<input type="button" disabled v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==0))" class="loader" style="align-content: center; text-align: center"></input>'+
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))&((Number($root.testEnable)==2)||(Number($root.testEnable)==4))" type = "button" class="btn btn-sm btn-success" value="Тест" @click="addTest" />'+
                '<input style="margin: 2px;"  type = "button" class="btn btn-sm btn-info" value="Статистика" @click="showStatistic" />'+
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" class="btn btn-sm btn-info" value="Файл" @click="showFiles" />'+
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
            '<div v-else>'+
                '<input style="margin: 5px;"  v-show="Number(lection.recordStatus)==2" type = "button" class="btn btn-sm btn-success" value="View" @click="viewRecord" />'+
                '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==0) & (Number(lection.user.id) == Number($root.userId))) " type = "button" class="btn btn-sm btn-danger" value="Make record" @click="makeRecord" />'+
                '<input style="margin: 5px;"  v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==1)&(lection.user.id==$root.userId))" type = "button" class="btn btn-sm btn-danger" value="Resume" @click="makeRecord" />'+
                '<input type="button" disabled v-show="((Number(lection.recordStatus)==1)&(lection.meetingStatus==0))" class="loader" style="align-content: center; text-align: center"></input>'+
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Edit" @click="edit" />' +
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))&((Number($root.testEnable)==2)||(Number($root.testEnable)==4))" type = "button" class="btn btn-sm btn-success" value="Add test" @click="addTest" />'+
                '<input style="margin: 2px;"  type = "button" class="btn btn-sm btn-info" value="Statistic" @click="showStatistic" />'+
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button" class="btn btn-sm btn-info" value="Files" @click="showFiles" />'+
                '<input style="margin: 2px;" v-show="((lection.user.id==$root.userId)||($root.isAdmin==1))" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
        '</div>',


    methods: {
        showFiles: function(){
            window.location.href = '/filesForLection?lectionId=' + this.lection.id;
        },
        edit: function(){
            if ((this.lection.user.id==this.$root.userId)||(this.$root.isAdmin==1)){
                this.editMethod(this.lection);
                this.$root.showInputForm = true;
                this.$root.editBeenClicked = true;
            } else {
                //alert("Вы не являетесь автором данной лекции! Изменить лекцию может только ее создатель!")
                if(this.lang==1){
                    this.$root.alarmBody="Вы не являетесь автором данной лекции! Изменить лекцию может только ее создатель!";
                } else {
                    this.$root.alarmBody="You are not the author of this lecture! Only the creator can change the lecture!";
                }

                this.$root.showModal=true;
            }
        },
        addTest: function(){
            if ((this.lection.user.id==this.$root.userId)||(this.$root.isAdmin==1)){
                window.location.href = '/testmaker?lectionId=' + this.lection.id + '&courceId=' + this.lection.courceId+'&testType=2';
                //window.location.href = '/testmaker?lectionId=' + this.lection.id + '&courceId=' + this.lection.courceId+'&testType=2';
            } else {
                //alert("Вы не являетесь автором данной лекции! Добавить тест может только ее создатель!")
                if(this.lang==1){
                    this.$root.alarmBody="Вы не являетесь автором данной лекции! Добавить тест может только ее создатель!";
                } else {
                    this.$root.alarmBody="You are not the author of this lecture! Only its creator can add a test!";
                }

                this.$root.showModal=true;
            }

        },
        showStatistic: function(){
            window.location.href = '/lectionStatistic?lectionId=' + this.lection.id;

        },
        lectionType: function(){
            return this.lectionType = this.lectionType === 'record' ? 'lectionUrl' : 'record'
        },
        makeRecord: function(){
            console.log("this.lection.user.id: "+ this.lection.user.id);
            console.log("this.$root.userId: "+ this.$root.userId);
            if ((this.lection.user.id==this.$root.userId)||(this.$root.isAdmin==1)){
                window.location.href = '/record/'+this.lection.id;
            } else {
                // alert("Вы не являетесь автором данной лекции! Запись может произвести только ее создатель!")
                if(this.lang==1){
                    this.$root.alarmBody="Вы не являетесь автором данной лекции! Запись может произвести только ее создатель!";
                } else {
                    this.$root.alarmBody="You are not the author of this lecture! Recording can only be made by its creator!";
                }
                this.$root.showModal=true;

            }


        },
        viewRecord: function(){
            //window.open(this.lection.lectionUrl, '_blank');
            this.$root.watchUrl=this.lection.lectionUrl;
            this.$root.showFrame=true;
            this.$root.courceName=this.lection.cource.courceName;
            this.$root.lectionName =this.lection.lectionName;

        },
        del: function() {
            if ((this.lection.user.id==this.$root.userId)||(this.$root.isAdmin==1)){

                if (this.$root.editClicked == true) {
                    //  alert("Пееред удалением записи необходимо завершить редактирование!");
                    if(this.lang==1){
                        this.$root.alarmBody="Пееред удалением записи необходимо завершить редактирование!";
                    } else {
                        this.$root.alarmBody="Before deleting a record, you must complete editing!";
                    }

                    this.$root.showModal=true;

                } else {
                    if (this.lang==1){
                        this.$root.alarmBody="В случае удаления лекции " + this.lection.lectionName + " будут так же удалены все связанные с ней данные! Вы подтверждаете удаление?";
                    }
                    else {
                        this.$root.alarmBody="In case of deleting a lecture " + this.lection.lectionName + " all data associated with it will also be deleted! You confirm the deletion?";
                    }

                    this.$root.showModal=true;
                    this.$root.confirmModalAlert=true;
                    this.$root.deleteLectionAlarm=true;
                    this.$root.lection = this.lection;
                }
            }
            else {
                if(this.lang==1){
                    this.$root.alarmBody="Вы не являетесь автором данной лекции! Удалить лекцию может только ее создатель!";
                } else {
                    this.$root.alarmBody="You are not the author of this lecture! Only its creator can delete a lecture!";
                }
                this.$root.showModal=true;
            }

        }
    }

});

Vue.component('lections-list', {
    props: ['lections', 'existedLections', 'lang', 'completedIntermediateTest'],
    data: function(){
        return {
            lection: null,
            search: '',
            pageNumber: 0,
            tableView:'',
            noteCount:'',
        }
    },
    watch:{
        search(newSearch){
            if(localStorage.lectionSearch!=newSearch){
                localStorage.lectionSearch=newSearch
            }
        },
        tableView(newTableView) {
            if(newTableView){
                localStorage.lectionTableView=1;
            } else{
                localStorage.lectionTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.lectionNoteCount != newNoteCount){
                localStorage.lectionNoteCount = newNoteCount;
            }
        },

    },
    mounted(){
        if(localStorage.lectionSearch){
            this.search=localStorage.lectionSearch;
        } else {
            this.search='';
        }

        if (localStorage.lectionNoteCount) {
            this.noteCount = localStorage.lectionNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.lectionTableView) {
            if(localStorage.lectionTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }

    },

    template:
        '<div v-if="$root.showModal">'+
            '<div class="modal-mask">'+
                '<div class="modal-wrapper">'+
                    '<div class="modal-container">'+
                        '<div v-if="lang==1" class="modal-title">'+
                            '<button class="close" @click="closeAlarmWindow">&times;</button>'+
                            'Внимание!'+
                        '</div>'+
                        '<div v-else class="modal-title">'+
                            '<button class="close" @click="closeAlarmWindow">&times;</button>'+
                            'Attention!'+
                        '</div>'+
                        '<label for="custom-control custom-checkbox">{{$root.alarmBody}}</label>'+
                        '<br>'+
                        '<label v-if="lang==1" for="custom-control custom-checkbox">Подтвердить:</label>'+
                        '<label v-else for="custom-control custom-checkbox">Confirm:</label>'+
                        '<div class="custom-control custom-checkbox">' +
                            '<b-form-checkbox type="checkbox" class="form-check-input" id="$root.confirmAlarm"  v-model="$root.confirmAlarm" switch></b-form-checkbox>'+
                        '</div>'+
                        '<br>'+
                        '<div v-if="$root.confirmModalAlert" class="modal-footer">'+
                            '<button class="btn btn-primary" @click="confirmAlarm">Ок</button>'+
                            '<button v-if="lang==1" class="btn btn-danger" @click="closeAlarmWindow">Отмена</button>'+
                            '<button v-else class="btn btn-danger" @click="closeAlarmWindow">Cancel</button>'+
                        '</div>'+
                        '<div v-else class="modal-footer">'+
                            '<button class="btn btn-primary" @click="closeAlarmWindow">Ок</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+

        '<div v-else style="position: relative; ">'+
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
            '<div  v-if="!this.$root.showFrame">'+
                '<lection-form :lections="lections" :lectionAttr="lection" :existedLections = "existedLections" ' +
                ':lang="lang" :completedIntermediateTest="completedIntermediateTest"/>'+

        '<div v-if="$root.showViewConfig">'+
        '<div class="modal-mask">'+
        '<div class="modal-wrapper">'+
        '<div v-if="lang==1" class="modal-container">'+
        '<div class="modal-title">'+
        '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
        'Параметры отображения'+
        '</div>'+
        '<hr>'+
        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="custom-control custom-checkbox">Вид</label>'+
        '<div style ="margin-left: 2px;" class="row">'+
        '<div class="custom-control custom-checkbox">' +
        '<b-form-checkbox type="checkbox" class="form-check-input" id="tableView"  v-on:change="tableView=!tableView" switch></b-form-checkbox>'+
        '</div>'+
        '<label v-if="tableView">Таблица</label>'+
        '<label v-else>Карточки</label>'+
        '</div>'+
        '</div>'+
        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="noteCount">Записей на страницу</label>'+
        '<select class="custom-select" id="noteCount" v-model="noteCount" required>'+
        '<option value="5">5</option>'+
        '<option selected value="10">10</option>'+
        '<option value="15">15</option>'+
        '<option value="20">20</option>'+
        '<option value="25">25</option>'+
        '<option value="30">30</option>'+
        '</select>'+
        '</div>'+
        '<br>'+
        '<div class="modal-footer">'+
        '<button class="btn btn-primary" @click="closeViewConfigWindow">Ок</button>'+
        '</div>'+
        '</div>'+
        '<div v-else class="modal-container">'+
        '<div class="modal-title">'+
        '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
        'Display options'+
        '</div>'+
        '<hr>'+
        '<div class="col" style="width: 90%; margin-top: 10px;">'+
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
        '<label for="noteCount">Posts per page</label>'+
        '<select class="custom-select" id="noteCount" v-model="noteCount" required>'+
        '<option value="5">5</option>'+
        '<option selected value="10">10</option>'+
        '<option value="15">15</option>'+
        '<option value="20">20</option>'+
        '<option value="25">25</option>'+
        '<option value="30">30</option>'+
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

                '<div v-if="$root.showInputForm==false" class="card" style="margin-top: 15px; min-width: 800px;">'+
                    '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Лекции</h5><h5 v-else>Lections</h5></div>'+
                        '<div class="card-body">'+
                            '<div v-if="lang==1" class="input-group mb-3">'+
                                '<input  v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                                '<div v-show="search.length>0" class="input-group-append">'+
                                    '<button class="btn btn-danger" style="margin: 0px;"  @click="clearSearch" type="button">Очистить</button>'+
                                '</div>'+
                            '</div>'+
                            '<div v-else class="input-group mb-3">'+
                                '<input v-model="search" id="search" class="form-control"  placeholder="Search">'+
                                '<div v-show="search.length>0" class="input-group-append">'+
                                    '<button class="btn btn-danger"  style="margin: 0px;"  @click="clearSearch" type="button">Clear</button>'+
                                '</div>'+
                            '</div>'+
                            '<div v-if="tableView">'+
                                '<table v-if="($root.editClicked == false)" class="table">'+
                                    '<thead>'+
                                        '<tr v-if="lang==1">'+
                                            '<th width="5%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionPosition" @click="byLectionPosition">#</a></th>'+
                                            '<th width="35%" scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionName" @click="byLectionName">Название</a></th>'+
                                            '<th width="10%" scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionDescription" @click="byLectionDescription">Лекция</a></th>'+
                                            '<th width="10%" scope="col" style="text-align: center">Доступ с</th>'+
                                            '<th width="40%" scope="col" style="text-align: center">Действие</th>'+
                                        '</tr>'+
                                        '<tr v-else>'+
                                            '<th width="5%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionPosition" @click="byLectionPosition">#</a></th>'+
                                            '<th width="35%" scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionName" @click="byLectionName">Name</a></th>'+
                                            '<th width="10%" scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionDescription" @click="byLectionDescription">Lection</a></th>'+
                                            '<th width="10%" scope="col" style="text-align: center">Access from</th>'+
                                            '<th width="40%" scope="col" style="text-align: center">Action</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                        '<lection-row v-for="lection in paginatedData" :key="lection.id" :lection = "lection" :lang = "lang" :editMethod="editMethod" :lections="filteredLections"/>' +
                                    '</tbody>' +
                                '</table>'+
                            '</div>'+
                            '<div v-else>'+
                                '<hr>'+
                                '<div class="card-columns">'+
                                    '<lection-card v-for="lection in paginatedData" :key="lection.id" :lection = "lection" ' +
                                    ':editMethod="editMethod" :lections="filteredLections" :lang="lang"/>' +
                                '</div>'+
                                '<hr>'+
                            '</div>'+

                        '</div>'+
                    '</div>'+
                '<div v-if="(((pageCount>1)&&($root.editClicked ==false))&(lang==1))" align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+
                '<div v-if="(((pageCount>1)&&($root.editClicked ==false))&(lang!=1))" align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+
        '</div>'+
        '</div>',
    computed: {
        sortedLections() {
            const k = this.$root.sortKey;
            return this.lections.sort(dynamicSort(k));
            alert(k);
        },

        filteredLections() {
            const s = this.search.toLowerCase();
            //return this.sortedLections.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedLections.filter(sortedLection =>
                _.some(sortedLection, v => {
                    if (!(v instanceof Object)) {
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        },
        pageCount(){
            let l = this.filteredLections.length,
                s = parseInt(this.noteCount);
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * parseInt(this.noteCount),
                end = start + parseInt(this.noteCount);

            return this.filteredLections.slice(start, end);

        }
    },


    methods: {
        clearSearch: function(){
            this.search='';
        },
        closeViewConfigWindow: function(){
            this.$root.showViewConfig=false;
        },

        confirmAlarm: function() {
            //this.$root.confirmAlarm=true;
            this.$root.showModal = false;
            this.$root.alarmBody = '';

            if (this.$root.confirmAlarm & this.$root.deleteLectionAlarm) {
                lectionApi.remove({id: this.$root.lection.id}).then(result => {
                    if (result.ok) {
                        console.log("ololo");
                        const index = this.lections.findIndex(item => item.id === this.$root.lection.id)
                        console.log("Index:" + index);

                        if (index > -1) {
                            this.lections.splice(index, 1)
                        }
                    }
                });
                this.$root.confirmAlarm = false;
                this.$root.deleteLectionAlarm = false;
            }
        },
        closeAlarmWindow: function(){
            this.$root.confirmAlarm=false;
            this.$root.showModal=false;
            this.$root.alarmBody='';
        },
        editMethod: function(lection){
            this.lection = lection;
        },
        byLectionPosition: function(){
            this.$root.sortKey="lectionPosition";
        },
        byLectionName: function(){
            this.$root.sortKey="lectionName";
        },
        byLectionDescription: function(){
            this.$root.sortKey="lectionDescription";
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

var app;


connect();

app = new Vue({
    el: '#app',
    template:
    '<div style="position: relative; ">'+
    '<lections-list :lections="lections" :existedLections="existedLections" :lang="lang"  ' +
        ':completedIntermediateTest="completedIntermediateTest"/> ' +
    '</div>',

    data: {
        lections: [],
        existedLections:[],
        cource:null,

        lectionNameAlert:false,
        lectionDescriptionAlert:false,
        lectionUrlAlert:false,
        lectionPositionAlert:false,
        lectionPositionExistAlert:false,
        courсeId: courceId,
        lectionCount: lectionCount,
        testEnable: testEnable,
        courceName: courceName.replace(/&quot;/g, "\"").replace(/&#40;/g, "\(").replace(/&#41;/g, "\)").replace(/&quot;/g, "\"").replace(/&#39;/g, "\'"),
        editClicked:false,
        editBeenClicked:false,
        showInputForm:false,
        tempLection:null,
        sortKey:'lectionPosition',
        showFrame:false,
        lectionName:'',
        watchUrl:'',
        userId:'',
        userGroup:'',
        userRole:'',

        showModal: false,
        alarmBody:'',
        confirmAlarm:false,
        confirmModalAlert:false,
        deleteLectionAlarm:false,
        lection:'',
        isSuccessDeleted:false,

        beginDateAlert:false,
        beginNoDateAlert:false,

        courceUserGroup:0,

        lang:'',
        isAdmin:'',

        showViewConfig:false,

        completedIntermediateTest:[],
        userGroupId:0,

    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},

    created: function () {

        lectionApi.get({id: this.$root.courсeId}).then(result =>
            result.json().then(data =>
                this.lections=data
                )
        );

        /*
        *           if(this.$root.lectionCount==0){
                            this.$root.lectionCount=lection.cource.lectionsCount;
                        }
                       // if(this.$root.testEnable==0){
                            this.$root.testEnable=lection.cource.testEnable;
                        //}
                        if(this.$root.courceName==0){
                            this.$root.courceName=lection.cource.courceName;
                        }
                        if(this.$root.courceUserGroup==0){
                            this.$root.courceUserGroup=lection.cource.userGroup;
                            console.log("Cource user group id: " + this.$root.courceUserGroup);
                        }
                    }
        * */
        axios.get('/nav').then(result => {
            this.nav=result.data,
                this.$root.userId = result.data.id,
                this.$root.userGroup = result.data.userGroup,
                this.$root.userRole = result.data.userRole

            if(result.data.roles.includes("ADMIN")){
                this.$root.isAdmin =1;
                console.log("contains admin role");
            } else{
                console.log("no admin role");
            }

            console.log("this.$root.userId:" + this.$root.userId );
            console.log("user role: "+ this.$root.userRole);
        });


        //"/completed/intermediate/{id}"
        //complitedIntemediateTestApi
        //axios.get('/test/completed/2').then(result => {
        //    this.completedIntermediateTest=result.data
        //});





        Vue.resource('/cource{/id}').get({id: this.$root.courсeId}).then(result =>
            result.json().then(data => {
                    this.$root.courceUserGroup=data.userGroup;
                    this.$root.lectionCount=data.lectionsCount;
                    this.$root.testEnable=data.testEnable;
                    this.$root.courceName=data.courceName;

                    Vue.resource('/lection/byUserGroup{/id}').get({id: this.$root.courceUserGroup}).then(result =>
                        result.json().then(data =>
                            this.existedLections=data
                        )
                    );

                    complitedIntemediateTestApi.get({id: data.userGroup}).then(result =>
                        result.json().then(data => {
                                this.completedIntermediateTest=data;
                            }
                        ) );

            }
            ) );



        addHandler(data=> {
            if (data.objectType === 'LECTION') {
                if ((data.body.courceId===courceId)&&((data.body.creatorId===window.userId) || (data.body.userGroup===window.userGroup))){
                    const index = this.lections.findIndex(item => item.id === data.body.id)

                    switch (data.eventType) {
                        case 'CREATE':
                        case 'UPDATE':
                            if (data.body.deleted){
                                if (index > -1) {
                                    this.lections.splice(index, 1)
                                    this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                                }
                                break
                            }
                            if (index > -1) {
                                this.lections.splice(index, 1, data.body)
                                this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                            } else {
                                this.lections.push(data.body)}
                            this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                            break
                        case 'REMOVE':
                            this.lections.splice(index, 1)
                            this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                            break
                        default:
                            console.error(`Произошедшее событие - неведомая бубуйня: "${data.eventType}"`)
                    }
                }

            } else {
                console.error(`Прилетевший обьект какая то неведомая бубуйня: "${data.objectType}"`)
            }
        })


    },
});