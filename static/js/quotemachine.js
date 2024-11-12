$(document).ready(function () {
  getNewQuote();
  $("#new-quote").click(getNewQuote);
});

let getNewQuote = () => {
  $.ajax({
    url: "https://dummyjson.com/quotes/random",
    type: "GET",

    success: function (result) {
      $("#text").html(result.quote);
      $("#author").html(result.author);
    },
  });
};