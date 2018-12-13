// Create the "Review spoiler" button
const $button = $('<button>Reveal Spoiler</button>');
// Append to web page
// (append adds element as the last one to the parent element)
$('.spoiler').append($button);

// Hide the spoiler text on page load
$('.spoiler span').hide();

// // Show the spoiler when pressed
// $('.spoiler button').click( () => {
// 	// Show the spoiler text
// 	$('.spoiler span').show();
// 	// Hide the "Reveal spoiler" button
// 	$('.spoiler button').hide();
// });

// Event delegation

$('.spoiler').on('click', 'button', event => {
	// event or evt or e
	// Show the spoiler text
	$(event.target).prev().show();

	// Hide the "Reveal spoiler" button
	$(event.target).hide();

});
