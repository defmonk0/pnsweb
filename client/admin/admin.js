Template.admin.events({
	"change input.data_checkbox": function(e, tmpl) {
		var data = e.target.id.split("_").concat([e.target.checked]);
		if(data.length == 3)
			Meteor.call('updateStatus', data[1], data[0], data[2]);
	}
});
Template.admin.helpers({
	"currentUserIsAdmin": function() {
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length > 0)
			if(q[0].isAdmin == true)
				return true;
		return false;
	},
	"users": function(e) {
		var temp = UserData.find().fetch();
		for(var i = 0; i < temp.length; i++) {
			if(temp[i].characters != undefined)
				temp[i].characters.sort(function(a, b) {
					return (b.skillPoints - a.skillPoints);
					// return (parseInt(moment(a.DoB).format('X')) - parseInt(moment(b.DoB).format('X')));
				});
		}
		temp.sort(function(a, b) {
			var ablank = (a.characters == undefined || !a.characters.length > 0);
			var bblank = (b.characters == undefined || !b.characters.length > 0);
			if(ablank && bblank)
				return 0;
			if(a.characters == undefined || !a.characters.length > 0)
				return 1;
			if(b.characters == undefined || !b.characters.length > 0)
				return -1;
			return a.characters[0].name.toLowerCase().localeCompare(
				b.characters[0].name.toLowerCase()
			);
		});
		return temp;
	}
});
