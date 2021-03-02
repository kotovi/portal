<#import "parts/common.ftlh" as c>
<#import "parts/footer.ftlh" as f>
<@c.page>
    <script type="text/javascript">
        var attemptId = ${attemptId};
    </script>
    <#noparse>
        <div class="container">
            <div class="starter-template">
                <div id="testAttempAnalysisApp"></div>
                <script src="/js/authentificated/testAttemptAnalysis.js"></script>
            </div>
        </div>
    </#noparse>


</@c.page>
<@f.page>
</@f.page>