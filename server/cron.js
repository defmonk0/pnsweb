SyncedCron.config({
	collectionName: "CronHistory"
});

SyncedCron.add({
	name: "updateApi",
	schedule: function(parser) {
		return parser.text("every 2 hours");
		// return parser.text("every 30 seconds");
	},
	job: function() {
		// Load our users.
		var users = UserData.find().fetch();

		// Iterate over them.
		for(var i = 0; i < users.length; i++) {
			// Create our array for storing characters.
			var characters = [];

			// If they have api keys.
			if(users[i].apis != undefined) {
				// Iterate over those.
				for(var j = 0; j < users[i].apis.length; j++) {
					// Create our array for storing character IDs.
					var characterIDs = [];

					// Get the basic key info.
					try {
						// Hit CCP's API.
						var keyinfores = HTTP.get(
							"https://api.eveonline.com/account/APIKeyInfo.xml.aspx?keyID=" +
							users[i].apis[j].id +
							"&vCode=" +
							users[i].apis[j].key
						);

						// Parse our xml.
						xml2js.Parser().parseString(
							keyinfores.content,
							function(err, keyinfoparsed) {
								if(err == null) {
									// Extract it so it's not retarded.
									keyinfoparsed = keyinfoparsed.eveapi.result[0].key[0];

									// Save our basic info.
									users[i].apis[j].info = keyinfoparsed.$;

									// Extract our character IDs and save them.
									for(var k = 0; k < keyinfoparsed.rowset[0].row.length; k++)
										characterIDs.push(keyinfoparsed.rowset[0].row[k].$.characterID);
								}
							}
						);
					} catch(e) {
						// We failed to retrieve info from API. No access.
						users[i].apis[j].info = {
							'accessMask': -1
						};
					}

					// If our API is actually useful.
					if(users[i].apis[j].info.accessMask != undefined &&
						users[i].apis[j].info.accessMask != -1) {
						for(var k = 0; k < characterIDs.length; k++) {
							try {
								// Hit CCP's API.
								var charinfores = HTTP.get(
									"https://api.eveonline.com/char/CharacterSheet.xml.aspx?keyID=" +
									users[i].apis[j].id +
									"&vCode=" +
									users[i].apis[j].key +
									"&characterID=" +
									characterIDs[k]
								);

								// Parse our xml.
								xml2js.Parser().parseString(
									charinfores.content,
									function(err, charinfoparsed) {
										if(err == null) {
											// Extract it so it's not retarded.
											charinfoparsed = charinfoparsed.eveapi.result[0];
											//temp = temp.split(" ").join("T") + "+00:00";

											// Save our basic data back to the character.
											characters.push({
												"ancestry": charinfoparsed.ancestry[0],
												"balance": parseInt(charinfoparsed.balance[0]),
												"bloodLine": charinfoparsed.bloodLine[0],
												"characterID": charinfoparsed.characterID[0],
												"cloneJumpDate": charinfoparsed.cloneJumpDate[0],
												"corporationName": charinfoparsed.corporationName[0],
												"DoB": charinfoparsed.DoB[0],
												"freeRespecs": parseInt(charinfoparsed.freeRespecs[0]),
												"freeSkillPoints": parseInt(charinfoparsed.freeSkillPoints[0]),
												"gender": charinfoparsed.gender[0],
												"lastRespecDate": charinfoparsed.lastRespecDate[0],
												"name": charinfoparsed.name[0],
												"race": charinfoparsed.race[0],
												"skillPoints": 0,
											});

											// Grab our index.
											var index = characters.length - 1;

											// Fix our clone jump date.
											characters[index].cloneJumpDate =
												characters[index].cloneJumpDate.split(" ").join("T") + "+00:00";
											characters[index].cloneJumpDate =
												Date.parse(characters[index].cloneJumpDate);
											characters[index].cloneJumpDate =
												characters[index].cloneJumpDate > 0 ?
													characters[index].cloneJumpDate : null;

											// Fix our date of birth.
											characters[index].DoB =
												characters[index].DoB.split(" ").join("T") + "+00:00";
											characters[index].DoB =
												Date.parse(characters[index].DoB);
											characters[index].DoB =
												characters[index].DoB > 0 ?
													characters[index].DoB : null;

											// Fix our last attribute respec date.
											characters[index].lastRespecDate =
												characters[index].lastRespecDate.split(" ").join("T") + "+00:00";
											characters[index].lastRespecDate =
												Date.parse(characters[index].lastRespecDate);
											characters[index].lastRespecDate =
												characters[index].lastRespecDate > 0 ?
													characters[index].lastRespecDate : null;

											// Apply our alliance name if we have one.
											if(charinfoparsed.allianceName != undefined)
												characters[index].allianceName = charinfoparsed.allianceName[0];

											// Extract our skills list properly.
											var skills = null;
											for(var l = 0; l < charinfoparsed.rowset.length; l++) {
												if(charinfoparsed.rowset[l].$.name == "skills") {
													skills = charinfoparsed.rowset[l].row;
													break;
												}
											}

											// Add up our skillpoints.
											for(var l = 0; l < skills.length; l++) {
												characters[index].skillPoints += 
													parseInt(skills[l].$.skillpoints);
											}
										}
									}
								);
							} catch(e) {
								console.log(e);
							}
						}
					}
				}

				// Actually write our data back.
				UserData.update({'_id': users[i]._id}, {$set: {
					'apis': users[i].apis,
					'characters': characters
				}}, {'upsert': true});
			}
		}
	}
});

SyncedCron.start();