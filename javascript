$('.test').each(function() {
    var feature = $(this);
    var scenarios = feature.find('.node .test-name');
    var csuOrGsc = [];
    var otherStatuses = [];
    
    scenarios.each(function() {
        var scenarioName = $(this).text().trim();
        var statusElem = $(this).closest('.node').find('.status');
        var status = statusElem.text().toLowerCase();

        if (/^take\s.*from\s(csu|gsc)$/i.test(scenarioName)) {
            csuOrGsc.push(status);
        } else {
            otherStatuses.push(status);
        }
    });

    // Check if all other scenarios are passed
    var allOthersPassed = otherStatuses.every(function(s) { return s === 'pass'; });

    // Logic for CSU/GSC scenarios: one pass, one skip
    var csuGscPassCount = csuOrGsc.filter(s => s === 'pass').length;
    var csuGscSkipCount = csuOrGsc.filter(s => s === 'skip').length;
    var csuGscFailCount = csuOrGsc.filter(s => s === 'fail').length;

    var featureStatusElem = feature.find('> .test-heading .status');

    if (
        csuOrGsc.length === 2 &&
        csuGscPassCount === 1 &&
        csuGscSkipCount === 1 &&
        csuGscFailCount === 0 &&
        allOthersPassed
    ) {
        // Mark feature as pass
        featureStatusElem.removeClass('skip fail').addClass('pass').text('Pass');
        featureStatusElem.css('background', '#28a745');
    } else if (otherStatuses.includes('fail') || csuGscFailCount > 0) {
        // Mark feature as fail
        featureStatusElem.removeClass('pass skip').addClass('fail').text('Fail');
        featureStatusElem.css('background', '#dc3545');
    } else if (otherStatuses.includes('skip') || csuGscSkipCount === 2) {
        // Mark feature as skip
        featureStatusElem.removeClass('pass fail').addClass('skip').text('Skip');
        featureStatusElem.css('background', '#ffc107');
    }
});
