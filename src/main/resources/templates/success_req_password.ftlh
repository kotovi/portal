<#import "parts/common.ftlh" as c>
<@c.page>
    <#noparse>
        <div class="container">
            <div  style="margin: 130px; background: #fff;" class="starter-template">
                <div class="card">
                    <h5 class="text-white  card-header" style="background: #007bff;">Сброс пароля</h5>
                    <div class="card-body">
                        <p class="card-text">Запрос на сброс пароля успешно сформирован. Ожидайте письмо на указанный при
                            регистрации адрес электронной почты.</p>
                        <p class="card-text">Письмо сожержит ссылку для подтверждения сброса пароля,
                            для завершения процедуры необходимо перейти по ссылке. Уведомления отправляются с почтового адреса
                            lections@ismu.baikal.ru, так  же рекомендуем проверить папки с нежелательными письмами, возможно
                            наше письмо могло попасть в спам.</p>
                        <a href="/" class="btn btn-primary" style=" margin: 2px;">Перейти на главную</a>
                    </div>
                </div>
            </div>
        </div>
    </#noparse>
</@c.page>
<#import "parts/footer.ftlh" as f>
<@f.page></@f.page>