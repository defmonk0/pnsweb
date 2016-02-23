Template.customlinks.helpers({
	"links": function() {
		return UserData.find({'_id': Meteor.userId()}).fetch()[0].links;
	}
});