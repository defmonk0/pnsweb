Template.utilitybar.rendered = function() {
	window.Holder.run();
	};

Template.utilitybar.helpers({
	"isAdmin": function() {
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length > 0)
			if(q[0].isAdmin == true)
				return true;
		return false;
	},
	"characters": function() {
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length > 0)
			return q[0].characters.sort(function(a, b) {
				return (b.skillPoints - a.skillPoints);
				// return (parseInt(moment(a.DoB).format('X')) - parseInt(moment(b.DoB).format('X')));
			});
	}
});