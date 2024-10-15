    (function watermark(text) {
      var body = document.getElementsByTagName('body')[0];
      var bg = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='200px' width='200px'>" +
        "<text transform='translate(50, 150) rotate(-45)' fill='rgb(245,45,45)' font-size='20' opacity='0.3'>" + text + "</text></svg>\")";
      body.style.backgroundImage = bg;
    })("Experimental Page");

