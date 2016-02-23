Meteor.publish('selfUserData', function() {
	return UserData.find({'_id': this.userId});
});

Meteor.publish('otherUserData', function() {
	var q = UserData.find({'_id': this.userId}).fetch();
	if(q.length > 0 && q[0].isAdmin)
		return UserData.find();
	else
		return UserData.find({}, {fields: {'isAdmin': 1, 'isVeteran': 1, 'isApproved': 1}});
});

Meteor.publish('payoutUsers', function() {
	var q = PayoutUsers.find();
	return q;
});

Meteor.methods({
	// REMOVE THIS LATER, HOLY SHIT THIS IS BAD
	// 'makeAdmin': function(pass, id) {
	// 	if(pass == "penisesarebest")
	// 		UserData.update({'_id': id}, {$set:{
	// 			'isAdmin': true
	// 		}}, {'upsert': true});
	// },
	// 'remUser': function(pass, id) {
	// 	if(pass == "penisesarebest")
	// 		UserData.remove({'_id': id});
	// },
	'saveUser': function(pn, tz, li, api) {
		UserData.update({'_id': Meteor.userId()}, {$set:{
			'phonenum': pn,
			'timezone': tz,
			'links': li
		}}, {'upsert': true});
	},
	'addAPI': function(added) {
		var apis = [], temp;
		var q = UserData.find({'_id': Meteor.userId()}).fetch();
		if(q.length == 1)
			if(temp = q[0].apis)
				apis = temp;
		apis.push(added);
		UserData.update({'_id': Meteor.userId()}, {$set:{
			'apis': apis
		}}, {'upsert': true});
	},
	'remAPI': function(removed) {
		var apis = [], temp;
		if(temp = UserData.find({'_id': Meteor.userId()}).fetch()[0].apis)
			apis = temp;
		apis = apis.filter(function(e, i, arr) {
			if(e.id == removed.id || e.key == removed.key)
				return false;
			return true;
		});
		UserData.update({'_id': Meteor.userId()}, {$set:{
			'apis': apis
		}}, {'upsert': true});
	},
	'updateStatus': function(id, type, state) {
		var data = {};
		data[type] = state;
		UserData.update({'_id': id}, {$set: data}, {'upsert': true});
	},
	'addPayoutUser': function(user) {
		PayoutUsers.update({'charName': user.charName}, {$set: user}, {'upsert': true});
	},
	'remPayoutUser': function(user) {
		PayoutUsers.remove({'charName': user.charName});
	}
});