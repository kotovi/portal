
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
        stompClient.subscribe('/topic/activity', seminar => {
            handlers.forEach(handler => handler(JSON.parse(seminar.body)))
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

function sendSeminar(seminar) {
    stompClient.send("/app/changeSeminar", {}, JSON.stringify(seminar))
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
var seminarApi = Vue.resource('/seminar{/id}');

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

Vue.component('seminar-form', {
    props: ['seminars', 'seminarAttr', 'lang'],
    data: function() {
        return {
            id:'',
            seminarName:'',
            seminarDescription:'',
            seminarBeginDate:'',
        }
    },

    watch:{
        seminarAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.seminarName = newVal.seminarName;
            this.seminarDescription = newVal.seminarDescription;
            this.seminarBeginDate = newVal.seminarBeginDate;
        }
    },
    template:
        '<div>'+
            '<h1 v-if="((lang==1)&(!this.$root.showFrame))" class="display-4 mt-5 mb-5" style="padding-top:20px;">Организация семинарных занятий</h1>'+
            '<h1 v-if="((lang!=1)&(!this.$root.showFrame))" class="display-4 mt-5 mb-5" style="padding-top:20px;">Organization of seminars</h1>'+

            '<input v-if="((lang==1)&($root.showInputForm==false))" style="margin: 5px;" type="button" class="btn btn-primary " value="Запланировать семинар" @click="add">'+
            '<input v-if="(($root.showInputForm==false)&(lang!=1))" style="margin: 5px;"  type="button" class="btn btn-primary " value="Schedule a workshop" @click="add">'+

            '<div v-if="($root.showInputForm==true)" class="card" style="margin: 15px;">'+

                '<div v-if="(($root.editClicked == false)&(lang==1))" class="card-header text-white bg-primary"><h5>Планирование семинара</h5></div>'+
                '<div v-if="(($root.editClicked == false)&(lang!=1))" class="card-header text-white bg-primary"><h5>Planning a workshop</h5></div>'+

                '<div v-if="(($root.editClicked == true)&(lang==1))" class="card-header text-white bg-primary"><h5>Редактирование семинара</h5></div>'+
                '<div v-if="(($root.editClicked == true)&(lang!=1))" class="card-header text-white bg-primary"><h5>Editing a workshop</h5></div>'+

                '<form>'+
                    '<div v-if="lang==1" class="card-body">'+

                        '<div  class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="lectionName">Название Семинара</label>'+
                            '<div class="input-group">'+
                                '<input type="text" class="form-control" id="seminarName" v-model="seminarName" placeholder="Название семинара" :maxlength="1000" required>'+
                                '<div v-show="seminarName.length>0" class="input-group-prepend">' +
                                    '<div class="input-group-text" v-text="1000 - seminarName.length">@</div>' +
                                '</div>'+
                            '</div>'+
                            '<p class="alert alert-danger" v-show="$root.seminarNameAlert">Необходимо указать название семинара</p>'+
                        '</div>'+

                        '<div  class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="seminarDescription">Аннотация семинара</label>'+
                            '<div class="input-group">'+
                                '<input type="text" class="form-control" id="seminarDescription" v-model="seminarDescription" placeholder="Аннотация семинара" :maxlength="1000" required>'+
                                '<div v-show="seminarDescription.length>0" class="input-group-prepend">' +
                                    '<div class="input-group-text" v-text="1000 - seminarDescription.length">@</div>' +
                                '</div>'+
                            '</div>'+
                            '<p class="alert alert-danger" v-show="$root.seminarDescriptionAlert">Необходимо заполнить аннотацию семинара</p>'+
                        '</div>'+

                        '<div  class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="seminarBeginDate">Дата проведения</label>'+
                            '<div class="input-group">'+
                                '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="seminarBeginDate" id="seminarBeginDate"></date-pick>'+
                            '</div>'+
                            '<p class="alert alert-danger" v-show ="$root.beginDateAlert">Необходимо указать дату проведения семинара!</p>'+
                            '<p class="alert alert-danger" v-show ="$root.beginNoDateAlert">Введенная дата не корректна!</p>'+
                        '</div>'+

                        '<div  class="form-group row">'+
                            '<div class="col-sm-10">'+
                                '<input style="margin: 15px;" v-if="$root.editClicked==false" type="button"  class="btn btn-primary " value="Создать" @click="save">'+
                                '<input style="margin: 15px;" v-if="$root.editClicked==true" type="button" class="btn btn-primary " value="Сохранить" @click="save">'+
                                '<input style="margin: 15px;"  type="button" class="btn btn-danger" value="Отменить" @click="cancel">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div v-else class="card-body">'+
                        '<div  class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="lectionName">Seminar title</label>'+
                            '<div class="input-group">'+
                                '<input type="text" class="form-control" id="seminarName" v-model="seminarName" placeholder="Seminar title" :maxlength="1000" required>'+
                                '<div v-show="seminarName.length>0" class="input-group-prepend">' +
                                    '<div class="input-group-text" v-text="1000 - seminarName.length">@</div>' +
                                '</div>'+
                            '</div>'+
                            '<p class="alert alert-danger" v-show="$root.seminarNameAlert">The name of the workshop is required!</p>'+
                        '</div>'+

                        '<div  class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="seminarDescription">Seminar abstract</label>'+
                            '<div class="input-group">'+
                                '<input type="text" class="form-control" id="seminarDescription" v-model="seminarDescription" placeholder="Seminar abstract" :maxlength="1000" required>'+
                                '<div v-show="seminarDescription.length>0" class="input-group-prepend">' +
                                    '<div class="input-group-text" v-text="1000 - seminarDescription.length">@</div>' +
                                '</div>'+
                            '</div>'+
                            '<p class="alert alert-danger" v-show="$root.seminarDescriptionAlert">It is necessary to fill out the summary of the seminar!</p>'+
                        '</div>'+

                        '<div  class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="seminarBeginDate">The date of the</label>'+
                            '<div class="input-group">'+
                                '<date-pick style="width: 100%;" :pickTime="true"  :pickSeconds="true"  :format="\'YYYY-MM-DD HH:mm:ss\'" v-model="seminarBeginDate" id="seminarBeginDate"></date-pick>'+
                            '</div>'+
                            '<p class="alert alert-danger" v-show ="$root.beginDateAlert">You must indicate the date of the seminar!</p>'+
                            '<p class="alert alert-danger" v-show ="$root.beginNoDateAlert">The entered date is not correct!</p>'+
                        '</div>'+

                    '<div  class="form-group row">'+
        '<div class="col-sm-10">'+
        '<input style="margin: 15px;" v-if="$root.editClicked==false" type="button"  class="btn btn-primary " value="Create" @click="save">'+
        '<input style="margin: 15px;" v-if="$root.editClicked==true" type="button" class="btn btn-primary " value="Save" @click="save">'+
        '<input style="margin: 15px;"  type="button" class="btn btn-danger" value="Cancel" @click="cancel">'+
        '</div>'+
        '</div>'+
        '</div>'+
                '</form>'+
            '</div>'+
        '</div>',

    methods: {

        cancel: function () {

            if (this.$root.editClicked == true) {
                this.$root.showInputForm = false;
            }
            if ((this.$root.editClicked == false)) {
                this.$root.showInputForm = false;
                this.id = ''
                this.seminarName = ''
                this.seminarDescription = ''
                this.seminarBeginDate = ''
            }
            this.$root.editClicked = false;
            this.$root.seminarNameNameAlert = false;
            this.$root.seminarDescriptionAlert = false;
            this.$root.beginDateAlert = false;
            this.$root.beginNoDateAlert = false;
        },
        add: function () {
            this.$root.showInputForm = true;
            if (this.$root.editBeenClicked == true) {

                this.id = ''
                this.seminarName = ''
                this.seminarDescription = ''
                this.seminarBeginDate = ''
                this.seminar = this.$root.tempSeminar;

                const index = this.seminars.findIndex(item => item.id === this.seminar.id)

                if (index > -1) {
                    this.seminars.splice(index, 1, this.seminar)
                } else {
                    this.seminars.push(this.seminar)
                }
                this.$root.tempUserGroup = null;
                this.$root.editBeenClicked = false;
            }
        },
        save: function () {

            if (is_empty(this.seminarBeginDate)) {
                console.log("Не указана дата начала семинара!");
                this.$root.beginDateAlert = true;
            } else {
                this.$root.beginDateAlert = false;
                console.log("Дата начала семинара: " + toTimestamp(this.seminarBeginDate));
                if (isNaN(toTimestamp(this.seminarBeginDate))) {
                    this.$root.beginNoDateAlert = true;
                } else {
                    this.$root.beginNoDateAlert = false;
                }
            }

            const seminar = {
                id: this.id,
                seminarName: capitalizeFirstLetter(this.seminarName),
                seminarDescription: capitalizeFirstLetter(this.seminarDescription),
                seminarBeginDate: this.seminarBeginDate,
            };
            //Проверяем заполненность полей формы
            if (is_empty(this.seminarName)) {
                this.$root.seminarNameAlert = true;
            } else {
                this.$root.seminarNameAlert = false;
            }

            if (is_empty(this.seminarDescription)) {
                this.$root.seminarDescriptionAlert = true;
            } else {
                this.$root.seminarDescriptionAlert = false;
            }

            if (!this.$root.seminarNameAlert &&
                !this.$root.seminarDescriptionAlert &&
                !this.$root.beginNoDateAlert &&
                !this.$root.beginDateAlert
            ) {

                if (this.id) {
                    this.$root.editClicked = false;

                    seminarApi.update({id: this.id}, seminar).then(result =>
                        result.json().then(data => {
                            const index = this.seminars.findIndex(item => item.id === data.id)
                            this.seminars.splice(index, 1, data)
                        })
                    )
                    this.id = ''
                    this.seminarName = ''
                    this.seminarDescription = ''
                    this.seminarBeginDate = ''
                    this.$root.showInputForm = false;

                } else {
                    seminarApi.save({}, seminar).then(result =>
                        result.json().then(data => {
                            const index = this.seminars.findIndex(item => item.id === data.id)
                            if (index > -1) {
                                this.seminars.splice(index, 1, data)
                            } else {
                                this.seminars.push(data)
                            }
                        })
                    );
                    this.id = '';
                    this.seminarName = '';
                    this.seminarDescription = '';
                    this.seminarBeginDate = '';
                    this.$root.showInputForm = false;
                }
            }
        }
    }
});

Vue.component('seminar-row' , {
    props: ['seminar', 'editMethod', 'seminars', 'lang'],
    template:
        '<tr v-if="lang==1">'+
            '<td style="text-align: center; width: 5%;">{{seminar.id}}</td>'+
            '<td style="text-align: center; width: 20%;">{{seminar.seminarName}}</td>'+
            '<td style="text-align: center; width: 20%;">{{seminar.seminarDescription}}</td>'+
            '<td style="text-align: center; width: 20%;">{{seminar.seminarBeginDate}}</td>'+
            '<td v-if="seminar.meetingStatus<3" style="text-align: center; width: 35%;">'+
                '<input style="margin: 2px;" v-show="((seminar.meetingStatus==0)&(seminar.creatorId==$root.userId))" type = "button" class="btn btn-sm btn-danger" value="Начать" @click="makeRecord" />'+
                '<input style="margin: 2px;" v-show="((seminar.recordStatus==1)&(seminar.meetingStatus==1))" type = "button" class="btn btn-sm btn-danger" value="Присоединиться" @click="makeRecord" />'+
                '<input style="margin: 2px;" v-show="(((seminar.creatorId==$root.userId)||($root.userRole==1))&(seminar.meetingStatus <3))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                '<input style="margin: 2px;" v-show="(((seminar.creatorId==$root.userId)||($root.userRole==1))&(seminar.meetingStatus <3))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-info" value="Участники" @click="seminarAccendees" />' +
                '<input style="margin: 2px;" v-show="(((seminar.creatorId==$root.userId)||($root.userRole==1))&(seminar.meetingStatus <3))" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
            '<td v-else-if="(((seminar.meetingRecordUrl==null))&(seminar.meetingStatus ==3))" style="text-align: center; width: 35%;">' +
                '<p>Семинар завершен</p>' +
            '</td>'+
            '<td v-else-if="(((seminar.meetingRecordUrl!=null))&(seminar.meetingStatus ==3))" style="text-align: center; width: 35%;">' +
                '<input style="margin: 2px;"  type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Просмотр" @click="play" />' +
            '</td>'+
        '</tr>'+
        '<tr v-else>'+
            '<td style="text-align: center; width: 5%;">{{seminar.id}}</td>'+
            '<td style="text-align: center; width: 20%;">{{seminar.seminarName}}</td>'+
            '<td style="text-align: center; width: 20%;">{{seminar.seminarDescription}}</td>'+
            '<td style="text-align: center; width: 20%;">{{seminar.seminarBeginDate}}</td>'+
            '<td v-if="seminar.meetingStatus<3" style="text-align: center; width: 35%;">'+
                '<input style="margin: 2px;" v-show="((seminar.meetingStatus==0)&(seminar.creatorId==$root.userId))" type = "button" class="btn btn-sm btn-danger" value="Begin seminar" @click="makeRecord" />'+
                '<input style="margin: 2px;" v-show="((seminar.recordStatus==1)&(seminar.meetingStatus==1))" type = "button" class="btn btn-sm btn-danger" value="Join" @click="makeRecord" />'+

                '<input style="margin: 2px;" v-show="(((seminar.creatorId==$root.userId)||($root.userRole==1))&(seminar.meetingStatus <3))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +

                '<input style="margin: 2px;" v-show="(((seminar.creatorId==$root.userId)||($root.userRole==1))&(seminar.meetingStatus <3))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-info" value="Participants" @click="seminarAccendees" />' +
                '<input style="margin: 2px;" v-show="(((seminar.creatorId==$root.userId)||($root.userRole==1))&(seminar.meetingStatus <3))" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
            '<td v-else-if="(((seminar.meetingRecordUrl==null))&(seminar.meetingStatus ==3))" style="text-align: center; width: 35%;">' +
                '<p>Семинар завершен</p>' +
            '</td>'+
            '<td v-else-if="(((seminar.meetingRecordUrl!=null))&(seminar.meetingStatus ==3))" style="text-align: center; width: 35%;">' +
                '<input style="margin: 2px;"  type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Просмотр" @click="play" />' +
            '</td>'+
        '</tr>',
    methods: {

        edit: function(){
            if (
                (this.seminar.creatorId==this.$root.userId)||
                (this.$root.userRole==1)
            ){
                this.editMethod(this.seminar);
                this.$root.showInputForm = true;
                this.$root.editBeenClicked = true;
            } else {
                this.$root.alarmBoby="Вы не являетесь автором данного семинара! Изменить семинар может только его создатель!";
                this.$root.showModal=true;
            }
        },
        play: function() {
            this.$root.watchUrl=this.seminar.meetingRecordUrl;
            this.$root.showFrame=true;
        },

        lectionType: function(){
            return this.lectionType = this.lectionType === 'record' ? 'lectionUrl' : 'record'
        },

        seminarAccendees: function (){
            if ((this.seminar.creatorId==this.$root.userId)||(this.$root.userRole==1)){
                window.location.href = '/accessUserToSeminar?id='+this.seminar.id;
            } else {
                this.$root.alarmBoby="Вы не являетесь автором семинара!";
                this.$root.showModal=true;
            }
        },
        makeRecord: function(){
            if (
                (this.seminar.creatorId==this.$root.userId)||
                (this.$root.userRole==1)
            ){
                window.location.href = '/seminar/begin/'+this.seminar.id;
            } else {
                this.$root.alarmBoby="Вы не являетесь автором семинара!";
                this.$root.showModal=true;
            }
        },
        viewRecord: function(){
            this.$root.showFrame=true;
            this.$root.courceName=this.lection.cource.courceName;
            this.$root.seminarName =this.seminar.seminarName;

        },
        del: function() {

            if (
                (this.seminar.creatorId==this.$root.userId)||
                (this.$root.userRole==1)
            ){

                if (this.$root.editClicked == true) {
                    this.$root.alarmBoby="Пееред удалением записи необходимо завершить редактирование!";
                    this.$root.showModal=true;

                } else {
                    this.$root.alarmBoby="В случае удаления семинара " + this.seminar.seminarName + " будут так же удалены все связанные с ним данные! Вы подтверждаете удаление?";
                    this.$root.showModal=true;
                    this.$root.confirmModalAlert=true;
                    this.$root.deleteLectionAlarm=true;
                    this.$root.seminar = this.seminar;
                }
            }
            else {
                this.$root.alarmBoby="Вы не являетесь автором данного семинара! Удалить семинар может только его создатель!";
                this.$root.showModal=true;
            }

        }
    }

});

Vue.component('seminar-list', {
    props: ['seminars', 'lang'],
    data: function(){
        return {
            seminar: null,
            search: '',
            pageNumber: 0,
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
                        '<label for="custom-control custom-checkbox">{{$root.alarmBoby}}</label>'+
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

        '<div v-else style="position: relative;">'+
            '<div>'+
                '<seminar-form :seminars="seminars" :seminarAttr="seminar" :lang="lang"/>'+
                '<div v-if="$root.showInputForm==false" class="card" style="margin-top: 15px; min-width: 900px;">'+
                    '<div class="card-header text-white bg-primary">'+
                        '<h5 v-if="lang==1">Запланированные семинары</h5><h5 v-else>Scheduled seminars</h5>'+
                    '</div>'+
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
                                '<button v-show="search.length>0"  class="btn btn-danger"  style="margin: 0px;"  @click="clearSearch" type="button">Clear</button>'+
                            '</div>'+
                        '</div>'+

                        '<table v-if="($root.editClicked == false)" class="table">'+
                            '<thead>'+
                                '<tr v-if="lang==1">'+
                                    '<th width="5%"  scope="col" style="text-align: center">#</th>'+
                                    '<th width="20%" scope="col" style="text-align: center"><a href="#"  v-bind:class="bySeminarName" @click="bySeminarName">Имя</a></th>'+
                                    '<th width="20%" scope="col" style="text-align: center"><a href="#"  v-bind:class="bySeminarDescription" @click="bySeminarDescription">Аннотация</a></th>'+
                                    '<th width="20%" scope="col" style="text-align: center"><a href="#"  v-bind:class="bySeminarCreateDate" @click="bySeminarCreateDate">Дата начала</a></th>'+
                                    '<th width="35%" scope="col" style="text-align: center">Действие</th>'+
                                '</tr>'+
                                '<tr v-else>'+
                                    '<th width="5%"  scope="col" style="text-align: center">#</th>'+
                                    '<th width="20%" scope="col" style="text-align: center"><a href="#"  v-bind:class="bySeminarName" @click="bySeminarName">Name</a></th>'+
                                    '<th width="20%" scope="col" style="text-align: center"><a href="#"  v-bind:class="bySeminarDescription" @click="bySeminarDescription">Annotation</a></th>'+
                                    '<th width="20%" scope="col" style="text-align: center"><a href="#"  v-bind:class="bySeminarCreateDate" @click="bySeminarCreateDate">Begin date</a></th>'+
                                    '<th width="35%" scope="col" style="text-align: center">Action</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<seminar-row v-for="seminar in paginatedData" :key="seminar.id" :seminar = "seminar" :editMethod="editMethod" :seminars="filteredSeminars" :lang="lang"/>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>'+
                '</div>'+
                '<div v-if="((((pageCount>1)&&($root.editClicked ==false))&(lang==1))&($root.showInputForm==false))" align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+
                '<div v-if="((((pageCount>1)&&($root.editClicked ==false))&(lang!=1))&($root.showInputForm==false))" align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+
            '</div>'+
        '</div>',
    computed: {
        sortedSeminars() {
            const k = this.$root.sortKey;
            return this.seminars.sort(dynamicSort(k));
            alert(k);
        },
        filteredSeminars() {
            const s = this.search.toLowerCase();
            return this.sortedSeminars.filter(sortedSeminar =>
                _.some(sortedSeminar, v => {
                    if (!(v instanceof Object)) {
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        },
        pageCount(){
            let l = this.filteredSeminars.length,
                s = 20;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * 20,
                end = start + 20;

            return this.filteredSeminars.slice(start, end);

        }
    },


    methods: {
        clearSearch: function (){
            this.search='';
        },
        confirmAlarm: function() {

            this.$root.showModal = false;
            this.$root.alarmBoby = '';

            if (this.$root.confirmAlarm & this.$root.deleteLectionAlarm) {

                seminarApi.remove({id: this.$root.seminar.id}).then(result => {
                    if (result.ok) {
                        const index = this.seminars.findIndex(item => item.id === this.$root.seminar.id)
                        if (index > -1) {
                            this.seminars.splice(index, 1)
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
            this.$root.alarmBoby='';
        },

        editMethod: function(seminar){
            this.seminar = seminar;
        },
        bySeminarName: function(){
            this.$root.sortKey="seminarName";
        },
        bySeminarCreateDate: function(){
            this.$root.sortKey="seminarCreateDate";
        },
        bySeminarDescription: function(){
            this.$root.sortKey="seminarDescription";
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
            '<seminar-list :seminars="seminars" :lang="lang"/> ' +
        '</div>',

    data: {
        seminars: [],

        seminarNameAlert:false,
        seminarDescriptionAlert:false,
        beginNoDateAlert:false,
        beginDateAlert:false,


        editClicked:false,
        editBeenClicked:false,
        showInputForm:false,
        tempSeminar:null,
        sortKey:'-id',
        showFrame:false,

        watchUrl:'',
        userId:'',
        userGroup:'',
        userRole:'',

        showModal: false,
        alarmBoby:'',
        confirmAlarm:false,
        confirmModalAlert:false,
        deleteLectionAlarm:false,
        seminar:'',
        isSuccessDeleted:false,

        lang:'',
    },
    mounted(){
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }

    },

    methods:{
        closeFrame() {
            this.$root.showFrame = false;
            this.$root.editClicked = false;

        },
    },



    created: function () {

        axios.get('/nav').then(result => {
            this.nav=result.data,
                this.$root.userId = result.data.id,
                this.$root.userGroup = result.data.userGroup,
                this.$root.userRole = result.data.userRole

            console.log("this.$root.userId:" + this.$root.userId );
            console.log("user role: "+ this.$root.userRole);
        });

        seminarApi.get().then(result =>
            result.json().then(data =>
                this.seminars = data
            )
        );

        addHandler(data=> {
            if (data.objectType === 'SEMINAR') {
              //  if ((data.body.courceId===courceId)&&((data.body.creatorId===window.userId) || (data.body.userGroup===window.userGroup))){
                    if (true){
                    const index = this.seminars.findIndex(item => item.id === data.body.id)

                    switch (data.eventType) {
                        case 'CREATE':
                        case 'UPDATE':
                            if (data.body.deleted){
                                if (index > -1) {
                                    this.seminars.splice(index, 1)
                                    this.seminars =  this.seminars.sort((a, b) => (a.id - b.id))
                                }
                                break
                            }
                            if (index > -1) {
                                this.seminars.splice(index, 1, data.body)
                                this.seminars =  this.seminars.sort((a, b) => (a.id - b.id))
                            } else {
                                this.seminars.push(data.body)}
                            this.seminars =  this.seminars.sort((a, b) => (a.id - b.id))
                            break
                        case 'REMOVE':
                            this.seminars.splice(index, 1)
                            this.seminars =  this.seminars.sort((a, b) => (a.id - b.id))
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