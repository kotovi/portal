
var app_useragreement;

app_useragreement = new Vue({
    el: '#app_useragreement',
    template:
        '<div v-if="lang==1" class="container h-100 " style="background: #fff;">'+
        '<h1 class="display-4 mt-5 mb-5" style="padding-top: 50px;">Пользовательское Соглашение</h1>'+
    '<p class="card-text">Настоящее Пользовательское Соглашение (Далее Соглашение) регулирует отношения между ФГБОУ ВО ИГМУ Минздрава России (далее Платформа цифровизации или Администрация) с одной стороны и пользователем сайта с другой. Сайт Платформа цифровизации не является средством массовой информации.</p>'+
'<p class="card-text">Используя сайт, Вы соглашаетесь с условиями данного соглашения. Если Вы не согласны с условиями данного соглашения, не используйте сайт Платформа цифровизации!</p>'+
'<h4 class="card-subtitle mb-2 text-muted">Предмет соглашения</h4>'+
'<h6 class="card-subtitle mb-2 text-muted">Администрация предоставляет пользователю право на размещение на сайте следующей информации:</h6>'+
'<p class="card-text">'+
'<li class="list-unstyled"> - Текстовой информации;</li>'+
'<li class="list-unstyled"> - Аудиоматериалов;</li>'+
'<li class="list-unstyled"> - Видеоматериалов;</li>'+
'<li class="list-unstyled"> - Фотоматериалов;</li>'+
'<li class="list-unstyled"> - Ссылок на материалы, размещенные на других сайтах.</li>'+
'</p>'+
'<p class="card-text">'+
'<h4 class="card-subtitle mb-2 text-muted">Права и обязанности сторон</h4>'+
'</p>'+
'<h6 class="card-subtitle mb-2 text-muted">Пользователь имеет право:</h6>'+
'<p class="card-text">'+
'<li class="list-unstyled"> - Осуществлять поиск информации на сайте;</li>'+
'<li class="list-unstyled"> - Получать информацию на сайте;</li>'+
'<li class="list-unstyled"> - Создавать информацию для сайта;</li>'+
'<li class="list-unstyled"> - Использовать информацию сайта в личных некоммерческих целях.</li>'+
'</p>'+
'<h6 class="card-subtitle mb-2 text-muted">Администрация имеет право:</h6>'+
'<p class="card-text">'+
'<li class="list-unstyled"> - По своему усмотрению и необходимости создавать, изменять, отменять правила;</li>'+
'<li class="list-unstyled"> - Ограничивать доступ к любой информации на сайте;</li>'+
'<li class="list-unstyled"> - Создавать, изменять, удалять информацию;</li>'+
'<li class="list-unstyled"> - Удалять учетные записи;</li>'+
'<li class="list-unstyled"> - Отказывать в регистрации без объяснения причин.</li>'+
'</p>'+
'<h6 class="card-subtitle mb-2 text-muted">Пользователь обязуется:</h6>'+
'<p class="card-text">'+
'<li class="list-unstyled"> - Обеспечить достоверность предоставляемой информации;</li>'+
'<li class="list-unstyled"> - Обеспечивать сохранность личных данных от доступа третьих лиц;</li>'+
'<li class="list-unstyled"> - Обновлять Персональные данные, предоставленные при регистрации, в случае их изменения; </li>'+
'<li class="list-unstyled"> - Не распространять информацию, которая направлена на пропаганду войны, разжигание национальной, расовой или религиозной ненависти и вражды, а также иной информации, за распространение которой предусмотрена уголовная или административная ответственность; </li>'+
'<li class="list-unstyled"> - Не нарушать работоспособность сайта;</li>'+
'<li class="list-unstyled"> - Не создавать несколько учётных записей на Сайте, если фактически они принадлежат одному и тому же лицу;</li>'+
'<li class="list-unstyled"> - Не передавать в пользование свою учетную запись и/или логин и пароль своей учетной записи третьим лицам;</li>'+
'<li class="list-unstyled"> - Не регистрировать учетную запись от имени или вместо другого лица за исключением случаев, предусмотренных законодательством РФ;</li>'+
'<li class="list-unstyled"> - Не размещать материалы рекламного, эротического, порнографического или оскорбительного характера, а также иную информацию, размещение которой запрещено или противоречит нормам действующего законодательства РФ; </li>'+
'<li class="list-unstyled"> - Не использовать скрипты (программы) для автоматизированного сбора информации и/или взаимодействия с Сайтом и его Сервисами.</li>'+
'</p>'+
'<h6 class="card-subtitle mb-2 text-muted">Администрация обязуется:</h6>'+
'<p class="card-text">'+
'<li class="list-unstyled"> - Поддерживать работоспособность сайта за исключением случаев, когда это невозможно по независящим от Администрации причинам. </li></p>'+
'<p class="card-text">'+
'<li class="list-unstyled"> - Пользователь лично несет полную ответственность за распространяемую им информацию;</li>'+
'<li class="list-unstyled"> - Администрация не несет никакой ответственности за услуги, предоставляемые третьими лицами; </li>'+
'<li class="list-unstyled"> - В случае возникновения форс-мажорной ситуации (боевые действия, чрезвычайное положение, стихийное бедствие и т. д.) Администрация не гарантирует сохранность информации, размещённой Пользователем, а также бесперебойную работу информационного ресурса. </li>'+
'</p>'+
'<h6 class="card-subtitle mb-2 text-muted">Условия действия Соглашения:</h6>'+
'<p class="card-text">Данное Соглашение вступает в силу при любом использовании данного сайта. Соглашение перестает действовать при появлении его новой версии. Администрация оставляет за собой право в одностороннем порядке изменять данное соглашение по своему усмотрению. Администрация не оповещает пользователей об изменении в Соглашении.</p>'+
'</div>'+


        '<div v-else class="container h-100 " style="background: #fff;">'+
        '<h1 class="display-4 mt-5 mb-5" style="padding-top: 50px;">Terms of use</h1>'+
        '<p class="card-text">This User Agreement (hereinafter referred to as the Agreement) governs the relationship between the Federal State Budgetary Educational Institution of Higher Education ISMU of the Ministry of Health of Russia (hereinafter the Digitalization Platform or the Administration) on the one hand and the user of the site on the other. The Digitalization Platform website is not a mass media.</p>'+
        '<p class="card-text">By using the site, you agree to the terms of this agreement. If you do not agree with the terms of this agreement, do not use the Digitalization Platform website!</p>'+
        '<h4 class="card-subtitle mb-2 text-muted">Subject of the agreement</h4>'+
        '<h6 class="card-subtitle mb-2 text-muted">The administration grants the user the right to post the following information on the site:</h6>'+
        '<p class="card-text">'+
        '<li class="list-unstyled"> - Text information;</li>'+
        '<li class="list-unstyled"> - Audio materials;</li>'+
        '<li class="list-unstyled"> - Video materials;</li>'+
        '<li class="list-unstyled"> - Photo materials;</li>'+
        '<li class="list-unstyled"> - Links to materials posted on other sites.</li>'+
        '</p>'+
        '<p class="card-text">'+
        '<h4 class="card-subtitle mb-2 text-muted">Rights and obligations of the parties</h4>'+
        '</p>'+
        '<h6 class="card-subtitle mb-2 text-muted">The user has the right:</h6>'+
        '<p class="card-text">'+
        '<li class="list-unstyled"> - Search for information on the site;</li>'+
        '<li class="list-unstyled"> - Receive information on the website;</li>'+
        '<li class="list-unstyled"> - Create information for the site;</li>'+
        '<li class="list-unstyled"> - Use site information for personal non-commercial purposes.</li>'+
        '</p>'+
        '<h6 class="card-subtitle mb-2 text-muted">The administration has the right:</h6>'+
        '<p class="card-text">'+
        '<li class="list-unstyled"> - At your discretion and need to create, change, cancel rules;</li>'+
        '<li class="list-unstyled"> - Restrict access to any information on the site;</li>'+
        '<li class="list-unstyled"> - Create, modify, delete information;</li>'+
        '<li class="list-unstyled"> - Delete accounts;</li>'+
        '<li class="list-unstyled"> - Refuse registration without explanation.</li>'+
        '</p>'+
        '<h6 class="card-subtitle mb-2 text-muted">The user undertakes:</h6>'+
        '<p class="card-text">'+
        '<li class="list-unstyled"> - Ensure the accuracy of the information provided;</li>'+
        '<li class="list-unstyled"> - Ensure the safety of personal data from access by third parties;</li>'+
        '<li class="list-unstyled"> - Update the Personal data provided during registration in case of their change; </li>'+
        '<li class="list-unstyled"> - Not to disseminate information that is aimed at propaganda of war, incitement of national, racial or religious hatred and enmity, as well as other information, for the dissemination of which criminal or administrative liability is provided; </li>'+
        '<li class="list-unstyled"> - Do not disrupt the site\'s performance;</li>'+
        '<li class="list-unstyled"> - Do not create multiple accounts on the Site, if in fact they belong to the same person;</li>'+
        '<li class="list-unstyled"> - Do not transfer your account and / or your account login and password to third parties;</li>'+
        '<li class="list-unstyled"> - Do not register an account on behalf of or instead of another person, except as otherwise provided by the legislation of the Russian Federation;</li>'+
        '<li class="list-unstyled"> - Not to post materials of an advertising, erotic, pornographic or offensive nature, as well as other information, the placement of which is prohibited or contrary to the norms of the current legislation of the Russian Federation; </li>'+
        '<li class="list-unstyled"> - Do not use scripts (programs) for automated collection of information and / or interaction with the Site and its Services.</li>'+
        '</p>'+
        '<h6 class="card-subtitle mb-2 text-muted">The administration undertakes:</h6>'+
        '<p class="card-text">'+
        '<li class="list-unstyled"> - Maintain the site\'s functionality, except when it is impossible for reasons beyond the control of the Administration. </li></p>'+
        '<p class="card-text">'+
        '<li class="list-unstyled"> - The user is personally fully responsible for the information he distributes;</li>'+
        '<li class="list-unstyled"> - The administration does not bear any responsibility for the services provided by third parties; </li>'+
        '<li class="list-unstyled"> - In the event of a force majeure situation (military action, state of emergency, natural disaster, etc.), the Administration does not guarantee the safety of information posted by the User, as well as the uninterrupted operation of the information resource. </li>'+
        '</p>'+
        '<h6 class="card-subtitle mb-2 text-muted">Terms of the Agreement:</h6>'+
        '<p class="card-text">This Agreement enters into force with any use of this site. The agreement expires when a new version of it appears. The administration reserves the right to unilaterally change this agreement at its discretion. The administration does not notify users about the change in the Agreement.</p>'+
        '</div>'






    ,

    data: {

        lang:'',
    },


    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }}





});