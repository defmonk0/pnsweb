Template.registerHelper('formatVariable', function(value, type) {
	switch(type) {
		case "number":
			return value.toLocaleString();

		case "short":
			// If 0, do nothing.
			if(value == 0) return "0";
			// Setup vars for suffix.
			var base = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
			var suffixes = "kmbtq";
			// We're greater than 1k.
			if(base - 1 >= 0) {
				value = value / Math.pow(1000, base);
				value = Math.floor(value * 10) / 10;
				value = String(value);
				return value + suffixes[base - 1];
			}
			// Less than 1k. No abbreviation.
			return '' + Math.floor(value * 10) / 10;

		case "date":
			return moment(value).format('YYYY-MM-DD hh:mm:ss A');

		case "datereadable":
			return moment(value).format('MMMM Do YYYY, h:mm:ss A');
	}
});

// 106.374
//  67.909