$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '120px' });
  client.get('ticket.requester').then(
	function(data) {
		var user_data = data['ticket.requester']
		var user_id = user_data.id;
		var user_email = user_data.email;
	        var ind = user_email.indexOf("@");
                var VTUser = user_email.slice(0,ind);
	        requestVTUserInfo(VTUser);
	}
  );
});

function requestVTUserInfo(VTUser) {
	var jsonFile = VTUser + '.json' ;
	$.getJSON(jsonFile).then(
	    function(json) {
	        var user_data = json.data ;
	        showVTInfo(user_data);
    	    },
            function(response) {
      		showVTError(VTUser,response);
    	    }
	);
}

function showVTInfo(data) {
  var requester_data = {
    'user': data.id,
    'link': data.links.self,
    'user_since': formatDate(data.attributes.user_since * 1000),
    'vti_allowed': data.attributes.quotas.intelligence_searches_monthly.allowed,
    'vti_used': data.attributes.quotas.intelligence_searches_monthly.used,
  };
  var source = $("#requester-template").html();
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  $("#content").html(html);
}

function showVTError(user, response) {
  var error_data = {
    'user': user
  };
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}

function formatDate(date) {
  var cdate = new Date(date);
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  date = cdate.toLocaleDateString("es-ES", options);
  return date;
}
