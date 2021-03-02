
<#import "parts/common.ftlh" as c>
<#import "parts/footer.ftlh" as f>

<@c.page>
    <div class="container">

    <div class="row" style="margin-top:20px">
        <div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3">
            <form action="login" method="post">
                <fieldset>
                    <div class="card">
                            <div class="card-header">
                                <ul class="nav nav-pills card-header-pills">
                                    <li class="nav-item">
                                        <a class="nav-link active" href="/login">Вход </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/oauth_login">Вход через ISMU</a>
                                    </li>
                                </ul>
                            </div>
                        <div class="card-body">
                            <div class="form-group">
                                <input type="text" name="username" id="username" class="form-control input-lg"
                                       placeholder="Имя пользователя" required="true" autofocus="true"/>
                            </div>
                            <div class="form-group">
                                <input type="password" name="password" id="password" class="form-control input-lg"
                                       placeholder="Пароль" required="true"/>
                            </div>
                            <div class="form-group">
                                <input type="submit"  class="btn btn-primary btn-block" value="Войти"/>
                            </div>
                        </div>
                        <div class="card-footer text-muted">
                            <a class="card-link" href="/passwordrequest" >Восстановить пароль</a>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
    </div>
</@c.page>
<@f.page>
</@f.page>