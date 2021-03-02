
var app_politic;

app_politic = new Vue({
    el: '#app_politic',
    template:
        '<div v-if="lang==1" class="container h-100"  style="background: #fff;">'+

        '<h1 class="display-4 mt-5 mb-5" style="padding-top: 50px;">Политика в отношении обработки персональных данных</h1>'+
        '<h4 class="card-subtitle mb-2 text-muted">1. Общие положения</h4>'+

        '<p class="card-text">'+
        '<li class="list-unstyled">   Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных ФГБОУ ВО ИГМУ Минздрава России (далее – Оператор).</li>'+
        '<li class="list-unstyled">Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.</li>'+
        '<li class="list-unstyled">Настоящая политика Оператора в отношении обработки персональных данных (далее – Политика) применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>.</li>'+
        '</p>'+
        '<h6 class="card-subtitle mb-2 text-muted">2. Основные понятия, используемые в Политике</h6>'+
        '<p class="card-text">'+
        '<li class="list-unstyled">Автоматизированная обработка персональных данных – обработка персональных данных с помощью средств вычислительной техники;</li>'+
        '<li class="list-unstyled">Блокирование персональных данных – временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных);</li>'+
        '<li class="list-unstyled"> Веб-сайт – совокупность графических и информационных материалов, а также программ для ЭВМ и баз данных, обеспечивающих их доступность в сети интернет по сетевому адресу <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>;</li>'+
        '<li class="list-unstyled"> Информационная система персональных данных — совокупность содержащихся в базах данных персональных данных, и обеспечивающих их обработку информационных технологий и технических средств;</li>'+
        '<li class="list-unstyled"> Обезличивание персональных данных — действия, в результате которых невозможно определить без использования дополнительной информации принадлежность персональных данных конкретному Пользователю или иному субъекту персональных данных;</li>'+
        '<li class="list-unstyled">Обработка персональных данных – любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных;</li>'+
        '<li class="list-unstyled">Оператор – государственный орган, муниципальный орган, юридическое или физическое лицо, самостоятельно или совместно с другими лицами организующие и (или) осуществляющие обработку персональных данных, а также определяющие цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными;</li>'+
        '<li class="list-unstyled">Персональные данные – любая информация, относящаяся прямо или косвенно к определенному или определяемому Пользователю веб-сайта <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>;</li>'+
        '<li class="list-unstyled">Пользователь – любой посетитель веб-сайта <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>;</li>'+
        '<li class="list-unstyled"> Предоставление персональных данных – действия, направленные на раскрытие персональных данных определенному лицу или определенному кругу лиц;</li>'+
        '<li class="list-unstyled">Распространение персональных данных – любые действия, направленные на раскрытие персональных данных неопределенному кругу лиц (передача персональных данных) или на ознакомление с персональными данными неограниченного круга лиц, в том числе обнародование персональных данных в средствах массовой информации, размещение в информационно-телекоммуникационных сетях или предоставление доступа к персональным данным каким-либо иным способом;</li>'+
        '<li class="list-unstyled">Трансграничная передача персональных данных – передача персональных данных на территорию иностранного государства органу власти иностранного государства, иностранному физическому или иностранному юридическому лицу;</li>'+
        '<li class="list-unstyled">Уничтожение персональных данных – любые действия, в результате которых персональные данные уничтожаются безвозвратно с невозможностью дальнейшего восстановления содержания персональных данных в информационной системе персональных данных и (или) результате которых уничтожаются материальные носители персональных данных.</li>'+
        '</p>'+
        '<h4 class="card-subtitle mb-2 text-muted"> 3. Оператор может обрабатывать следующие персональные данные Пользователя</h4>'+
        '<p class="card-text">'+

        '<li class="list-unstyled">Фамилия, имя, отчество;</li>'+
        '<li class="list-unstyled">Электронный адрес;</li>'+
        '<li class="list-unstyled">Место работы.</li>'+
        '<li class="list-unstyled">Номер мобильного телефона</li>'+

        '</p>'+


    '<p class="card-text">Также на сайте происходит сбор и обработка обезличенных данных о посетителях (в т.ч. файлов «cookie») с помощью сервисов интернет-статистики (Яндекс Метрика и Гугл Аналитика и других Вышеперечисленные данные далее по тексту Политики объединены общим понятием Персональные данные.</p>'+

'<h4 class="card-subtitle mb-2 text-muted">4. Цели обработки персональных данных</h4>'+

'<p class="card-text">Цель обработки персональных данных Пользователя — информирование Пользователя посредством отправки электронных писем; предоставление доступа Пользователю к сервисам, информации и/или материалам, содержащимся на веб-сайте; Сбор данных и материалов для участия в конференции. Также Оператор имеет право направлять Пользователю уведомления о новых продуктах и услугах, специальных предложениях и различных событиях. Пользователь всегда может отказаться от получения информационных сообщений, направив Оператору письмо на адрес электронной почты <a class="card-link" href="mailto:lections@ismu.baikal.ru">lections@ismu.baikal.ru</a> с пометкой «Отказ от уведомлений». Обезличенные данные Пользователей, собираемые с помощью сервисов интернет-статистики, служат для сбора информации о действиях Пользователей на сайте, улучшения качества сайта и его содержания.</p>'+

'<h4 class="card-subtitle mb-2 text-muted">5. Правовые основания обработки персональных данных</h4>'+
'<p class="card-text">Оператор обрабатывает персональные данные Пользователя только в случае их заполнения и/или отправки Пользователем самостоятельно через специальные формы, расположенные на сайте <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>. Заполняя соответствующие формы и/или отправляя свои персональные данные Оператору, Пользователь выражает свое согласие с данной Политикой.Оператор обрабатывает обезличенные данные о Пользователе в случае, если это разрешено в настройках браузера Пользователя (включено сохранение файлов «cookie» и использование технологии JavaScript).</p>'+

'<h4 class="card-subtitle mb-2 text-muted">6. Порядок сбора, хранения, передачи и других видов обработки персональных данных</h4>'+
'<p class="card-text">Безопасность персональных данных, которые обрабатываются Оператором, обеспечивается путем реализации правовых, организационных и технических мер, необходимых для выполнения в полном объеме требований действующего законодательства в области защиты персональных данных.</p> Оператор обеспечивает сохранность персональных данных и принимает все возможные меры, исключающие доступ к персональным данным неуполномоченных лиц. Персональные данные Пользователя никогда, ни при каких условиях не будут переданы третьим лицам, за исключением случаев, связанных с исполнением действующего законодательства. В случае выявления неточностей в персональных данных, Пользователь может актуализировать их самостоятельно, путем направления Оператору уведомление на адрес электронной почты Оператора lections@ismu.baikal.ru с пометкой «Актуализация персональных данных». Срок обработки персональных данных является неограниченным. Пользователь может в любой момент отозвать свое согласие на обработку персональных данных, направив Оператору уведомление посредством электронной почты на электронный адрес Оператора <a class="card-link" href="mailto:lections@ismu.baikal.ru">lections@ismu.baikal.ru</a> с пометкой «Отзыв согласия на обработку персональных данных».</p>'+

'<h4 class="card-subtitle mb-2 text-muted">7. Трансграничная передача персональных данных</h4>'+
'<p class="card-text">Оператор до начала осуществления трансграничной передачи персональных данных обязан убедиться в том, что иностранным государством, на территорию которого предполагается осуществлять передачу персональных данных, обеспечивается надежная защита прав субъектов персональных данных. Трансграничная передача персональных данных на территории иностранных государств, не отвечающих вышеуказанным требованиям, может осуществляться только в случае наличия согласия в письменной форме субъекта персональных данных на трансграничную передачу его персональных данных и/или исполнения договора, стороной которого является субъект персональных данных.</p>'+

'<h4 class="card-subtitle mb-2 text-muted">8. Заключительные положения</h4>'+
'<p class="card-text">Пользователь может получить любые разъяснения по интересующим вопросам, касающимся обработки его персональных данных, обратившись к Оператору с помощью электронной почты <a class="card-link" href="mailto:lections@ismu.baikal.ru">lections@ismu.baikal.ru</a>. В данном документе будут отражены любые изменения политики обработки персональных данных Оператором. Политика действует бессрочно до замены ее новой версией. Актуальная версия Политики в свободном доступе расположена в сети Интернет по адресу <a href="https://portal.ismu.baikal.ru/politic" class="card-link">https://portal.ismu.baikal.ru/politic</a>. </p>'+

'</div>'+

    '<div v-else class="container h-100"  style="background: #fff;">'+

    '<h1 class="display-4 mt-5 mb-5" style="padding-top: 50px;">Personal data processing policy</h1>'+
    '<h4 class="card-subtitle mb-2 text-muted">1. General Provisions</h4>'+

    '<p class="card-text">'+
    '<li class="list-unstyled">This personal data processing policy has been drawn up in accordance with the requirements of the Federal Law of July 27, 2006. № 152-ФЗ "On personal data" and determines the procedure for processing personal data and measures to ensure the security of personal data of the Federal State Budgetary Educational Institution of Higher Education IGMU of the Ministry of Health of Russia (hereinafter - the Operator).</li>'+
    '<li class="list-unstyled">The operator sets as its most important goal and condition for the implementation of its activities the observance of the rights and freedoms of a person and citizen when processing his personal data, including the protection of the rights to privacy, personal and family secrets.</li>'+
    '<li class="list-unstyled">This Operator\'s policy regarding the processing of personal data (hereinafter - the Policy) applies to all information that the Operator can obtain about visitors to the website <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>.</li>'+
    '</p>'+
    '<h6 class="card-subtitle mb-2 text-muted">2. Basic concepts used in the Policy</h6>'+
        '<p class="card-text">'+
    '<li class="list-unstyled">Automated processing of personal data - processing of personal data using computer technology;</li>'+
            '<li class="list-unstyled">Blocking of personal data - temporary termination of the processing of personal data (except for cases where processing is necessary to clarify personal data);</li>'+
        '<li class="list-unstyled"> Website - a set of graphic and information materials, as well as computer programs and databases, ensuring their availability on the Internet at a network address <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>;</li>'+
        '<li class="list-unstyled"> Personal data information system - a set of personal data contained in databases, and providing their processing of information technologies and technical means;</li>'+
        '<li class="list-unstyled"> Depersonalization of personal data - actions as a result of which it is impossible to determine without the use of additional information the ownership of personal data to a specific User or other subject of personal data;</li>'+
        '<li class="list-unstyled">Processing of personal data - any action (operation) or a set of actions (operations) performed using automation tools or without using such tools with personal data, including collection, recording, systematization, accumulation, storage, clarification (update, change), extraction, use, transfer (distribution, provision, access), depersonalization, blocking, deletion, destruction of personal data;</li>'+
        '<li class="list-unstyled">Operator - a state body, municipal body, legal or natural person, independently or jointly with other persons organizing and (or) carrying out the processing of personal data, as well as determining the purposes of processing personal data, the composition of personal data to be processed, actions (operations) performed with personal data;</li>'+
        '<li class="list-unstyled">Personal data - any information relating directly or indirectly to a specific or identifiable User of the website <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>;</li>'+
        '<li class="list-unstyled">User - any visitor to the website <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>;</li>'+
        '<li class="list-unstyled"> Provision of personal data - actions aimed at disclosing personal data to a certain person or a certain circle of persons;</li>'+
        '<li class="list-unstyled">Dissemination of personal data - any actions aimed at disclosing personal data to an indefinite circle of persons (transfer of personal data) or at acquaintance with the personal data of an unlimited number of persons, including the disclosure of personal data in the media, posting on information and telecommunication networks or providing access to personal data in any other way;</li>'+
        '<li class="list-unstyled">Cross-border transfer of personal data - the transfer of personal data to the territory of a foreign state to the authority of a foreign state, a foreign individual or foreign legal entity;</li>'+
        '<li class="list-unstyled">Destruction of personal data - any actions as a result of which personal data are destroyed irrevocably with the impossibility of further restoring the content of personal data in the personal data information system and (or) as a result of which material carriers of personal data are destroyed.</li>'+
        '</p>'+
        '<h4 class="card-subtitle mb-2 text-muted"> 3. The Operator can process the following personal data of the User</h4>'+
        '<p class="card-text">'+

        '<li class="list-unstyled">Full Name;</li>'+
        '<li class="list-unstyled">Email address;</li>'+
        '<li class="list-unstyled">Place of work;</li>'+
        '<li class="list-unstyled">Cell phone number.</li>'+

        '</p>'+


        '<p class="card-text">Also, the site collects and processes anonymized data about visitors (including cookies) using Internet statistics services (Yandex Metrica and Google Analytics and others.</p>'+

        '<h4 class="card-subtitle mb-2 text-muted">4. Purposes of processing personal data</h4>'+

        '<p class="card-text">The purpose of processing the User\'s personal data is to inform the User by sending emails; providing the User with access to services, information and / or materials contained on the website; Collection of data and materials for participation in the conference. Also, the Operator has the right to send the User notifications about new products and services, special offers and various events. The user can always refuse to receive informational messages by sending an email to the Operator <a class="card-link" href="mailto:lections@ismu.baikal.ru">lections@ismu.baikal.ru</a> marked "Refusal of notifications". Anonymized User data collected using Internet statistics services are used to collect information about the actions of Users on the site, improve the quality of the site and its content.</p>'+

        '<h4 class="card-subtitle mb-2 text-muted">5. Legal basis for the processing of personal data</h4>'+
        '<p class="card-text">The Operator processes the User\'s personal data only if filled in and / or sent by the User independently through special forms located on the website <a href="https://portal.ismu.baikal.ru" class="card-link">https://portal.ismu.baikal.ru</a>. By filling out the appropriate forms and / or sending his personal data to the Operator, the User agrees with this Policy. The Operator processes anonymized data about the User if this is allowed in the User\'s browser settings (the storage of cookies and the use of JavaScript technology are enabled).</p>'+

        '<h4 class="card-subtitle mb-2 text-muted">6. The procedure for collecting, storing, transferring and other types of processing of personal data</h4>'+
        '<p class="card-text">The security of personal data processed by the Operator is ensured through the implementation of legal, organizational and technical measures necessary to fully comply with the requirements of the current legislation in the field of personal data protection.</p> The operator ensures the safety of personal data and takes all possible measures to exclude access to personal data of unauthorized persons. The User\'s personal data will never, under any circumstances, be transferred to third parties, except in cases related to the implementation of the current legislation. In the event of inaccuracies in personal data, the User can update them independently by sending a notification to the Operator at the Operator\'s e-mail address lections@ismu.baikal.ru marked "Updating personal data". \n' +
    'The period for processing personal data is unlimited. The user can revoke his consent to the processing of personal data at any time by sending a notification to the Operator via e-mail to the Operator\'s email address <a class="card-link" href="mailto:lections@ismu.baikal.ru">lections@ismu.baikal.ru</a> marked "Withdrawal of consent to the processing of personal data».</p>'+

        '<h4 class="card-subtitle mb-2 text-muted">7. Cross-border transfer of personal data</h4>'+
    '<p class="card-text">Before starting the cross-border transfer of personal data, the operator is obliged to make sure that the foreign state, to whose territory it is supposed to transfer personal data, provides reliable protection of the rights of subjects of personal data. Cross-border transfer of personal data on the territory of foreign states that do not meet the above requirements can be carried out only if there is a written consent of the subject of personal data for the cross-border transfer of his personal data and / or execution of an agreement to which the subject of personal data is a party.</p>'+

            '<h4 class="card-subtitle mb-2 text-muted">8. Final provisions</h4>'+
        '<p class="card-text">The user can receive any clarifications on issues of interest regarding the processing of his personal data by contacting the Operator via e-mail <a class="card-link" href="mailto:lections@ismu.baikal.ru">lections@ismu.baikal.ru</a>. This document will reflect any changes in the personal data processing policy by the Operator. The policy is valid indefinitely until it is replaced by a new version. The current version of the Policy is freely available on the Internet at <a href="https://portal.ismu.baikal.ru/politic" class="card-link">https://portal.ismu.baikal.ru/politic</a>. </p>'+

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