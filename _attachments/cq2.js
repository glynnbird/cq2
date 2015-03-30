
var url = location.origin
var db = location.pathname.split("/")[1];
url += "/" + db;

var scrollDown = function() {
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}

var step1 = function() {
  $('#step1button').attr("disabled", true);
  $.ajax({
    url: url + "/_index",
    method: "POST",
    contentType : "application/json", 
    dataType: "json",
    data: JSON.stringify({ index: {}, type: "text"})
  }).done(function( msg ) {
    $('#step1response').html(JSON.stringify(msg,null," "))
    $('#step1hidden').show();
    scrollDown();
  });
}

var step2 = function(q) {
  var find = null;
  switch(q) {
    case 1: 
      find = { selector:{ Movie_year: 2012 } };
      break;
    case 2: 
      find = { selector:{ Movie_year: 2012, Movie_rating:"R" } };
      break;  
    case 3: 
      find = { selector:{ "$text": "Robert" } };
      break;    
    case 4:
      find = { selector: { "Person_name": "Robert De Niro"}, sort: [ { "Movie_year:number": "asc"}]};
      break;
    case 5:
      find = { selector:{ Movie_year: { "$lt": 2012 } } };
      break;
    case 6:
      find = { selector:{ Movie_year: { "$lt": 2012 }, Movie_rating: { "$ne": "R" } } };
      break;
    case 7:
      find = { selector: { "Person_name": { "$in":  ["Robert De Niro", "Robert Duvall"] } } };
      break;
    case 8:
      find = { selector: { "$text": "Julia" }, fields: [ "Movie_name", "Movie_year" ],  sort: [ { "Movie_year:number": "desc"}] };
      break;  
      
      
      
  }
  $('#step2query').html(JSON.stringify(find,null," "));
  $('#step2hidden').show();
  $('#step2response').html("");
  $.ajax({
    url: url + "/_find",
    method: "POST",
    contentType : "application/json", 
    dataType: "json",
    data: JSON.stringify(find)
  }).done(function( msg ) {
    $('#step2response').html(JSON.stringify(msg,null," "))
    scrollDown();
  });
};

var bookmark = null;
var step3first = function() {
  var find = { 
               selector: { "Movie_year": { "$gt": 1970 }}, 
               sort: [ { "Movie_year:number": "asc"}], 
               limit: 10 
             };
  $('#step3firstbutton').attr("disabled", true);
  $('#step3nextbutton').attr("disabled", false);
             
  $('#step3query').html(JSON.stringify(find,null," "));
  $('#step3hidden').show();
  $('#step3response').html("");
  
  $.ajax({
    url: url + "/_find",
    method: "POST",
    contentType : "application/json", 
    dataType: "json",
    data: JSON.stringify(find)
  }).done(function( msg ) {
    bookmark = msg.bookmark;
    $('#step3response').html(JSON.stringify(msg,null," "))
    scrollDown();
  });
};

var step3next = function() {
  var find = { 
               selector: { "Movie_year": { "$gt": 1970 }}, 
               sort: [ { "Movie_year:number": "asc"}], 
               limit: 10,
               bookmark: bookmark
             };
  $('#step3query').html(JSON.stringify(find,null," "));
  $('#step3hidden').show();
  $('#step3response').html("");
  
  $.ajax({
    url: url + "/_find",
    method: "POST",
    contentType : "application/json", 
    dataType: "json",
    data: JSON.stringify(find)
  }).done(function( msg ) {
    bookmark = msg.bookmark;
    $('#step3response').html(JSON.stringify(msg,null," "))
    scrollDown();
  });
};

var step4 = function() {
  var q = $('#step4query').val();
  try {
    q = JSON.parse(q);
  } catch(e) {
    alert('Invalid JSON');
    return;
  }
  
  $('#step4response').html("");
  $('#step4query').val(JSON.stringify(q,null," "));
  $.ajax({
    url: url + "/_find",
    method: "POST",
    contentType : "application/json", 
    dataType: "json",
    data: JSON.stringify(q)
  }).done(function( msg ) {
    $('#step4response').html(JSON.stringify(msg,null," "))
    scrollDown();
  });
}