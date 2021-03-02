<#import "parts/common.ftlh" as c>
<#import "parts/footer.ftlh" as f>

<@c.page>
    <!-- template for the modal component -->
    <script type="text/javascript">
        var tokenFromIsmu= "${tokenFromIsmu}";
    </script>

    <#noparse>
        <div class="container">
            <div class="starter-template">
                <div id="app"></div>
                <script src="/js/public/registration.js"></script>
            </div>
        </div>
    </#noparse>
</@c.page>

<@f.page></@f.page>