$(document).ready( () => {
	$('form').submit(function (evt) {
		// Todo: Add info when no results are returned
		// Todo: Rewrite using fetch API
		evt.preventDefault();
		const submitField = $('#search');
		const submitButton = $('#submit');

		const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
		const animal = submitField.val();
		const flickrOptions = {
			tags: animal,
			format: "json"
		};

		toggleSearchField(false);
		$.getJSON(flickrAPI, flickrOptions, data => {
			let photoHTML = "<ul>";
			data.items.forEach( photo => {
				photoHTML += `
					<li class="grid-25 tablet-grid-50">
						<a href="${photo.link}" class="image">
							<img src="${photo.media.m}">
						</a>
					</li>`;
			});
			photoHTML += '</ul>';
			$('#photos').html(photoHTML);
			toggleSearchField(true);
		});

		function toggleSearchField(action) {
			if (action) {
				submitButton.attr("disabled", false).val("Search");
				submitField.prop("disabled", false);
			} else {
				submitButton.attr("disabled", true).val("Searching...");
				submitField.prop("disabled", true);
			}

		}
	});
});