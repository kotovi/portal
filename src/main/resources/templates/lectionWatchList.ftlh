<#import "parts/common.ftlh" as c>
<#import "parts/footer.ftlh" as f>

<@c.page>
    <script type="text/javascript">
        var courceId = ${courceId};
    </script>
    <#noparse>
        <div class="container">
            <div class="starter-template">
                <div id="app"></div>
                <script src="/js/student/lectionWatchList.js"></script>
            </div>
        </div>
    </#noparse>
</@c.page>
<@f.page>
</@f.page>