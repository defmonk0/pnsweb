Router.configure({ layoutTemplate:'layout' });

Router.map(function() {
	this.route('home', {path:'/'});
	this.route('news', {path:'/news'});
	this.route('links', {path:'/links'});
	this.route('members', {path:'/members'});
	this.route('settings', {path:'/settings'});
	this.route('tools', {path:'/tools'});
	this.route('whtools', {path:'/whtools'});
	this.route('admin', {path:'/admin'});
	this.route('npc', {path:'/npc'});
	this.route('payouts', {path:'/payouts'});
	this.route('payoutsuser', {path:'/payoutsuser'});
	this.route('payoutssalvager', {path:'/payoutssalvager'});
	this.route('payoutsadmin', {path:'/payoutsadmin'});
	});