Template.settings.events({
	'submit #settingsform': function(e, tmpl) {
		e.preventDefault();
		var phonenum, timezone, links;
		if(tmpl.find('#phonenum').value != null)
			phonenum = tmpl.find('#phonenum').value;
		if(tmpl.find('#timezone').value != null)
			timezone = tmpl.find('#timezone').value;
		if(tmpl.find('#link1').value != null && tmpl.find('#link2').value != null && tmpl.find('#link3').value != null && tmpl.find('#link4').value != null)
			links = [
				{"url": tmpl.find('#link1').value, "name": tmpl.find('#linkname1').value}, 
				{"url": tmpl.find('#link2').value, "name": tmpl.find('#linkname2').value}, 
				{"url": tmpl.find('#link3').value, "name": tmpl.find('#linkname3').value}, 
				{"url": tmpl.find('#link4').value, "name": tmpl.find('#linkname4').value}
			].filter(function(e, i, arr) {
				if(e.url == "" || e.name == "")
					return false;
				return true;
			});
		var apis = [];
		Meteor.call('saveUser', phonenum, timezone, links, apis, function(error, result) {
			alert("Saved successfully!");
		});
	},
	'click #addAPI': function(e, tmpl) {
		e.preventDefault();
		var id = tmpl.find('#apiid').value;
		var key = tmpl.find('#apikey').value;
		if(id != "" && key != "")
			Meteor.call('addAPI', {'id': id, 'key': key});
		tmpl.find('#apiid').value = "";
		tmpl.find('#apikey').value = "";
	},
	'click #remAPI': function(e, tmpl) {
		e.preventDefault();
		var click = $(e.currentTarget);
		var id = click.attr("data-id");
		var key = click.attr("data-key");
		if(id != "" && key != "")
			Meteor.call('remAPI', {'id': id, 'key': key});
	}
});
Template.settings.helpers({
	"data": function() {
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length == 1)
			return {"phonenum": q[0].phonenum, "links": q[0].links};
		return null;
	}
});
Template.tzoptions.helpers({
	"timezones": function() {
		var tzs = moment.tz.names();
		for(var i = 0; i < tzs.length; i++) {
			var offset = moment.tz.zone(tzs[i]).offset(1420070400000);
			var sign = ((offset * -1) < 0) ? "-" : "+";
			var selected = "";
			var q = UserData.find({'_id': Meteor.userId()}).fetch();
			if(q.length == 1 && tzs[i] == q[0].timezone)
				selected = "selected";
			tzs[i] = {"display": tzs[i] + " (UTC " + sign + Math.abs(offset / 60) + ")", "value": tzs[i], "select": selected};
		}
		return tzs;
	}
});
Template.apilist.helpers({
	"apis": function() {
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length == 1)
			return q[0].apis;
		return null;
	}
});