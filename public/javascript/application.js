(function (app, $, undefined) {
  app.View = {
    baseURL : "http://w3c-test.org/framework/api/",
    suites : null,
    agents : null,

    init : function () {
      $.get(this.baseURL + "testsuites", this.handleTestSuitesResponse);
      $.get(this.baseURL + "known-user-agents", this.handleUserAgentsResponse);
      $(".navbar a").click(function (e) {
        $($(this).attr("href")).removeClass("hide").siblings().addClass("hide");
        e.preventDefault();
      });
    },

    handleTestSuitesResponse : function (data) {
      app.View.suites = data;
      _.each(app.View.suites, function (suite) {
        $(".suites-list").append("<li><a href='" + app.View.baseURL + "result/" + suite.testsuite + "?scope=full'>" + suite.title + "</a></li>");
      });

      $(".suites-list li a").click(function (e) {
        $(this).parent().addClass("active").siblings().removeClass("active");
        $.get($(this).attr("href"), app.View.handleTestCasesResponse);
        e.preventDefault();
      })
    },

    handleUserAgentsResponse : function (data) {
      app.View.agents = data;
      _.each(app.View.agents, function (agent) {
        $(".user-agents-list").append("<li><a href='#" + agent.engine + "'>" + agent.engine + "</a></li>");

        var browserMarkup = "<ul>";
        _.each(agent.browsers, function (browser) {
          var uasMarkup = "<ul class='hide'>";
          _.each(browser.platforms, function (platform) {
            _.each(platform.uas, function (ua) {
              uasMarkup += "<li>" + ua.useragent + "</li>";
            });
          });
          uasMarkup += "</ul>";
          browserMarkup += "<li><a href='#'>" + browser.browser + "</a>" + uasMarkup + "</li>";
        });
        browserMarkup += "</ul>";
        $(".user-agents-details-list").append("<div id='" + agent.engine + "' class='hide'>" + browserMarkup + "</div>");
      });

      $(".user-agents-list li a").click(function (e) {
        $(this).parent().addClass("active").siblings().removeClass("active");
        $($(this).attr("href")).removeClass("hide").siblings().addClass("hide");
        e.preventDefault();
      });

      $(".user-agents-details-list a").click(function (e) {
        $(this).next("ul").toggleClass("hide");
        e.preventDefault();
      });
    },

    handleTestCasesResponse : function (data) {
      $(".results-list").html("");

      _.each(data, function (result) {
        var resultsMarkup = "<ul class='unstyled'>";
        _.each(_.keys(result.results_by_engine), function (engineKey) {
          resultsMarkup += "<li><h4>" + engineKey + "</h4>";
          var engineVersionsMarkup = "<ul>";
          _.each(_.keys(result.results_by_engine[engineKey]), function (versionKey) {
            var passResult = result.results_by_engine[engineKey][versionKey].result;
            var labelType = (passResult === "pass" ? "label-success" : (passResult === "fail" ? "label-important" : "label-warning"));
            engineVersionsMarkup += "<li><span>" + result.results_by_engine[engineKey][versionKey].useragent_id + " (" + versionKey + ")</span> <span class='label " + labelType + "'>" + passResult + "</span></li>"
          });
          resultsMarkup += engineVersionsMarkup + "</ul></li>";
        });
        resultsMarkup += "</ul>";

        $(".results-list").append("<li>" +
          "<a href='#result_" + result.id + "' class='visibilty-toggler'>" + result.title + "</a>" +
          "<a href='" + result.formatURIs.html + "' target='_blank' class='test-link'>View test</a>" +
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
