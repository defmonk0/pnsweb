Meteor.subscribe('selfUserData');
Meteor.subscribe('otherUserData');
Meteor.subscribe('payoutUsers');

Transitioner.default({
	in: 'transition.fadeIn',
	out: 'transition.fadeOut'
});
