Template.members.helpers({
	"isApproved": function() {
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length > 0)
			if(q[0].isApproved == true)
				return true;
		return false;
	}
});