(function (app, $, undefined) {
  app.View = {
    baseURL : "http://w3c-test.org/framework/api/",
    suites : null,

    init : function () {
      $.get(this.baseURL + "testsuites", this.handleTestSuitesResponse);
    },

    handleTestSuitesResponse : function (data) {
      app.View.suites = data;
      _.each(app.View.suites, function (suite) {
        $(".suites-list").append("<li><a href='" + app.View.baseURL + "result/" + suite.testsuite + "?scope=full'>" + suite.title + "</a></li>");
      });

      $(".suites-list li a").on("click", function (e) {
        $(this).parent().addClass("active").siblings().removeClass("active");
        $.get($(this).attr("href"), app.View.handleTestCasesResponse);
        e.preventDefault();
      })
    },

    handleTestCasesResponse : function (data) {
      console.log(data);

      $(".results-list").html("");

      _.each(data, function (result) {
        var resultsMarkup = "<ul class='unstyled'>";
        _.each(_.keys(result.results_by_engine), function (engineKey) {
          resultsMarkup += "<li><h4>" + engineKey + "</h4>";
          var engineVersionsMarkup = "<ul>";
          _.each(_.keys(result.results_by_engine[engineKey]), function (versionKey) {
            var passResult = result.results_by_engine[engineKey][versionKey].result;
            var labelType = (passResult === "pass" ? "label-success" : (passResult === "fail" ? "label-important" : "label-warning"));
            engineVersionsMarkup += "<li><span>" + versionKey + "</span> <span class='label " + labelType + "'>" + passResult + "</span></li>"
          });
          resultsMarkup += engineVersionsMarkup + "</ul></li>";
        });
        resultsMarkup += "</ul>";

        $(".results-list").append("<li>" +
          "<a href='#result_" + result.id + "' class='visibilty-toggler'>" + result.title + "</a>" +
          "<a href='"+result.formatURIs.html+"' target='_blank' class='test-link'>View test</a>" +
          "<div id='result_" + result.id + "' class='hide'>" +
          resultsMarkup +
          "</div>" +
          "</li>");
      });

      $(".results-list a.visibilty-toggler").on("click", function (e) {
        $($(this).attr("href")).toggleClass("hide");
        e.preventDefault();
      })
    }
  };

  $(function () {
    app.View.init();
  });

})(window.app = window.app || {}, jQuery);
