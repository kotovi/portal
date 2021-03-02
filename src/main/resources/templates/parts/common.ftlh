<#macro page>
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <title>Portal</title>

        <link type="text/css" rel="stylesheet" href="/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="/css/vue-multiselect.min.css" />

        <link rel="stylesheet" type="text/css"  href="/css/main.css" />

        <script src="/js/public/vue.js"></script>
        <script src="/js/public/vue-resource.js"></script>
        <script src="/js/public/lodash.js"></script>
        <script src="/js/public/jquery-3.2.1.slim.min.js"></script>
        <script src="/js/public/popper.min.js"></script>
        <script src="/js/public/bootstrap.min.js"></script>
        <script src="/js/public/vue-multiselect.min.js"></script>


        <script src="/js/public/axios.min.js"></script>


        <script src="/js/public/polyfill.min.js"></script>
        <script src="/js/public/bootstrap-vue.min.js"></script>
        <script src="/js/public/sockjs.min.js"></script>
        <script src="/js/public/base64js.min.js"></script>

        <script src="/js/public/stomp.js"></script>
        <script src="/js/public/vuex.js"></script>




        <link
                type="text/css"
                rel="stylesheet"
                href="/css/bootstrap-vue.min.css"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,300,100&subset=cyrillic,latin">

        <style>


        </style>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-139594103-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-139594103-1');
        </script>
        <script>

            $(document).ready(function() {

                var docHeight = $(window).height();
                var footerHeight = $('#footer').height();
                var footerTop = $('#footer').position().top + footerHeight;

                if (footerTop < docHeight) {
                    $('#footer').css('margin-top', 10+ (docHeight - footerTop) + 'px');
                }
            });
        </script>
    </head>
    <body class="d-flex flex-column min-vh-100">
        <div>
            <div id="app-nav"></div>
            <script src="/js/public/navbar.js"></script>
        </div>


    <#nested>
    </body>
    </html>
</#macro>
