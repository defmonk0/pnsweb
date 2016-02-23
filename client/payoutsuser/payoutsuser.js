Template.payoutsuser.events({
	'click #addUser': function(e, tmpl) {
		e.preventDefault();
		var charName = tmpl.find('#charName').value;

		if(charName == undefined || charName == null || charName == "") {
			alert("No character name. Please check your input.");
			return null;
		}

		HTTP.call(
			'GET',
			'https://api.eveonline.com/eve/CharacterID.xml.aspx',
			{'params': {'names': charName}},
			function(err, httpres) {
				if(err != null) {
					alert("Failed HTTP call. Please check your input.");
					return null;
				}

				var index, id;
				index = httpres.content.indexOf('characterID="');
				id = httpres.content.substring(index + 13);
				index = id.indexOf('"');
				id = parseInt(id.substring(0, index));

				if(id == undefined || id == null || id == 0) {
					alert("Failed to find ID. Please check your input.");
					return null;
				}

				Meteor.call('addPayoutUser', {
					'charName': charName,
					'charID': id,
					'active': false
				});
				tmpl.find('#charName').value = "";
			}
		);
	},
	'click #updateChar': function(e, tmpl) {
		e.preventDefault();
		var click = $(e.currentTarget);
		var name = click.attr("data-name");
		var to = JSON.parse(click.attr("data-change-to"));
		if(name != undefined && name != "" && to != undefined && (to == true || to == false)) {
			Meteor.call('addPayoutUser', {'charName': name, 'active': to});
		}
	}
});

Template.payoutsuser.helpers({
	"isApproved": function() {
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length > 0)
			if(q[0].isApproved == true)
				return true;
		return false;
	}
});

Template.characterlist.helpers({
	"characters": function() {
		var charList = PayoutUsers.find({'active': false}).fetch();
		return charList;
	}
});

Template.activelist.helpers({
	"characters": function() {
		var activeList = PayoutUsers.find({'active': true}).fetch();
		return activeList;
	}
});