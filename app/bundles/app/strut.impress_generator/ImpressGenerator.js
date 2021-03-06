define(["handlebars", "common/Math2"], function(Handlebars, Math2) {
  var ImpressGenerator;
  var slideConfig = window.config.slide;

  ImpressGenerator = (function() {

    function ImpressGenerator() {
      var _this = this;
      Handlebars.registerHelper("renderComponent", function(componentModel) {
        var result;
        result = "";
        switch (componentModel.get("type")) {
          case "Image":
            if (componentModel.get("imageType") === "SVG") {
              result = JST["strut.impress_generator/SVGImage"](componentModel.attributes);
            } else {
              result = JST["strut.impress_generator/Image"](componentModel.attributes);
            }
            break;
          case "TextBox":
            result = JST["strut.impress_generator/TextBox"](_this.convertTextBoxData(componentModel.attributes));
            break;
          case "Video":
            if (componentModel.get("videoType") === "html5") {
              result = JST["strut.impress_generator/Video"](componentModel.attributes);
            } else {
              result = JST["strut.impress_generator/Youtube"](componentModel.attributes);
            }
            break;
          case "WebFrame":
            result = JST["strut.impress_generator/WebFrame"](componentModel.attributes);
        }
        return new Handlebars.SafeString(result);
      });
      Handlebars.registerHelper("scaleX", function(x) {
        return x * slideConfig.size.width / slideConfig.overviewSize.width;
      });
      Handlebars.registerHelper("scaleY", function(y) {
        return y * slideConfig.size.width / slideConfig.overviewSize.width;
      });
      Handlebars.registerHelper("toDeg", function(v) {
        return v * 180 / Math.PI;
      });
      Handlebars.registerHelper("negate", function(v) {
        return -1 * v;
      });
      Handlebars.registerHelper("round", function(v) {
        return Math2.round(v, 2);
      });
      Handlebars.registerHelper("extractBG", function(styles) {
        var browsers, prefix, result, style, _i, _len;
        if ((styles != null) && styles.length > 0) {
          result = "";
          style = styles[0];
          browsers = ["-moz-", "-webkit-", "-o-", "-ms-", ""];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            prefix = browsers[_i];
            result += "background-image: " + prefix + style + "; ";
          }
          return result;
        } else {
          return "";
        }
      });
      Handlebars.registerPartial("ComponentContainer", JST["strut.impress_generator/ComponentContainer"]);
      Handlebars.registerPartial("TransformContainer", JST["strut.impress_generator/TransformContainer"]);
      Handlebars.registerPartial("SVGContainer", JST["strut.impress_generator/SVGContainer"]);
    }

    ImpressGenerator.prototype.render = function(deckAttrs) {
      var cnt, colCnt, slides,
        _this = this;
      slides = deckAttrs.slides;
      colCnt = 6;
      cnt = 0;

      var minX, minY, maxX, maxY;

      slides.each(function(slide) {
        var x;
        x = slide.get("x");
        y = slide.get('y');
        if (!(x != null)) {
          slide.set("x", cnt * 160 + 30);
          slide.set("y", ((cnt / colCnt) | 0) * 160 + 80);
        }

        if (minX == null || x < minX)
          minX = x;
        if (minY == null || y < minY)
          minY = y;
        if (maxX == null || x > maxX)
          maxX = x;
        if (maxY == null || y > maxY)
          maxY = y;

        return ++cnt;
      });

      deckAttrs.overviewX = (maxX + minX) / 2;
      deckAttrs.overviewY = (maxY + minY) / 2;

      return JST["strut.impress_generator/ImpressTemplate"](deckAttrs);
    };

    ImpressGenerator.prototype.convertTextBoxData = function(attrs) {
      var copy;
      copy = _.extend({}, attrs);
      copy.text = new Handlebars.SafeString(attrs.text);
      return copy;
    };

    return ImpressGenerator;

  })();
  return new ImpressGenerator();
});
