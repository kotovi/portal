
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
                                        <a class="nav-link" href="/login">Вход </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link active" href="/oauth_login">Вход через ISMU</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <#list urls as key, value>
                                        <a class="btn btn-primary btn-block" href="${value}" role="button">Учетная запись ${key}</a>
                                    </#list>
                                </div>
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